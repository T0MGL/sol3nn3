import { CheckIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RETINAL_CELIMAX_COMPARISON } from "@/data/retinalCelimaxProduct";

const mobileOrderedOptions = [
  ...RETINAL_CELIMAX_COMPARISON.filter((o) => o.isHighlighted),
  ...RETINAL_CELIMAX_COMPARISON.filter((o) => !o.isHighlighted),
];

interface ComparisonSpecRowProps {
  label: string;
  value: string;
  isGood: boolean;
  highlight: boolean;
}

const ComparisonSpecRow = ({ label, value, isGood, highlight }: ComparisonSpecRowProps) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-sm text-muted-foreground flex-1">{label}</span>
    <div className="flex items-center gap-2">
      {isGood ? (
        <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={2.5} />
      ) : (
        <XMarkIcon className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" strokeWidth={2.5} />
      )}
      <span
        className={`text-sm font-bold text-right ${
          highlight && isGood ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  </div>
);

export const ComparisonTableRetinalCelimax = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [openIndex, setOpenIndex] = useState<number>(0);

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
    setScrollLeftStart(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftStart - walk;
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
        <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-6">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter px-2">
            ¿Por qué elegir el Retinal?
          </h2>
          <p className="text-base md:text-xl lg:text-2xl text-muted-foreground font-light px-2 max-w-3xl mx-auto leading-relaxed">
            Cuatro caminos para reafirmar la piel. Uno solo te da renovación real con tolerancia amable y sin receta.
          </p>
          <p className="hidden md:block text-sm md:text-base text-primary/80 font-medium">
            Arrastrá para comparar
          </p>
          <p className="md:hidden text-xs text-primary/80 font-medium">
            Tocá cada opción para ver el detalle
          </p>
        </div>

        <div className="md:hidden space-y-3">
          {mobileOrderedOptions.map((option, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={option.title}
                className={`relative border-2 rounded-lg overflow-hidden transition-colors ${
                  option.isHighlighted
                    ? "border-primary/60 bg-primary/5"
                    : "border-border/40 bg-card/30"
                }`}
              >
                {option.isHighlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-foreground text-[10px] font-bold tracking-[0.18em] uppercase text-center py-1.5">
                    La mejor opción
                  </div>
                )}

                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-4 text-left ${
                    option.isHighlighted ? "pt-9" : ""
                  }`}
                  aria-expanded={isOpen}
                >
                  <h3
                    className={`text-base font-bold leading-tight ${
                      option.isHighlighted ? "text-primary" : "text-foreground/85"
                    }`}
                  >
                    {option.title}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDownIcon
                      className={`w-5 h-5 ${
                        option.isHighlighted ? "text-primary" : "text-muted-foreground"
                      }`}
                      strokeWidth={2.5}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 pt-1 space-y-4 border-t border-border/30">
                        {option.specs.map((spec) => (
                          <ComparisonSpecRow
                            key={spec.label}
                            label={spec.label}
                            value={spec.value}
                            isGood={spec.isGood}
                            highlight={Boolean(option.isHighlighted)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block relative">
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
              {RETINAL_CELIMAX_COMPARISON.map((option) => (
                <div
                  key={option.title}
                  className={`p-8 md:p-10 border-2 w-[320px] flex-shrink-0 ${
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
                    {option.specs.map((spec) => (
                      <ComparisonSpecRow
                        key={spec.label}
                        label={spec.label}
                        value={spec.value}
                        isGood={spec.isGood}
                        highlight={Boolean(option.isHighlighted)}
                      />
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

export default ComparisonTableRetinalCelimax;
