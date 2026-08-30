"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { teamColor } from "@/lib/teams";

type Driver = { id: string; name: string; team: string; number: number };

export function PredictionForm({
  raceId,
  drivers,
  initial,
}: {
  raceId: string;
  drivers: Driver[];
  initial: {
    podium_1: string;
    podium_2: string;
    podium_3: string;
    safety_car: boolean;
  } | null;
}) {
  const router = useRouter();
  const [podium, setPodium] = useState<(string | null)[]>(
    initial ? [initial.podium_1, initial.podium_2, initial.podium_3] : [null, null, null],
  );
  const [safetyCar, setSafetyCar] = useState<boolean | null>(
    initial?.safety_car ?? null,
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const driversById = useMemo(
    () => new Map(drivers.map((d) => [d.id, d])),
    [drivers],
  );

  function toggleDriver(driverId: string) {
    setStatus("idle");
    setPodium((current) => {
      const existingIndex = current.indexOf(driverId);
      if (existingIndex !== -1) {
        const next = [...current];
        next[existingIndex] = null;
        return next;
      }
      const emptyIndex = current.indexOf(null);
      if (emptyIndex === -1) return current;
      const next = [...current];
      next[emptyIndex] = driverId;
      return next;
    });
  }

  const canSubmit =
    podium.every((p) => p !== null) && safetyCar !== null && status !== "saving";

  async function handleSubmit() {
    if (!canSubmit) return;
    setStatus("saving");
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.from("predictions").upsert(
      {
        race_id: raceId,
        podium_1: podium[0]!,
        podium_2: podium[1]!,
        podium_3: podium[2]!,
        safety_car: safetyCar!,
        // user_id is populated by RLS via a matching WITH CHECK, but the
        // column has no default — the client must set it to itself.
        user_id: (await supabase.auth.getUser()).data.user!.id,
      },
      { onConflict: "user_id,race_id" },
    );

    if (error) {
      setStatus("error");
      setErrorMessage(
        error.message.includes("row-level security")
          ? "Trop tard : la qualification a déjà commencé, les pronostics sont verrouillés."
          : error.message,
      );
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="mb-1 text-lg font-semibold">Le podium</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Touche un pilote pour l&apos;ajouter à la 1<sup>ère</sup>, 2
          <sup>e</sup> puis 3<sup>e</sup> place.
        </p>

        <div className="mb-6 flex gap-3">
          {[0, 1, 2].map((slot) => {
            const driver = podium[slot] ? driversById.get(podium[slot]!) : null;
            return (
              <div
                key={slot}
                className="glass-card flex flex-1 flex-col items-center gap-1 rounded-xl py-4"
              >
                <span className="font-display text-xs font-bold text-neutral-500">
                  P{slot + 1}
                </span>
                <span className="text-sm font-medium text-white">
                  {driver ? driver.name : "—"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {drivers.map((driver) => {
            const position = podium.indexOf(driver.id);
            const selected = position !== -1;
            const color = teamColor(driver.team);
            return (
              <button
                key={driver.id}
                type="button"
                onClick={() => toggleDriver(driver.id)}
                className={`relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                  selected
                    ? "border-white/30 bg-white/10"
                    : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color.solid }}
                />
                <span className="flex-1 truncate">
                  <span className="block truncate font-medium text-white">
                    {driver.name}
                  </span>
                  <span className="block truncate text-xs text-neutral-500">
                    {driver.team}
                  </span>
                </span>
                {selected && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white">
                    {position + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Safety car pendant la course ?</h2>
        <div className="flex gap-3">
          {[
            { label: "Oui", value: true },
            { label: "Non", value: false },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setSafetyCar(option.value)}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                safetyCar === option.value
                  ? "border-red-500/50 bg-red-600/20 text-white"
                  : "border-white/5 bg-white/[0.02] text-neutral-400 hover:border-white/15"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none"
        >
          {status === "saving"
            ? "Enregistrement..."
            : initial
              ? "Mettre à jour mon pronostic"
              : "Valider mon pronostic"}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1.5 text-sm text-green-400">
            <Check size={16} />
            Pronostic enregistré
          </span>
        )}
        {status === "error" && errorMessage && (
          <span className="text-sm text-red-400">{errorMessage}</span>
        )}
      </div>
    </div>
  );
}
