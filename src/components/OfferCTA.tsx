import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HeartIcon } from "@heroicons/react/24/outline";
import { fadeInUpView } from "@/lib/animations";

interface OfferCTAProps {
  onBuyClick: () => void;
  selectedPrice: number;
  variant?: "default" | "minimal" | "mothersDay";
}

export const OfferCTA = ({ onBuyClick, selectedPrice, variant = "default" }: OfferCTAProps) => {
  const ctaLabel = `Aprovechar Oferta · Gs. ${selectedPrice.toLocaleString("es-PY")}`;

  if (variant === "mothersDay") {
    return (
      <motion.section
        {...fadeInUpView}
        className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-background via-[rgba(201,169,97,0.08)] to-background"
      >
        <div className="container max-w-[800px] mx-auto text-center space-y-5 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A961]/40 bg-[rgba(201,169,97,0.08)]">
            <HeartIcon className="w-3.5 h-3.5 text-[#C9A961]" strokeWidth={2.5} />
            <span className="text-[11px] md:text-xs font-semibold tracking-wide text-[#C9A961] uppercase">
              Día de la Madre · 15 de mayo
            </span>
          </div>

          <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground leading-tight max-w-[640px] mx-auto">
            Compralo para vos. Y uno para mamá.
          </h3>

          <p className="text-sm md:text-base text-muted-foreground font-light max-w-[520px] mx-auto leading-relaxed">
            Pedí hasta el 12 de mayo en Asunción y Gran Asunción para que llegue a tiempo. Hasta el 10 de mayo si vivís en interior.
          </p>

          <Button
            variant="hero"
            size="xl"
            className="w-full md:w-auto md:min-w-[320px] shadow-[0_0_50px_rgba(192,139,122,0.4)] text-base md:text-lg h-14 md:h-16"
            onClick={onBuyClick}
          >
            {ctaLabel}
          </Button>
        </div>
      </motion.section>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.section
        {...fadeInUpView}
        className="py-6 md:py-8 px-4 md:px-6 bg-gradient-to-b from-background via-primary/5 to-background"
      >
        <div className="container max-w-[800px] mx-auto text-center">
          <Button
            variant="hero"
            size="xl"
            className="w-full md:w-auto md:min-w-[320px] shadow-[0_0_50px_rgba(192,139,122,0.4)] text-base md:text-lg h-14 md:h-16"
            onClick={onBuyClick}
          >
            {ctaLabel}
          </Button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      {...fadeInUpView}
      className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-background via-primary/5 to-background"
    >
      <div className="container max-w-[800px] mx-auto text-center">
        <Button
          variant="hero"
          size="xl"
          className="w-full md:w-auto md:min-w-[320px] shadow-[0_0_50px_rgba(192,139,122,0.4)] text-base md:text-lg h-14 md:h-16"
          onClick={onBuyClick}
        >
          {ctaLabel}
        </Button>
      </div>
    </motion.section>
  );
};

export default OfferCTA;
