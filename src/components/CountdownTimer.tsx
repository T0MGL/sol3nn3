import { useState, useEffect, useRef, memo } from "react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  /** Total countdown duration in hours. Defaults to 40. */
  durationHours?: number;
  /** localStorage key. Different keys allow multiple independent countdowns. */
  storageKey?: string;
}

const TimerDigit = memo(({ value }: { value: string }) => (
  <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary tabular-nums">
    {value}
  </span>
));
TimerDigit.displayName = "TimerDigit";

export const CountdownTimer = memo(({
  durationHours = 40,
  storageKey = "solenne-countdown-target-v2",
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);
  const targetDateRef = useRef<Date | null>(null);

  useEffect(() => {
    const getTargetDate = (): Date => {
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const storedDate = new Date(stored);
        if (!Number.isNaN(storedDate.getTime()) && storedDate.getTime() > Date.now()) {
          return storedDate;
        }
      }

      const newTarget = new Date();
      newTarget.setTime(newTarget.getTime() + durationHours * 60 * 60 * 1000);
      localStorage.setItem(storageKey, newTarget.toISOString());
      return newTarget;
    };

    targetDateRef.current = getTargetDate();

    const updateTimer = () => {
      if (!targetDateRef.current) return;

      const distance = targetDateRef.current.getTime() - Date.now();

      if (distance <= 0) {
        setExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft((prev) => {
        if (prev.hours === hours && prev.minutes === minutes && prev.seconds === seconds) {
          return prev;
        }
        return { hours, minutes, seconds };
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [durationHours, storageKey]);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  if (expired) {
    return (
      <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 sm:px-5 py-3 backdrop-blur-sm w-full sm:w-auto">
        <span className="text-[10px] sm:text-xs text-foreground/70 font-medium uppercase tracking-wider">
          Oferta extendida por tiempo limitado
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-primary/10 border border-primary/30 px-4 sm:px-5 py-3 backdrop-blur-sm w-full sm:w-auto">
      <span className="text-[10px] sm:text-xs text-foreground/70 font-medium uppercase tracking-wider">
        Oferta termina en
      </span>
      <div className="flex items-center gap-1">
        <div className="flex flex-col items-center min-w-[32px] sm:min-w-[36px]">
          <TimerDigit value={formatNumber(timeLeft.hours)} />
        </div>
        <span className="text-primary/50 font-bold text-base sm:text-lg">:</span>
        <div className="flex flex-col items-center min-w-[32px] sm:min-w-[36px]">
          <TimerDigit value={formatNumber(timeLeft.minutes)} />
        </div>
        <span className="text-primary/50 font-bold text-base sm:text-lg">:</span>
        <div className="flex flex-col items-center min-w-[32px] sm:min-w-[36px]">
          <TimerDigit value={formatNumber(timeLeft.seconds)} />
        </div>
      </div>
    </div>
  );
});

CountdownTimer.displayName = "CountdownTimer";
