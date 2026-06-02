import { useEffect } from "react";
import logo from "@/assets/branding/logo.webp";

const ComingSoon = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Solenne | Proximamente";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[hsl(var(--solenne-cream))] px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[hsl(var(--solenne-blush))] opacity-30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-[-120px] h-[360px] w-[360px] rounded-full bg-[hsl(var(--solenne-warm-sand))] opacity-40 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <img
          src={logo}
          alt="Solenne"
          width={160}
          height={160}
          className="mb-12 h-auto w-32 select-none sm:w-40"
          draggable={false}
        />

        <span className="mb-5 text-xs font-medium uppercase tracking-[0.42em] text-[hsl(var(--solenne-deep-rose))]">
          Solenne
        </span>

        <h1 className="font-serif text-5xl font-light leading-none tracking-tight text-[hsl(var(--solenne-text))] sm:text-6xl">
          Proximamente
        </h1>

        <div className="mx-auto mt-8 h-px w-16 bg-[hsl(var(--solenne-rose-gold))] opacity-60" />

        <p className="mt-8 max-w-xs font-sans text-sm font-light leading-relaxed text-[hsl(var(--solenne-text-light))]">
          Estamos preparando algo especial para tu rutina de cuidado.
        </p>
      </div>
    </main>
  );
};

export default ComingSoon;
