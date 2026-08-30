import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Countdown } from "@/components/Countdown";
import { posterGradient } from "@/lib/posterGradient";
import { isUpcoming } from "@/lib/race";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default async function RacesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: races }, { data: predictions }] = await Promise.all([
    supabase.from("races").select("*").order("race_date", { ascending: true }),
    supabase.from("predictions").select("race_id").eq("user_id", user.id),
  ]);

  const predictedRaceIds = new Set((predictions ?? []).map((p) => p.race_id));
  const upcoming = (races ?? []).filter((r) => isUpcoming(r.race_date));
  const [next, ...rest] = upcoming.length > 0 ? upcoming : [];
  const past = (races ?? []).filter((r) => !isUpcoming(r.race_date));

  return (
    <main className="flex-1 pb-20">
      {next ? (
        <section className="glow-backdrop relative overflow-hidden border-b border-white/5">
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: posterGradient(next.circuit) }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/20" />
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-6 py-20">
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-red-500">
              Prochain Grand Prix
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              {next.name}
            </h1>
            <p className="flex items-center gap-1.5 text-neutral-400">
              <MapPin size={16} />
              {next.circuit}, {next.country}
            </p>

            <Countdown target={next.quali_date} />
            <p className="text-xs text-neutral-500">
              Verrouillage des pronostics au début de la qualification, le{" "}
              {dateFormatter.format(new Date(next.quali_date))}
            </p>

            <div className="mt-2">
              {predictedRaceIds.has(next.id) ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white">
                  <CheckCircle2 size={16} className="text-green-400" />
                  Pronostic soumis
                </span>
              ) : (
                <Link
                  href={`/predict/${next.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
                >
                  Faire mon pronostic
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="mx-auto max-w-5xl px-6 py-16 text-center text-neutral-400">
          Aucune course à venir pour le moment.
        </div>
      )}

      {rest.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="mb-4 text-lg font-semibold">À venir</h2>
          <div className="scroll-rail flex gap-4 overflow-x-auto pb-2">
            {rest.map((race) => (
              <RaceCard
                key={race.id}
                race={race}
                predicted={predictedRaceIds.has(race.id)}
              />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="mb-4 text-lg font-semibold text-neutral-400">
            Terminées
          </h2>
          <div className="scroll-rail flex gap-4 overflow-x-auto pb-2 opacity-60">
            {past.map((race) => (
              <RaceCard
                key={race.id}
                race={race}
                predicted={predictedRaceIds.has(race.id)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function RaceCard({
  race,
  predicted,
}: {
  race: { id: string; name: string; circuit: string; race_date: string };
  predicted: boolean;
}) {
  return (
    <Link
      href={`/predict/${race.id}`}
      className="group relative h-40 w-64 shrink-0 overflow-hidden rounded-xl border border-white/5 transition hover:-translate-y-1 hover:border-red-500/40"
    >
      <div
        className="absolute inset-0 transition group-hover:scale-105"
        style={{ background: posterGradient(race.circuit) }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-4">
        {predicted && (
          <CheckCircle2
            size={16}
            className="absolute right-3 top-3 text-green-400"
          />
        )}
        <p className="text-sm font-semibold leading-tight text-white">
          {race.name}
        </p>
        <p className="mt-1 text-xs text-neutral-300">
          {dateFormatter.format(new Date(race.race_date))}
        </p>
      </div>
    </Link>
  );
}
