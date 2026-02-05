export interface AllowlistEntry {
  /** The name you gave (human-readable). */
  display: string;
  /** Normalized key used for matching. */
  key: string;
  /** Optional extra alias keys for messy names. */
  aliases?: string[];
}

export function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // drop parentheticals
    .replace(/[^a-z0-9\s]/g, ' ') // drop punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildAllowlist(names: string[]): AllowlistEntry[] {
  return names
    .map((display) => {
      const key = normalizeName(display);
      const aliases: string[] = [];

      // Special-case: "Elaine (Elena) Finn" -> allow Elaine Finn + Elena Finn
      if (display.includes('Elaine') && display.includes('Elena') && display.includes('Finn')) {
        aliases.push(normalizeName('Elaine Finn'));
        aliases.push(normalizeName('Elena Finn'));
      }

      return { display, key, aliases: aliases.length ? aliases : undefined };
    })
    .filter((e) => e.key.length > 0);
}

export function isAllowlistedName(fullName: string, allowlist: AllowlistEntry[]): boolean {
  const key = normalizeName(fullName);
  if (!key) return false;

  for (const entry of allowlist) {
    if (entry.key === key) return true;
    if (entry.aliases?.includes(key)) return true;
  }

  return false;
}
