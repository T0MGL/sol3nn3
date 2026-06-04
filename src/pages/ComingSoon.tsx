import { useEffect } from "react";
import logo from "@/assets/branding/logo.webp";

const ComingSoon = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Solenne | Próximamente";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[hsl(var(--solenne-cream))] px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[hsl(var(--solenne-blush))] opacity-30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 right-[-140px] h-[420px] w-[420px] rounded-full bg-[hsl(var(--solenne-warm-sand))] opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[-120px] h-[300px] w-[300px] rounded-full bg-[hsl(var(--solenne-light-rose))] opacity-50 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <img
          src={logo}
          alt="Solenne"
          width={160}
          height={160}
          className="mb-14 h-auto w-32 select-none sm:w-40"
          draggable={false}
        />

        <span className="mb-6 text-[0.7rem] font-medium uppercase tracking-[0.45em] text-[hsl(var(--solenne-deep-rose))]">
          K-Beauty Ritual
        </span>

        <h1 className="font-serif text-[3.25rem] font-light leading-[0.95] tracking-tight text-[hsl(var(--solenne-text))] sm:text-7xl">
          Próximamente
        </h1>

        <div className="mt-9 flex items-center justify-center gap-3" aria-hidden>
          <span className="h-px w-10 bg-[hsl(var(--solenne-rose-gold))] opacity-50" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[hsl(var(--solenne-rose-gold))] opacity-70" />
          <span className="h-px w-10 bg-[hsl(var(--solenne-rose-gold))] opacity-50" />
        </div>

        <p className="mt-9 max-w-sm font-sans text-[0.95rem] font-light leading-relaxed text-[hsl(var(--solenne-text-light))]">
          Estamos afinando cada detalle de tu próximo ritual de cuidado. Una piel
          luminosa merece tiempo, y lo estamos preparando para vos.
        </p>

        <span className="mt-14 font-serif text-base font-light italic text-[hsl(var(--solenne-deep-rose))]">
          Solenne
        </span>
      </div>
    </main>
  );
};

export default ComingSoon;
