import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState } from "react";

// Review images
import reviewTogether1 from "@/assets/reviews/reviewtogether1.webp";
import reviewTogeter2 from "@/assets/reviews/reviewtogeter2.webp";
import reviewTogether2 from "@/assets/reviews/reviewtogether2.webp";
import reviewAlone1 from "@/assets/reviews/reviewalone1.webp";
import reviewAlone2 from "@/assets/reviews/reviewalone2.webp";

// Review with multiple images (mano 1, 2 y 3 juntas)
const multiImageReview = {
  name: "Luciana Paredes",
  role: "Asunción",
  rating: 5,
  quote:
    "No podía creer la textura del suero. Se absorbe al instante y deja la piel increíblemente suave. Acá les muestro cómo queda aplicado en la mano — esa gota rosada es pura hidratación. ¡Amo este producto!",
  images: [reviewTogether1, reviewTogeter2, reviewTogether2],
};

// Reviews with single image
const singleImageReviews = [
  {
    name: "Valentina Ríos",
    role: "Encarnación",
    rating: 5,
    quote:
      "Compré el PDRN Serum sin muchas expectativas y me sorprendió desde el primer uso. El frasco es precioso y el suero huele increíble. Ya voy por mi segunda unidad.",
    image: reviewAlone1,
  },
  {
    name: "Camila Ortega",
    role: "Ciudad del Este",
    rating: 5,
    quote:
      "Llevo 3 semanas usándolo y mis manchas se aclararon notablemente. El frasco rinde muchísimo, con 2-3 gotitas alcanza para todo el rostro. Totalmente recomendado.",
    image: reviewAlone2,
  },
];

// Text-only reviews
const textOnlyReviews = [
  {
    name: "María José",
    role: "Asunción",
    rating: 5,
    quote:
      "Mi piel nunca estuvo tan hidratada. Lo uso hace 3 semanas y ya noto una diferencia enorme en la textura.",
  },
  {
    name: "Sofía Benítez",
    role: "Villarrica",
    rating: 5,
    quote:
      "Después de 2 semanas mi piel estaba completamente transformada. Ahora es mi producto estrella de skincare.",
  },
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Multi-image review card with image carousel
const MultiImageReviewCard = () => {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div
      variants={itemVariants}
      className="group col-span-1 md:col-span-2 p-6 md:p-8 bg-gradient-to-b from-card to-background border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(192,139,122,0.14),0_2px_6px_rgba(0,0,0,0.05)]"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Image gallery */}
        <div className="flex-shrink-0 w-full md:w-64">
          {/* Main image */}
          <div className="w-full aspect-square rounded-lg overflow-hidden border border-border/30 mb-3">
            <img
              src={multiImageReview.images[activeImg]}
              alt={`Review foto ${activeImg + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
              loading="lazy"
              decoding="async"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2">
            {multiImageReview.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`flex-1 aspect-square rounded overflow-hidden border-2 transition-all duration-200 ${
                  activeImg === i
                    ? "border-primary opacity-100"
                    : "border-border/30 opacity-60 hover:opacity-80"
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex gap-0.5">
              {[...Array(multiImageReview.rating)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-accent" />
              ))}
            </div>
            <p className="text-foreground/80 leading-relaxed font-light text-sm md:text-base">
              &ldquo;{multiImageReview.quote}&rdquo;
            </p>
          </div>
          <div className="pt-4 border-t border-border/30">
            <p className="font-semibold text-foreground text-sm md:text-base">
              {multiImageReview.name}
            </p>
            <p className="text-xs text-muted-foreground font-light mt-1">
              {multiImageReview.role}
            </p>
            <p className="text-xs text-accent/70 font-medium mt-1">
              ✓ Compra verificada · 3 fotos adjuntas
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Single image review card
const SingleImageReviewCard = ({
  review,
}: {
  review: (typeof singleImageReviews)[0];
}) => (
  <motion.div
    variants={itemVariants}
    className="group p-6 md:p-8 bg-gradient-to-b from-card to-background border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(192,139,122,0.14),0_2px_6px_rgba(0,0,0,0.05)]"
  >
    <div className="space-y-5">
      <div className="flex gap-0.5">
        {[...Array(review.rating)].map((_, i) => (
          <StarIcon key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
        ))}
      </div>

      {/* Product image */}
      <div className="w-full aspect-square rounded-lg overflow-hidden border border-border/20">
        <img
          src={review.image}
          alt={`Review de ${review.name}`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <p className="text-foreground/80 leading-relaxed font-light text-sm">
        &ldquo;{review.quote}&rdquo;
      </p>

      <div className="pt-4 border-t border-border/30">
        <p className="font-semibold text-foreground text-sm md:text-base">
          {review.name}
        </p>
        <p className="text-xs text-muted-foreground font-light mt-1">
          {review.role}
        </p>
        <p className="text-xs text-accent/70 font-medium mt-1">
          ✓ Compra verificada
        </p>
      </div>
    </div>
  </motion.div>
);

// Text-only review card
const TextReviewCard = ({
  testimonial,
}: {
  testimonial: (typeof textOnlyReviews)[0];
}) => (
  <motion.div
    variants={itemVariants}
    className="group p-6 md:p-8 bg-gradient-to-b from-card to-background border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(192,139,122,0.14),0_2px_6px_rgba(0,0,0,0.05)]"
  >
    <div className="space-y-5 md:space-y-6">
      <div className="flex gap-0.5">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIcon key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
        ))}
      </div>

      <p className="text-foreground/80 leading-relaxed font-light text-sm">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="pt-4 border-t border-border/30">
        <p className="font-semibold text-foreground text-sm md:text-base">
          {testimonial.name}
        </p>
        <p className="text-xs text-muted-foreground font-light mt-1">
          {testimonial.role}
        </p>
      </div>
    </div>
  </motion.div>
);

export const TestimonialsSection = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(192,139,122,0.08),transparent_50%)]" />

      <div className="container max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold px-4">
            Resultados reales. Piel transformada.
          </h2>
          <p className="text-base md:text-xl text-muted-foreground px-4">
            Clientas paraguayas que ya lo viven
          </p>
        </div>

        {/* Rating Summary Banner */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="bg-gradient-to-b from-secondary/40 to-secondary/20 backdrop-blur-sm border border-accent/30 rounded-lg p-8 md:p-10 shadow-[0_4px_6px_rgba(0,0,0,0.08),0_0_40px_rgba(192,139,122,0.12)]">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                  ))}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-accent">4.8</span>
                  <span className="text-lg md:text-xl text-muted-foreground font-light">de 5</span>
                </div>
              </div>

              <div className="hidden md:block w-px h-20 bg-border/50" />

              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-3xl md:text-4xl font-bold text-foreground">2,847</p>
                <p className="text-base md:text-lg text-muted-foreground font-light">
                  clientes satisfechos
                </p>
                <p className="text-xs md:text-sm text-accent/80 font-medium mt-1">
                  ★ Reviews verificadas
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
        >
          {/* Review con 3 fotos (mano 1, 2 y 3) — ocupa 2 columnas */}
          <MultiImageReviewCard />

          {/* Reviews con foto individual */}
          {singleImageReviews.map((review, index) => (
            <SingleImageReviewCard key={index} review={review} />
          ))}

          {/* Reviews solo texto */}
          {textOnlyReviews.map((testimonial, index) => (
            <TextReviewCard key={index} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
