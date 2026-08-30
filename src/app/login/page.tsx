"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <main className="glow-backdrop relative flex flex-1 flex-col items-center justify-center px-4">
      <Link href="/" className="absolute top-8 left-1/2 z-10 -translate-x-1/2">
        <Logo />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card relative z-10 w-full max-w-sm rounded-2xl p-8"
      >
        <h1 className="mb-2 text-2xl font-bold">Connexion</h1>
        <p className="mb-6 text-sm text-neutral-400">
          Reçois un lien magique par email, aucun mot de passe requis.
        </p>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm"
          >
            <Mail size={18} className="mt-0.5 shrink-0 text-red-500" />
            <p>
              Un lien de connexion a été envoyé à{" "}
              <strong className="text-white">{email}</strong>. Vérifie ta
              boîte mail (et tes spams).
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="toi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-red-500"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="group flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:opacity-50"
            >
              {status === "sending" ? "Envoi..." : "Recevoir le lien magique"}
              {status !== "sending" && (
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              )}
            </button>
            {status === "error" && errorMessage && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}
          </form>
        )}
      </motion.div>
    </main>
  );
}
