import Link from "next/link";
import { ArrowRight, Trophy, Users, Timer } from "lucide-react";
import { Logo } from "@/components/Logo";
import { RevealOnMount } from "@/components/RevealOnMount";

const FEATURES = [
  {
    icon: Trophy,
    title: "Pronostique le podium",
    text: "Top 3 et safety car avant chaque qualification.",
  },
  {
    icon: Users,
    title: "Défie tes potes",
    text: "Ligues privées entre amis, code d'invitation en un clic.",
  },
  {
    icon: Timer,
    title: "Verrouillage automatique",
    text: "Impossible de tricher : verrouillé dès la qualification.",
  },
];

export default function Home() {
  return (
    <main className="glow-backdrop relative flex flex-1 flex-col overflow-hidden">
      <header className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-8">
        <Logo />
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <RevealOnMount>
          <p className="font-display mb-4 text-xs font-bold uppercase tracking-[0.4em] text-red-500">
            Pronostics F1 entre amis
          </p>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] sm:text-6xl">
            Pronostique le podium.
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              Grimpe au classement.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-400">
            Crée un groupe privé, soumets ton pronostic avant chaque
            qualification et suis le classement de ta ligue en temps réel.
            Zéro argent réel — juste des points et de la fierté.
          </p>
          <Link
            href="/login"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 font-semibold text-white shadow-xl shadow-red-600/30 transition hover:bg-red-500 hover:shadow-red-500/40"
          >
            Commencer
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </RevealOnMount>

        <div className="mt-24 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 text-left"
            >
              <feature.icon size={20} className="mb-3 text-red-500" />
              <h3 className="font-semibold text-white">{feature.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
