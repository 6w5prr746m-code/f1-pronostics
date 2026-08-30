"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyInviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — the code is still visible to copy by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="glass-card flex items-center gap-2 rounded-full px-4 py-2 font-mono text-sm text-neutral-200 transition hover:border-white/20"
    >
      {code}
      {copied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Copy size={14} className="text-neutral-500" />
      )}
    </button>
  );
}
