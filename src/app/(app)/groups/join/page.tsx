"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function JoinGroupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase.rpc("join_group_by_code", {
      code,
    });

    if (error || !data) {
      setStatus("error");
      setErrorMessage(error?.message ?? "Code d'invitation invalide.");
      return;
    }

    router.push(`/groups/${data.id}`);
  }

  return (
    <main className="glow-backdrop flex flex-1 items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card relative z-10 w-full max-w-sm rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold">Rejoindre un groupe</h1>
        <p className="mt-2 mb-6 text-sm text-neutral-400">
          Demande le code d&apos;invitation à un membre du groupe.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            minLength={6}
            maxLength={6}
            placeholder="Code d'invitation (ex: 7K2N9P)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-mono uppercase outline-none transition focus:border-red-500"
          />
          <button
            type="submit"
            disabled={status === "saving"}
            className="group flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:opacity-50"
          >
            {status === "saving" ? "Connexion..." : "Rejoindre"}
            {status !== "saving" && (
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            )}
          </button>
          {status === "error" && errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}
        </form>
      </motion.div>
    </main>
  );
}
