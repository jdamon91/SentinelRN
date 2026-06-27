/** Small, dependency-free helpers shared across core modules. */

/** Clamp a number into the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/** Round to the nearest integer, treating NaN as 0. */
export function roundScore(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

/**
 * Deterministically build a stable signal/finding id from its parts, e.g.
 * `slugId("integrity", "jailbreak", "path")` → `"integrity.jailbreak.path"`.
 */
export function slugId(...parts: string[]): string {
  return parts
    .map((p) =>
      p
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, ""),
    )
    .filter(Boolean)
    .join(".");
}

/** Return the current time as an ISO-8601 string. Isolated for easy mocking. */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Run a synchronous function, converting any throw into a fallback value.
 * Used so a single failing detector never crashes a whole check.
 */
export function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}
