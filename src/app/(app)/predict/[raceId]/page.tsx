import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Lock, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PredictionForm } from "@/components/PredictionForm";
import { teamColor } from "@/lib/teams";
import { isRaceLocked } from "@/lib/race";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function PredictPage({
  params,
}: {
  params: Promise<{ raceId: string }>;
}) {
  const { raceId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: race }, { data: drivers }, { data: prediction }] =
    await Promise.all([
      supabase.from("races").select("*").eq("id", raceId).single(),
      supabase
        .from("drivers")
        .select("id, name, team, number")
        .eq("active", true)
        .order("team"),
      supabase
        .from("predictions")
        .select("podium_1, podium_2, podium_3, safety_car")
        .eq("race_id", raceId)
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  if (!race) {
    notFound();
  }

  const locked = isRaceLocked(race.quali_date);
  const driversById = new Map((drivers ?? []).map((d) => [d.id, d]));

  return (
    <main className="glow-backdrop flex-1">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <div>
          <Link
            href="/races"
            className="text-sm text-neutral-500 hover:text-white"
          >
            ← Calendrier
          </Link>
          <p className="mt-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            Pronostic
          </p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{race.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-400">
            <MapPin size={14} />
            {race.circuit}, {race.country}
          </p>
        </div>

        {locked ? (
          <div className="glass-card rounded-2xl p-8">
            <div className="mb-4 flex items-center gap-2 text-neutral-400">
              <Lock size={16} />
              <span className="text-sm">
                Verrouillé depuis le {dateFormatter.format(new Date(race.quali_date))}
              </span>
            </div>
            {prediction ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {[prediction.podium_1, prediction.podium_2, prediction.podium_3].map(
                  (driverId, i) => {
                    const driver = driversById.get(driverId);
                    const color = driver ? teamColor(driver.team) : null;
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                      >
                        <span className="font-display text-xs font-bold text-neutral-500">
                          P{i + 1}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          {color && (
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: color.solid }}
                            />
                          )}
                          <span className="font-medium">
                            {driver?.name ?? "Pilote inconnu"}
                          </span>
                        </div>
                      </div>
                    );
                  },
                )}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:col-span-3">
                  <span className="font-display text-xs font-bold text-neutral-500">
                    SAFETY CAR
                  </span>
                  <p className="mt-1 font-medium">
                    {prediction.safety_car ? "Oui" : "Non"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-neutral-400">
                Tu n&apos;as pas soumis de pronostic avant la qualification —
                ce sera pour la prochaine course.
              </p>
            )}
          </div>
        ) : (
          <PredictionForm
            raceId={race.id}
            drivers={drivers ?? []}
            initial={prediction}
          />
        )}
      </div>
    </main>
  );
}
