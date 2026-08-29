import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-500">
        Pronostics F1 entre amis
      </p>
      <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
        Pronostique le podium, défie tes potes, grimpe au classement.
      </h1>
      <p className="mt-6 max-w-xl text-neutral-400">
        Crée un groupe privé, soumets ton pronostic avant chaque
        qualification et suis le classement de ta ligue en temps réel.
        Zéro argent réel — juste des points et de la fierté.
      </p>
      <Link
        href="/login"
        className="mt-8 rounded-md bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
      >
        Commencer
      </Link>
    </main>
  );
}
