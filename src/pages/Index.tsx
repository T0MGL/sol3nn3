import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="font-serif text-primary text-5xl md:text-7xl font-light"
            style={{ letterSpacing: "0.32em" }}
          >
            SOLENNE
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            className="mx-auto mt-10 h-px w-16 origin-center bg-primary/40"
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-10 font-serif text-foreground/85 text-xl md:text-2xl font-light italic"
          >
            Piel real, sin atajos.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-14 font-sans uppercase text-muted-foreground/80 text-xs md:text-sm"
            style={{ letterSpacing: "0.42em" }}
          >
            Pronto
          </motion.p>
        </div>
      </main>

      <footer className="bg-background border-t border-border/30 py-10 md:py-12 px-4 md:px-6">
        <div className="container max-w-[1400px] mx-auto text-center space-y-4">
          <p className="text-[10px] md:text-xs text-muted-foreground/70 font-light max-w-2xl mx-auto leading-relaxed px-4">
            Solenne distribuye productos cosméticos importados en Paraguay. El empaque puede variar. Sin afiliación a ninguna marca específica.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
            <Link
              to="/terminos-y-condiciones"
              className="hover:text-foreground transition-colors"
            >
              Términos y Condiciones
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <Link
              to="/politica-de-privacidad"
              className="hover:text-foreground transition-colors"
            >
              Política de Privacidad
            </Link>
          </div>

          <p className="text-[10px] md:text-xs text-muted-foreground/60 font-light">
            © {new Date().getFullYear()} SOLENNE Todos los Derechos Reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
