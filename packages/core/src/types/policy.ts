import type { RecommendedAction } from "./common.js";

/** Coarse policy modes that govern how the app reacts to risk. */
export type PolicyMode = "monitor" | "warn" | "block";

/**
 * Fine-grained policy options. Either pass a bare {@link PolicyMode} string for
 * the common case, or this object for precise control. All fields are optional;
 * secure defaults apply when omitted.
 */
export interface PolicyConfig {
  /** Base reaction mode. Defaults to `"warn"`. */
  mode?: PolicyMode;
  /** Block sensitive actions when the device looks high-risk. */
  blockOnHighRiskDevice?: boolean;
  /** Redact sensitive input before it leaves the device. */
  redactSensitiveInput?: boolean;
  /** Block prompts that contain likely prompt-injection attempts. */
  blockPromptInjection?: boolean;
  /** Treat simulators/emulators as acceptable (e.g. for local development). */
  allowInSimulator?: boolean;
}

/** A policy is either a simple mode string or a detailed config object. */
export type SentinelPolicy = PolicyMode | PolicyConfig;

/** Structured decision returned by the policy engine. */
export interface PolicyDecision {
  /** Whether the evaluated action is allowed to proceed. */
  allowed: boolean;
  /** The effective mode used for this decision. */
  mode: PolicyMode;
  /** The recommended action that drove this decision. */
  recommendedAction: RecommendedAction;
  /** Human-readable reasons explaining the decision. */
  reasons: string[];
}
