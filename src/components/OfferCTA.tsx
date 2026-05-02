import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeInUpView } from "@/lib/animations";

interface OfferCTAProps {
  onBuyClick: () => void;
  selectedPrice: number;
  variant?: "default" | "minimal";
}

export const OfferCTA = ({ onBuyClick, selectedPrice, variant = "default" }: OfferCTAProps) => {
  const ctaLabel = `Aprovechar Oferta · Gs. ${selectedPrice.toLocaleString("es-PY")}`;

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
