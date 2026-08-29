import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes groupes</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-neutral-400 hover:text-white"
          >
            Se déconnecter
          </button>
        </form>
      </div>

      <div className="flex gap-3">
        <Link
          href="/groups/create"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
        >
          Créer un groupe
        </Link>
        <Link
          href="/groups/join"
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-semibold hover:border-neutral-500"
        >
          Rejoindre un groupe
        </Link>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Tu n&apos;es dans aucun groupe pour l&apos;instant.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-neutral-800 rounded-md border border-neutral-800">
          {groups.map((group) => (
            <li key={group.id}>
              <Link
                href={`/groups/${group.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-neutral-900"
              >
                <span className="font-medium">{group.name}</span>
                <span className="font-mono text-xs text-neutral-500">
                  {group.invite_code}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
