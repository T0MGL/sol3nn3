import { CheckIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

const comparisons = [
  {
    title: "Extensiones de pestañas",
    specs: [
      { label: "Pestaña propia crece", value: "No, daño en la natural", isGood: false },
      { label: "Aplicación", value: "60 a 90 min en salón", isGood: false },
      { label: "Mantenimiento", value: "Retoque cada 2-3 sem", isGood: false },
      { label: "Costo cada 3 meses", value: "Gs. 800k a 1.500k", isGood: false },
    ],
  },
  {
    title: "Bimatoprost (Latisse)",
    specs: [
      { label: "Pestaña propia crece", value: "Sí, con receta", isGood: false },
      { label: "Aplicación", value: "Diaria, sin pausa", isGood: false },
      { label: "Riesgo de irritación", value: "30% irritación ocular", isGood: false },
      { label: "Costo cada 3 meses", value: "Gs. 600k a 900k", isGood: false },
    ],
  },
  {
    title: "Serum Solenne",
    specs: [
      { label: "Pestaña propia crece", value: "Sí, sin receta", isGood: true },
      { label: "Aplicación", value: "10 seg por noche", isGood: true },
      { label: "Riesgo de irritación", value: "Bajo, SkinSAFE 91", isGood: true },
      { label: "Costo cada 3 meses", value: "Gs. 119k a 279k", isGood: true },
    ],
    isHighlighted: true,
  },
  {
    title: "Rímel volumizador",
    specs: [
      { label: "Pestaña propia crece", value: "No, efecto del día", isGood: false },
      { label: "Aplicación", value: "Diaria, se corre", isGood: false },
      { label: "Mantenimiento", value: "Diario, desmaquillar", isGood: false },
      { label: "Costo cada 3 meses", value: "Gs. 80k a 250k", isGood: false },
    ],
  },
];

export const ComparisonTableSerum = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollRef.current) {
        scrollRef.current.style.cursor = "grab";
      }
    }
  };

  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-gradient-to-b from-background via-card/20 to-background">
      <div className="container max-w-[1200px] mx-auto">
        <div className="text-center mb-12 md:mb-16 space-y-4 md:space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter px-4">
            ¿Por qué elegir el Serum?
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light px-4 max-w-3xl mx-auto leading-relaxed">
            Cuatro caminos para tener pestañas más largas. Uno solo te las hace crecer de verdad sin receta y sin daño.
          </p>
          <p className="text-sm md:text-base text-primary/80 font-medium">
            Arrastrá para comparar
          </p>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center bg-primary/90 hover:bg-primary rounded-full shadow-lg transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="w-6 h-6 text-foreground" strokeWidth={2.5} />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center bg-primary/90 hover:bg-primary rounded-full shadow-lg transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="w-6 h-6 text-foreground" strokeWidth={2.5} />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScrollability}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-6 md:gap-8 pb-4 pt-6 min-w-max">
              {comparisons.map((option, index) => (
                <div
                  key={index}
                  className={`p-8 md:p-10 border-2 w-[280px] md:w-[320px] flex-shrink-0 ${
                    option.isHighlighted
                      ? "border-primary/50 bg-primary/5 md:scale-105"
                      : "border-border/50 bg-card/30"
                  } relative select-none`}
                >
                  {option.isHighlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-6 py-2 text-sm font-bold shadow-lg whitespace-nowrap">
                      LA MEJOR OPCIÓN
                    </div>
                  )}

                  <h3
                    className={`text-xl md:text-2xl font-bold mb-8 text-center leading-tight ${
                      option.isHighlighted ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {option.title}
                  </h3>

                  <div className="space-y-6">
                    {option.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-start justify-between gap-3">
                        <span className="text-sm text-muted-foreground flex-1">{spec.label}</span>
                        <div className="flex items-center gap-2">
                          {spec.isGood ? (
                            <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={2.5} />
                          ) : (
                            <XMarkIcon className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" strokeWidth={2.5} />
                          )}
                          <span
                            className={`text-sm font-bold text-right ${
                              option.isHighlighted && spec.isGood ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {spec.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTableSerum;
