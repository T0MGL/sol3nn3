import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import {
  UserIcon,
  PhoneIcon,
  HomeIcon,
  XMarkIcon,
  MapPinIcon,
  CheckIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { CheckoutProgressBar } from "./CheckoutProgressBar";
import { API_CONFIG } from "@/lib/api";
import { PARAGUAY_CITIES } from "@/data/paraguayCities";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PhoneNameFormProps {
  isOpen: boolean;
  onSubmit: (data: {
    name: string;
    phone: string;
    location: string;
    address: string;
    isGeolocated: boolean;
    lat?: number;
    long?: number;
    ruc?: string;
    email?: string;
    wantsInvoice?: boolean;
  }) => void;
  onClose?: () => void;
}

export const PhoneNameForm = ({ isOpen, onSubmit, onClose }: PhoneNameFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+595 ");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [ruc, setRuc] = useState("");
  const [email, setEmail] = useState("");
  const [customPrefix, setCustomPrefix] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [showManualLocation, setShowManualLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat?: number; long?: number }>({});
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    ruc?: string;
    email?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setPhone("+595 ");
      setCity("");
      setAddress("");
      setWantsInvoice(false);
      setRuc("");
      setEmail("");
      setCustomPrefix(false);
      setShowCitySuggestions(false);
      setDetectedLocation(null);
      setShowManualLocation(true);
      setLocationError(null);
      setIsLoadingLocation(false);
      setLocationCoords({});
      setErrors({});
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(e.target as Node)) {
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const isFakePhoneNumber = (digits: string): boolean => {
    if (/^(\d)\1+$/.test(digits)) return true;
    if (/^(\d{2,3})(\d)\2{2,}(\d)\3{2,}$/.test(digits)) return true;
    if (/^9[789]1?(123456|234567|345678|456789|987654|876543|765432)/.test(digits)) return true;
    if (digits.length >= 6) {
      const firstHalf = digits.slice(0, Math.floor(digits.length / 2));
      const secondHalf = digits.slice(-Math.floor(digits.length / 2));
      const reversedSecond = secondHalf.split("").reverse().join("");
      if (firstHalf === reversedSecond) return true;
    }
    return false;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (customPrefix) {
      if (!newValue.startsWith("+")) {
        setPhone("+" + newValue.replace(/[^0-9]/g, ""));
      } else {
        setPhone("+" + newValue.slice(1).replace(/[^0-9 ]/g, ""));
      }
      setErrors((prev) => ({ ...prev, phone: undefined }));
      return;
    }

    if (!newValue.startsWith("+595")) {
      setPhone("+595 ");
      return;
    }

    if (newValue === "+595") {
      setPhone("+595 ");
      return;
    }

    const afterPrefix = newValue.slice(5);
    const digits = afterPrefix.replace(/\D/g, "");
    const formatted = `+595 ${digits}`;
    setPhone(formatted);

    if (digits.length >= 8 && isFakePhoneNumber(digits)) {
      setErrors((prev) => ({ ...prev, phone: "Por favor, introduci un numero valido" }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!customPrefix) {
      const length = e.target.value.length;
      e.target.setSelectionRange(length, length);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!customPrefix) {
      const target = e.target as HTMLInputElement;
      if (target.selectionStart !== null && target.selectionStart < 5) {
        target.setSelectionRange(5, 5);
      }
    }
  };

  const handleUseLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalizacion");
      setIsLoadingLocation(false);
      setShowManualLocation(true);
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!isMountedRef.current || controller.signal.aborted) return;

        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(`${API_CONFIG.baseUrl}/api/reverse-geocode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
            signal: controller.signal,
          });

          if (!isMountedRef.current) return;

          if (!response.ok) {
            throw new Error(`Reverse geocoding failed: ${response.status}`);
          }

          const data = await response.json();

          if (!isMountedRef.current) return;

          const locationText = data.city || data.formattedAddress || "Paraguay";
          setDetectedLocation(locationText);
          setLocationCoords({ lat: latitude, long: longitude });
          setIsLoadingLocation(false);
        } catch (err) {
          if (!isMountedRef.current || controller.signal.aborted) return;

          setDetectedLocation("Paraguay (coordenadas GPS obtenidas)");
          setLocationCoords({ lat: latitude, long: longitude });
          setIsLoadingLocation(false);
        }
      },
      () => {
        if (!isMountedRef.current) return;

        setLocationError("Permiso denegado para acceder a tu ubicacion");
        setDetectedLocation(null);
        setIsLoadingLocation(false);
        setShowManualLocation(true);
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 300000 }
    );
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      phone?: string;
      address?: string;
      city?: string;
      ruc?: string;
      email?: string;
    } = {};

    if (!name || name.trim().length < 3) {
      newErrors.name = "Nombre requerido (min. 3 caracteres)";
    } else if (name.length > 60) {
      newErrors.name = "Nombre demasiado largo (max. 60 caracteres)";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/.test(name)) {
      newErrors.name = "Solo letras, espacios y guiones";
    }

    if (customPrefix) {
      const allDigits = phone.replace(/\D/g, "");
      if (allDigits.length < 10) {
        newErrors.phone = "Numero invalido (inclui codigo de pais + numero)";
      }
    } else {
      const afterPrefix = phone.slice(5);
      const phoneDigits = afterPrefix.replace(/\D/g, "");
      if (phoneDigits.length < 8 || phoneDigits.length > 10) {
        newErrors.phone = "Telefono invalido (ej: +595 971 234567)";
      } else if (isFakePhoneNumber(phoneDigits)) {
        newErrors.phone = "Por favor, introduci un numero valido";
      }
    }

    if (!detectedLocation) {
      if (!city.trim()) {
        newErrors.city = "Selecciona una ciudad";
      }
      if (address.trim().length < 5) {
        newErrors.address = "Ingresa tu direccion (min. 5 caracteres)";
      }
    }

    if (wantsInvoice) {
      const cleanRuc = ruc.replace(/\D/g, "");
      if (cleanRuc.length < 6) {
        newErrors.ruc = "RUC requerido para factura";
      }
      const cleanEmail = email.trim();
      if (!cleanEmail) {
        newErrors.email = "Email requerido para factura";
      } else if (!EMAIL_REGEX.test(cleanEmail)) {
        newErrors.email = "Email invalido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filteredCities =
    city.trim().length >= 2
      ? PARAGUAY_CITIES.filter((c) =>
          c
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              city
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
        ).slice(0, 6)
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedRuc = ruc.trim();

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      location: detectedLocation || city.trim(),
      address: address.trim(),
      isGeolocated: !!detectedLocation,
      lat: locationCoords.lat,
      long: locationCoords.long,
      ruc: wantsInvoice && trimmedRuc ? trimmedRuc : undefined,
      email: wantsInvoice && trimmedEmail ? trimmedEmail : undefined,
      wantsInvoice,
    });

    setLoading(false);
  };

  const hasValidLocation = detectedLocation || (city.trim().length > 0 && address.trim().length >= 5);
  const isValidPhone = customPrefix
    ? phone.replace(/\D/g, "").length >= 10
    : (() => {
        const phoneDigitsOnly = phone.slice(5).replace(/\D/g, "");
        return phoneDigitsOnly.length >= 8 && phoneDigitsOnly.length <= 10 && !isFakePhoneNumber(phoneDigitsOnly);
      })();
  const isValidInvoice = !wantsInvoice || (
    ruc.replace(/\D/g, "").length >= 6 && EMAIL_REGEX.test(email.trim())
  );
  const isValid = name.trim().length >= 3 && isValidPhone && hasValidLocation && isValidInvoice;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/50 z-[100] flex items-center justify-center p-4 touch-none"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-[500px] bg-gradient-to-b from-secondary to-background border-2 border-primary rounded-2xl p-6 md:p-8 shadow-[0_20px_25px_-5px_rgba(192,139,122,0.2)] max-h-[90dvh] overflow-y-auto overscroll-contain touch-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CheckoutProgressBar currentStep={1} />
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50 -mt-1"
                    aria-label="Cerrar"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Trust Block */}
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Compra sin riesgo en Paraguay
                </p>
                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                  <span>+1.000 entregas realizadas</span>
                  <span>Soporte via WhatsApp</span>
                  <span>Pagas al recibir</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre completo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Ej: Maria Lopez"
                      maxLength={60}
                      className={`w-full pl-11 pr-4 py-3 bg-secondary border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.name ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Telefono WhatsApp */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Telefono WhatsApp
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      onFocus={handlePhoneFocus}
                      onClick={handlePhoneClick}
                      placeholder="Ej: +595 971 234567"
                      className={`w-full pl-11 pr-4 py-3 bg-secondary border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.phone ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (customPrefix) {
                        setCustomPrefix(false);
                        setPhone("+595 ");
                      } else {
                        setCustomPrefix(true);
                        setPhone("+");
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                        setTimeout(() => phoneInputRef.current?.focus(), 0);
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {customPrefix ? "Volver a +595 (Paraguay)" : "Otro pais?"}
                  </button>
                </div>

                {/* Factura (checkbox + RUC/email required on) */}
                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={wantsInvoice}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setWantsInvoice(next);
                        if (!next) {
                          setRuc("");
                          setEmail("");
                          setErrors((prev) => ({ ...prev, ruc: undefined, email: undefined }));
                        }
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-secondary text-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors select-none">
                      Necesito factura legal
                    </span>
                  </label>

                  <AnimatePresence initial={false}>
                    {wantsInvoice && (
                      <motion.div
                        key="invoice-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {/* RUC */}
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-foreground">RUC</label>
                          <div className="relative">
                            <DocumentTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              value={ruc}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9-]/g, "");
                                setRuc(val);
                                setErrors((prev) => ({ ...prev, ruc: undefined }));
                              }}
                              placeholder="Ej: 80012345-6"
                              maxLength={12}
                              required
                              aria-invalid={!!errors.ruc}
                              className={`w-full pl-11 pr-4 py-3 bg-secondary border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all ${
                                errors.ruc ? "border-red-500" : "border-border focus:border-primary"
                              }`}
                            />
                          </div>
                          {errors.ruc && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-400"
                            >
                              {errors.ruc}
                            </motion.p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-foreground">Email</label>
                          <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prev) => ({ ...prev, email: undefined }));
                              }}
                              placeholder="tu@email.com"
                              maxLength={120}
                              autoComplete="email"
                              inputMode="email"
                              required
                              aria-invalid={!!errors.email}
                              className={`w-full pl-11 pr-4 py-3 bg-secondary border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all ${
                                errors.email ? "border-red-500" : "border-border focus:border-primary"
                              }`}
                            />
                          </div>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-400"
                            >
                              {errors.email}
                            </motion.p>
                          )}
                          <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                            Te enviamos la factura al email.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Location Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                    <label className="block text-sm font-semibold text-foreground">
                      Ubicacion de entrega
                    </label>
                  </div>

                  {/* Detected Location (GPS) */}
                  {detectedLocation && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-primary/10 border border-primary/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-5 h-5 text-primary" />
                          <p className="text-sm font-semibold text-foreground">
                            {detectedLocation}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setDetectedLocation(null);
                            setLocationCoords({});
                            setShowManualLocation(true);
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cambiar
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Error (only when not in manual mode) */}
                  {locationError && !showManualLocation && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-xs text-red-400">{locationError}</p>
                    </motion.div>
                  )}

                  {/* Manual: Ciudad + Direccion (always visible when no GPS detection) */}
                  {showManualLocation && !detectedLocation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {/* GPS as secondary option */}
                      <button
                        type="button"
                        onClick={handleUseLocation}
                        disabled={isLoadingLocation}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {isLoadingLocation ? (
                          <>
                            <div className="inline-block w-3 h-3 border border-foreground/30 border-t-foreground rounded-full animate-spin" />
                            Detectando...
                          </>
                        ) : (
                          <>
                            <MapPinIcon className="w-3.5 h-3.5" />
                            Usar mi ubicacion actual
                          </>
                        )}
                      </button>

                      {/* Ciudad (autocomplete) */}
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-foreground">Ciudad</label>
                        <div className="relative" ref={cityInputRef}>
                          <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => {
                              setCity(e.target.value);
                              setShowCitySuggestions(true);
                              setErrors((prev) => ({ ...prev, city: undefined }));
                            }}
                            onFocus={() => {
                              if (city.trim().length >= 2) setShowCitySuggestions(true);
                            }}
                            placeholder="Ej: Asuncion, Luque, CDE..."
                            autoComplete="off"
                            className={`w-full pl-11 pr-4 py-3 bg-secondary border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all ${
                              errors.city ? "border-red-500" : "border-border focus:border-primary"
                            }`}
                          />
                          {showCitySuggestions && filteredCities.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-secondary border border-border rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                              {filteredCities.map((suggestion) => (
                                <button
                                  key={suggestion}
                                  type="button"
                                  onClick={() => {
                                    setCity(suggestion);
                                    setShowCitySuggestions(false);
                                    setErrors((prev) => ({ ...prev, city: undefined }));
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.city && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400"
                          >
                            {errors.city}
                          </motion.p>
                        )}
                      </div>

                      {/* Direccion */}
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-foreground">Direccion</label>
                        <div className="relative">
                          <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              setErrors((prev) => ({ ...prev, address: undefined }));
                            }}
                            placeholder="Ej: Av. Mariscal Lopez 1234"
                            className={`w-full pl-11 pr-4 py-3 bg-secondary border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all ${
                              errors.address ? "border-red-500" : "border-border focus:border-primary"
                            }`}
                          />
                        </div>
                        {errors.address && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400"
                          >
                            {errors.address}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Consent */}
                <p className="text-[11px] leading-relaxed text-muted-foreground text-center mt-4">
                  Al continuar, acepto los{" "}
                  <a
                    href="/terminos-y-condiciones"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    Terminos y Condiciones
                  </a>{" "}
                  y la{" "}
                  <a
                    href="/politica-de-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    Politica de Privacidad
                  </a>
                </p>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!isValid || loading}
                  variant="hero"
                  size="xl"
                  className="w-full h-14 text-base font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="inline-block w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                      Guardando...
                    </span>
                  ) : (
                    "Confirmar y continuar al pago"
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhoneNameForm;
