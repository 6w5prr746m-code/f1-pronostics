import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  const { data: members } = await supabase
    .from("group_members")
    .select("users(id, pseudo)")
    .eq("group_id", id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-white">
          ← Mes groupes
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{group.name}</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Code d&apos;invitation :{" "}
          <span className="font-mono text-neutral-200">
            {group.invite_code}
          </span>
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Membres</h2>
        <ul className="flex flex-col divide-y divide-neutral-800 rounded-md border border-neutral-800">
          {(members ?? []).map((m) =>
            m.users ? (
              <li key={m.users.id} className="px-4 py-3 text-sm">
                {m.users.pseudo}
              </li>
            ) : null,
          )}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Classement</h2>
        <p className="text-sm text-neutral-400">
          Le classement apparaîtra ici après la première course notée.
        </p>
      </div>
    </main>
  );
}
