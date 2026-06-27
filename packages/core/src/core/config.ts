import type { ResolvedConfig, SentinelConfig } from "../types/index.js";

/** Secure, low-friction defaults applied when the app does not call configure. */
export const DEFAULT_CONFIG: ResolvedConfig = {
  policy: "monitor",
  integrity: {
    includeEvidence: false,
  },
  ai: {
    includeFindings: false,
    redactMatches: true,
  },
};

/** Merge a partial config over a base, producing a fully-resolved config. */
export function resolveConfig(
  partial: SentinelConfig = {},
  base: ResolvedConfig = DEFAULT_CONFIG,
): ResolvedConfig {
  return {
    policy: partial.policy ?? base.policy,
    integrity: {
      includeEvidence: partial.integrity?.includeEvidence ?? base.integrity.includeEvidence,
    },
    ai: {
      includeFindings: partial.ai?.includeFindings ?? base.ai.includeFindings,
      redactMatches: partial.ai?.redactMatches ?? base.ai.redactMatches,
    },
  };
}
