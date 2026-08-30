import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Users, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memberships } = await supabase
    .from("group_members")
    .select("groups(id, name, invite_code)")
    .eq("user_id", user.id);

  const groups = (memberships ?? [])
    .map((m) => m.groups)
    .filter((g): g is NonNullable<typeof g> => g !== null);

  return (
    <main className="glow-backdrop flex-1">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-2">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            Tes ligues
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">Mes groupes</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/groups/create"
            className="group flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 hover:shadow-red-500/30"
          >
            <Plus size={16} />
            Créer un groupe
          </Link>
          <Link
            href="/groups/join"
            className="glass-card flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/20"
          >
            <Users size={16} />
            Rejoindre un groupe
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className="glass-card rounded-2xl px-8 py-16 text-center">
            <p className="text-neutral-400">
              Tu n&apos;es dans aucun groupe pour l&apos;instant. Crée-en un
              ou rejoins celui de tes amis avec leur code d&apos;invitation.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="glass-card group relative overflow-hidden rounded-2xl p-6 transition hover:border-red-500/30 hover:bg-white/[0.04]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{group.name}</h2>
                    <p className="mt-1 font-mono text-xs text-neutral-500">
                      {group.invite_code}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-neutral-600 transition group-hover:translate-x-1 group-hover:text-red-500"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
