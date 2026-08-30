// Deterministic gradient per circuit so race "posters" look distinct
// without depending on external/licensed imagery.
const PALETTES: [string, string][] = [
  ["#dc2626", "#1e1b4b"],
  ["#ea580c", "#1c1917"],
  ["#0891b2", "#0c0a09"],
  ["#7c3aed", "#18181b"],
  ["#16a34a", "#0a0a0a"],
  ["#db2777", "#1e293b"],
  ["#2563eb", "#0f172a"],
];

function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function posterGradient(seed: string) {
  const [from, to] = PALETTES[hash(seed) % PALETTES.length];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}
