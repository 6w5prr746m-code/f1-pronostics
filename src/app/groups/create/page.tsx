"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase.rpc("create_group", {
      group_name: name,
    });

    if (error || !data) {
      setStatus("error");
      setErrorMessage(error?.message ?? "Impossible de créer le groupe.");
      return;
    }

    router.push(`/groups/${data.id}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-4 px-6 py-12">
      <h1 className="text-2xl font-bold">Créer un groupe</h1>
      <p className="text-sm text-neutral-400">
        Un code d&apos;invitation sera généré pour que tes amis te
        rejoignent.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          required
          minLength={2}
          maxLength={50}
          placeholder="Nom du groupe (ex: Les Pilotes du Dimanche)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-red-500"
        />
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold transition hover:bg-red-500 disabled:opacity-50"
        >
          {status === "saving" ? "Création..." : "Créer le groupe"}
        </button>
        {status === "error" && errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}
      </form>
    </main>
  );
}
