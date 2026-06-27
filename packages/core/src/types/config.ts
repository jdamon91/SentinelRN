import type { SentinelPolicy } from "./policy.js";

/** Integrity-module configuration. */
export interface IntegrityConfig {
  /**
   * Include raw evidence (paths, property names, etc.) on signals. Evidence can
   * itself be sensitive, so it is off by default.
   */
  includeEvidence?: boolean;
}

/** AI-module configuration. */
export interface AIConfig {
  /** Include the matched substrings on findings. Off by default. */
  includeFindings?: boolean;
  /** Populate `redacted` previews on findings. On by default. */
  redactMatches?: boolean;
}

/**
 * Top-level SentinelRN configuration. Every field is optional — calling
 * `configure()` is not required, and secure defaults are always applied.
 */
export interface SentinelConfig {
  /** Default policy applied across modules. Defaults to `"monitor"`. */
  policy?: SentinelPolicy;
  /** Integrity-specific options. */
  integrity?: IntegrityConfig;
  /** AI-specific options. */
  ai?: AIConfig;
}

/** Fully-resolved configuration with all defaults applied. */
export interface ResolvedConfig {
  policy: SentinelPolicy;
  integrity: Required<IntegrityConfig>;
  ai: Required<AIConfig>;
}
