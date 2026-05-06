import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface UrgencyBannerProps {
  durationHours?: number;
  storageKey?: string;
  /** localStorage key tracking dismissal so the banner does not nag a returning visitor. */
  dismissKey?: string;
}

const STORAGE_KEY_DEFAULT = "solenne-urgency-target-v1";
const DISMISS_KEY_DEFAULT = "solenne-urgency-dismissed-v1";

const padTwo = (n: number) => String(n).padStart(2, "0");

export const UrgencyBanner = memo(({
  durationHours = 40,
  storageKey = STORAGE_KEY_DEFAULT,
  dismissKey = DISMISS_KEY_DEFAULT,
}: UrgencyBannerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const targetRef = useRef<Date | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (localStorage.getItem(dismissKey) === "1") {
      setDismissed(true);
      return;
    }

    const resolveTarget = (): Date => {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = new Date(stored);
        if (!Number.isNaN(parsed.getTime()) && parsed.getTime() > Date.now()) {
          return parsed;
        }
      }
      const next = new Date(Date.now() + durationHours * 60 * 60 * 1000);
      localStorage.setItem(storageKey, next.toISOString());
      return next;
    };

    targetRef.current = resolveTarget();

    const tick = () => {
      if (!targetRef.current) return;
      const distance = targetRef.current.getTime() - Date.now();

      if (distance <= 0) {
        setExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft((prev) =>
        prev.hours === hours && prev.minutes === minutes && prev.seconds === seconds
          ? prev
          : { hours, minutes, seconds },
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [durationHours, storageKey, dismissKey]);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(dismissKey, "1");
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.aside
        role="region"
        aria-label="Oferta limitada Kit Familiar"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-9 md:top-10 z-[55] w-full bg-gradient-to-r from-[#8C5648] via-[#A67265] to-[#8C5648] text-white shadow-[0_4px_18px_rgba(140,86,72,0.45)]"
      >
        <div className="container max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-12 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-3">
            <motion.div
              animate={{ scale: [1, 1.015, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1"
            >
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" aria-hidden="true" />

              {expired ? (
                <p className="text-[12px] sm:text-sm font-semibold tracking-tight truncate">
                  Oferta extendida: Kit Familiar 489.000 Gs (antes 567.000)
                </p>
              ) : (
                <p className="text-[12px] sm:text-sm font-semibold tracking-tight">
                  <span className="inline-block">
                    <span className="hidden sm:inline">Oferta limitada: </span>
                    Kit Familiar{" "}
                    <span className="tabular-nums">489.000</span>{" "}
                    <span className="opacity-80 line-through font-normal">567.000</span>
                  </span>
                  <span className="mx-1.5 opacity-70">·</span>
                  <span className="inline-flex items-baseline gap-1 font-bold tabular-nums">
                    <span aria-label={`${timeLeft.hours} horas`}>
                      {padTwo(timeLeft.hours)}
                    </span>
                    <span className="opacity-70">:</span>
                    <span aria-label={`${timeLeft.minutes} minutos`}>
                      {padTwo(timeLeft.minutes)}
                    </span>
                    <span className="opacity-70">:</span>
                    <span aria-label={`${timeLeft.seconds} segundos`}>
                      {padTwo(timeLeft.seconds)}
                    </span>
                  </span>
                  <span className="hidden sm:inline opacity-90 font-normal">
                    {" "}restante
                  </span>
                </p>
              )}
            </motion.div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Cerrar banner"
              className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 -mr-1 inline-flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
});

UrgencyBanner.displayName = "UrgencyBanner";

export default UrgencyBanner;
