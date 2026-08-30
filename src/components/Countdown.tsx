"use client";

import { useEffect, useState } from "react";

function getRemaining(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  };
}

export function Countdown({ target }: { target: string }) {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(
    null,
  );

  useEffect(() => {
    // Sets state immediately (not just on the first 1s tick) so the
    // countdown doesn't flash empty on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining(target));
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!remaining) {
    return <div className="h-16" />;
  }

  if (remaining.done) {
    return (
      <p className="font-display text-sm font-bold uppercase tracking-widest text-red-500">
        C&apos;est parti !
      </p>
    );
  }

  const units: [string, number][] = [
    ["jours", remaining.days],
    ["heures", remaining.hours],
    ["min", remaining.minutes],
    ["sec", remaining.seconds],
  ];

  return (
    <div className="flex gap-4">
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-display text-3xl font-bold tabular-nums text-white sm:text-4xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
