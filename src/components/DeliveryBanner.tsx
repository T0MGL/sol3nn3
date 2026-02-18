import { motion } from "framer-motion";

const messages = [
  "✦ PAGO 100% SEGURO",
  "✦ GARANTÍA 30 DÍAS",
  "✦ DELIVERY GRATIS A TODO PARAGUAY",
  "✦ K-BEAUTY AUTÉNTICO",
];

export const DeliveryBanner = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-[#A67265] text-primary-foreground z-[60] overflow-hidden h-9 md:h-10 flex items-center">
      <div className="absolute inset-0 flex items-center w-full">
        {/* We need multiple copies to ensure seamless loop on large screens */}
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {/* Render list enough times to cover screen width + buffer */}
          {[...Array(6)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center">
              {messages.map((text, i) => (
                <span key={i} className="mx-6 md:mx-12 text-xs md:text-sm font-medium tracking-wide">
                  {text}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
