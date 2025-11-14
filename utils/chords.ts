const NOTES_SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;
const NOTES_FLAT  = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"] as const;

function normalize(note: string): { idx: number; preferSharp: boolean } {
  const iSharp = NOTES_SHARP.indexOf(note as any);
  if (iSharp >= 0) return { idx: iSharp, preferSharp: true };
  const iFlat = NOTES_FLAT.indexOf(note as any);
  if (iFlat >= 0) return { idx: iFlat, preferSharp: false };
  // handle with suffix like Am, G/B, etc.
  const root = note.match(/^[A-G](#|b)?/i)?.[0] ?? note;
  const rest = note.slice(root.length);
  const n = normalize(root.toUpperCase());
  return { idx: n.idx, preferSharp: n.preferSharp };
}

export function transposeChordSymbol(symbol: string, steps: number): string {
  const m = symbol.match(/^([A-G](#|b)?)(.*)$/i);
  if (!m) return symbol;
  const root = m[1].toUpperCase();
  const suffix = m[3] ?? '';
  const { idx, preferSharp } = normalize(root);
  const next = (idx + steps + 12) % 12;
  const table = preferSharp ? NOTES_SHARP : NOTES_FLAT;
  return table[next] + suffix;
}

export function detectTransposeSteps(fromKey: string, toKey: string): number {
  const a = normalize(fromKey.toUpperCase()).idx;
  const b = normalize(toKey.toUpperCase()).idx;
  let d = b - a;
  if (d > 6) d -= 12;
  if (d < -6) d += 12;
  return d;
}

export function transposeLyrics(lyrics: string, steps: number): string {
  // transpose [C], [G/B], etc. Keep plain text untouched
  return lyrics.replace(/\[([A-G](?:#|b)?(?:m|maj7|sus4|dim|aug|add9|7|m7|9|11|13)?(?:\/[A-G](?:#|b)?)?)\]/g,
    (_full, g1) => `[${transposeChordSymbol(g1, steps)}]`);
}

export function splitSections(lyrics: string): { name: string; lines: string[] }[] {
  const lines = lyrics.split(/\r?\n/);
  const sections: { name: string; lines: string[] }[] = [];
  let current = { name: 'Se??o', lines: [] as string[] };
  for (const line of lines) {
    const sec = line.match(/^\s*#\s*(.+)\s*$/); // lines starting with # Section Name
    if (sec) {
      if (current.lines.length) sections.push(current);
      current = { name: sec[1], lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length) sections.push(current);
  return sections;
}
