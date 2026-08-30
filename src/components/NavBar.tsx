"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { signOut } from "@/app/auth/actions";

const LINKS = [
  { href: "/dashboard", label: "Groupes" },
  { href: "/races", label: "Courses" },
];

export function NavBar({
  pseudo,
  isAdmin = false,
}: {
  pseudo: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const links = isAdmin
    ? [...LINKS, { href: "/admin/results", label: "Admin" }]
    : LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/dashboard">
          <Logo />
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-neutral-400 sm:inline">
            {pseudo}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-neutral-500 transition hover:text-white"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
