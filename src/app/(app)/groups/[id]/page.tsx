import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Trophy, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CopyInviteCode } from "@/components/CopyInviteCode";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, invite_code")
    .eq("id", id)
    .single();

  if (!group) {
    notFound();
  }

  const [{ data: members }, { data: scores }] = await Promise.all([
    supabase.from("group_members").select("users(id, pseudo)").eq("group_id", id),
    supabase.from("scores").select("user_id, points").eq("group_id", id),
  ]);

  const totals = new Map<string, number>();
  for (const m of members ?? []) {
    if (m.users) totals.set(m.users.id, 0);
  }
  for (const s of scores ?? []) {
    totals.set(s.user_id, (totals.get(s.user_id) ?? 0) + s.points);
  }

  const pseudoById = new Map(
    (members ?? [])
      .filter((m): m is { users: { id: string; pseudo: string } } => m.users !== null)
      .map((m) => [m.users.id, m.users.pseudo]),
  );

  const standings = [...totals.entries()]
    .map(([userId, points]) => ({ userId, points, pseudo: pseudoById.get(userId) ?? "?" }))
    .sort((a, b) => b.points - a.points);

  return (
    <main className="glow-backdrop flex-1">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-neutral-500 hover:text-white"
          >
            ← Mes groupes
          </Link>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold sm:text-4xl">{group.name}</h1>
            <CopyInviteCode code={group.invite_code} />
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Trophy size={18} className="text-red-500" />
            Classement
          </h2>

          {standings.length === 0 ? (
            <div className="glass-card rounded-2xl px-8 py-12 text-center text-neutral-400">
              Le classement apparaîtra ici après la première course notée.
            </div>
          ) : (
            <div className="glass-card overflow-hidden rounded-2xl">
              {standings.map((entry, i) => {
                const isMe = entry.userId === user.id;
                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between border-b border-white/5 px-5 py-4 last:border-0 ${
                      isMe ? "bg-red-600/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-display w-8 text-center text-sm font-bold text-neutral-500">
                        {MEDALS[i] ?? `#${i + 1}`}
                      </span>
                      <span className="font-medium">
                        {entry.pseudo}
                        {isMe && (
                          <span className="ml-2 text-xs text-red-400">
                            (toi)
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="font-display font-bold text-white">
                      {entry.points} pts
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Users size={18} className="text-neutral-400" />
            Membres ({members?.length ?? 0})
          </h2>
          <div className="flex flex-wrap gap-2">
            {(members ?? []).map((m) =>
              m.users ? (
                <span
                  key={m.users.id}
                  className="glass-card rounded-full px-4 py-1.5 text-sm text-neutral-300"
                >
                  {m.users.pseudo}
                </span>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
