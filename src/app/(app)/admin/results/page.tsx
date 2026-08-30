import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { submitRaceResult } from "./actions";

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ race?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  if (!isAdminEmail(user.email)) {
    return (
      <main className="mx-auto max-w-md flex-1 px-6 py-24 text-center">
        <p className="text-neutral-400">
          Accès réservé aux administrateurs.
        </p>
      </main>
    );
  }

  const [{ data: races }, { data: drivers }] = await Promise.all([
    supabase
      .from("races")
      .select("id, name, circuit, status")
      .neq("status", "finished")
      .order("race_date", { ascending: true }),
    supabase.from("drivers").select("id, name, team").eq("active", true).order("team"),
  ]);

  const { race: raceParam } = await searchParams;
  const selectedRaceId = raceParam ?? races?.[0]?.id;
  const selectedRace = races?.find((r) => r.id === selectedRaceId);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-red-500">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-bold">Saisir les résultats</h1>
      </div>

      {!races || races.length === 0 ? (
        <p className="text-neutral-400">
          Aucune course en attente de résultats.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {races.map((race) => (
              <a
                key={race.id}
                href={`/admin/results?race=${race.id}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  race.id === selectedRaceId
                    ? "bg-red-600 text-white"
                    : "glass-card text-neutral-300 hover:border-white/20"
                }`}
              >
                {race.name}
              </a>
            ))}
          </div>

          {selectedRace && (
            <form action={submitRaceResult} className="glass-card flex flex-col gap-5 rounded-2xl p-6">
              <input type="hidden" name="race_id" value={selectedRace.id} />
              <p className="text-sm text-neutral-400">
                {selectedRace.name} — {selectedRace.circuit}
              </p>

              {(["podium_1", "podium_2", "podium_3"] as const).map((field, i) => (
                <label key={field} className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-neutral-300">
                    P{i + 1}
                  </span>
                  <select
                    name={field}
                    required
                    defaultValue=""
                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-red-500"
                  >
                    <option value="" disabled>
                      Choisir un pilote
                    </option>
                    {(drivers ?? []).map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} — {driver.team}
                      </option>
                    ))}
                  </select>
                </label>
              ))}

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-neutral-300">
                  Safety car ?
                </span>
                <select
                  name="safety_car"
                  defaultValue="false"
                  className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-red-500"
                >
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              </label>

              <button
                type="submit"
                className="mt-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Valider et calculer les points
              </button>
            </form>
          )}
        </>
      )}
    </main>
  );
}
