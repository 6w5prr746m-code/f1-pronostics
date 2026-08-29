"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

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
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold">Connexion</h1>
        <p className="mb-6 text-sm text-neutral-400">
          Reçois un lien magique par email, aucun mot de passe requis.
        </p>

        {status === "sent" ? (
          <p className="rounded-md bg-neutral-900 p-4 text-sm">
            Un lien de connexion a été envoyé à <strong>{email}</strong>.
            Vérifie ta boîte mail (et tes spams).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="toi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold transition hover:bg-red-500 disabled:opacity-50"
            >
              {status === "sending" ? "Envoi..." : "Recevoir le lien magique"}
            </button>
            {status === "error" && errorMessage && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
