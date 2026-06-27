import type { RiskLevel, Severity } from "@sentinelrn/core";

/** Shared color palette for the example UI. */
export const colors = {
  background: "#0b1020",
  surface: "#161c30",
  surfaceAlt: "#1f2740",
  border: "#2a3350",
  text: "#e6e9f2",
  textMuted: "#9aa3bd",
  accent: "#5b8cff",
  low: "#3fb950",
  medium: "#d29922",
  high: "#f0883e",
  critical: "#f85149",
};

/** Map a risk level to a display color. */
export function riskColor(level: RiskLevel): string {
  return colors[level];
}

/** Map a severity to a display color. */
export function severityColor(severity: Severity): string {
  return colors[severity];
}
