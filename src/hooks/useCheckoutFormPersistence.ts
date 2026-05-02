import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "solenne_checkout_form_state";
const STORAGE_VERSION = 1;
const DEBOUNCE_MS = 300;

export interface PersistedCheckoutForm {
  v: number;
  name: string;
  phone: string;
  customPrefix: boolean;
  city: string;
  neighborhood: string;
  address: string;
  wantsInvoice: boolean;
  ruc: string;
  email: string;
  detectedLocation: string | null;
  locationLat?: number;
  locationLong?: number;
}

const EMPTY_STATE: PersistedCheckoutForm = {
  v: STORAGE_VERSION,
  name: "",
  phone: "+595 ",
  customPrefix: false,
  city: "",
  neighborhood: "",
  address: "",
  wantsInvoice: false,
  ruc: "",
  email: "",
  detectedLocation: null,
  locationLat: undefined,
  locationLong: undefined,
};

function readStorage(): PersistedCheckoutForm | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedCheckoutForm;
    if (!parsed || parsed.v !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(state: PersistedCheckoutForm): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage full or unavailable, fail silent
  }
}

export function clearCheckoutFormStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

/**
 * Returns the persisted form state read from sessionStorage on first render,
 * plus a debounced save function the form should call whenever any of the
 * tracked fields change. Restores across modal close/open within the same
 * browser session, clears when the tab closes (sessionStorage semantics).
 */
export function useCheckoutFormPersistence() {
  const initialRef = useRef<PersistedCheckoutForm>(readStorage() ?? EMPTY_STATE);
  const [initialState] = useState<PersistedCheckoutForm>(initialRef.current);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<PersistedCheckoutForm>(initialRef.current);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        // Flush latest pending state on unmount so a fast close does not
        // lose the most recent edits.
        writeStorage(latestRef.current);
      }
    };
  }, []);

  const persist = useCallback((next: Omit<PersistedCheckoutForm, "v">) => {
    const payload: PersistedCheckoutForm = { v: STORAGE_VERSION, ...next };
    latestRef.current = payload;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      writeStorage(payload);
      timerRef.current = null;
    }, DEBOUNCE_MS);
  }, []);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    latestRef.current = EMPTY_STATE;
    clearCheckoutFormStorage();
  }, []);

  return { initialState, persist, clear };
}
