import {
  type AIGuardResult,
  type PolicyConfig,
  type PolicyDecision,
  type PolicyMode,
  type RecommendedAction,
  riskRank,
  type SentinelPolicy,
  severityRank,
  type ThreatReport,
} from "../types/index.js";

/**
 * Policy engine.
 *
 * Translates explainable reports (from the threat engine or PromptGuard) into
 * concrete application decisions: allowed or not, plus the reasons why. The
 * policy engine never collects runtime information itself — it only evaluates
 * reports. Applications stay in control: SentinelRN recommends, policy decides,
 * the app enforces.
 */

/** A fully-resolved policy with every flag populated. */
export interface ResolvedPolicy extends Required<PolicyConfig> {}

/** Per-mode defaults for the fine-grained flags. `block` is the strict end. */
function flagDefaults(mode: PolicyMode): Omit<ResolvedPolicy, "mode"> {
  return {
    blockOnHighRiskDevice: mode === "block",
    redactSensitiveInput: true,
    blockPromptInjection: mode === "block",
    allowInSimulator: true,
  };
}

/** Normalize a {@link SentinelPolicy} (string or object) into a resolved policy. */
export function resolvePolicy(policy: SentinelPolicy = "warn"): ResolvedPolicy {
  if (typeof policy === "string") {
    return { mode: policy, ...flagDefaults(policy) };
  }
  const mode = policy.mode ?? "warn";
  const defaults = flagDefaults(mode);
  return {
    mode,
    blockOnHighRiskDevice: policy.blockOnHighRiskDevice ?? defaults.blockOnHighRiskDevice,
    redactSensitiveInput: policy.redactSensitiveInput ?? defaults.redactSensitiveInput,
    blockPromptInjection: policy.blockPromptInjection ?? defaults.blockPromptInjection,
    allowInSimulator: policy.allowInSimulator ?? defaults.allowInSimulator,
  };
}

/** Signal types that simulator/emulator exemption applies to. */
const SIMULATOR_TYPES = new Set(["simulator", "emulator"]);

/**
 * Evaluate a runtime-integrity report against a policy.
 *
 * `monitor` and `warn` never block (they only surface advice); `block`
 * prevents the action when the device is compromised, high-risk (when
 * `blockOnHighRiskDevice`), or the report recommends a blocking action.
 */
export function evaluateIntegrity(
  report: ThreatReport,
  policy: SentinelPolicy = "warn",
): PolicyDecision {
  const resolved = resolvePolicy(policy);
  const reasons: string[] = [];

  // Apply the simulator/emulator exemption, if enabled.
  const relevant = resolved.allowInSimulator
    ? report.signals.filter((s) => !SIMULATOR_TYPES.has(s.type))
    : report.signals;
  if (resolved.allowInSimulator && relevant.length < report.signals.length) {
    reasons.push("Simulator/emulator signals ignored by policy (allowInSimulator).");
  }

  const exemptedAll = relevant.length === 0 && report.signals.length > 0;
  const effectiveAction: RecommendedAction = exemptedAll ? "allow" : report.recommendedAction;
  const effectivelyCompromised = exemptedAll ? false : report.compromised;

  reasons.push(`Risk level: ${report.riskLevel} (score ${report.score}).`);
  if (relevant.length > 0) {
    const kinds = [...new Set(relevant.map((s) => s.type))].join(", ");
    reasons.push(`Detected signals: ${kinds}.`);
  } else if (report.signals.length === 0) {
    reasons.push("No integrity signals detected.");
  }

  let allowed = true;
  if (resolved.mode === "block") {
    const blockingAction =
      effectiveAction === "block_sensitive_action" || effectiveAction === "block_session";
    const highRisk =
      resolved.blockOnHighRiskDevice && riskRank(report.riskLevel) >= riskRank("high");
    if (blockingAction || effectivelyCompromised || highRisk) {
      allowed = false;
      reasons.push("Blocked by policy (mode: block).");
    }
  } else {
    reasons.push(`Policy mode "${resolved.mode}" does not block; action allowed.`);
  }

  return { allowed, mode: resolved.mode, recommendedAction: effectiveAction, reasons };
}

/** Map an AI-guard action onto the shared integrity action vocabulary. */
function aiActionToRecommended(result: AIGuardResult): RecommendedAction {
  switch (result.recommendedAction) {
    case "block":
      return "block_sensitive_action";
    case "warn":
    case "redact":
      return "warn_user";
    default:
      return "allow";
  }
}

/**
 * Evaluate an {@link AIGuardResult} against a policy. Useful when an app wants a
 * single, uniform {@link PolicyDecision} shape across integrity and AI.
 */
export function evaluateAI(result: AIGuardResult, policy: SentinelPolicy = "warn"): PolicyDecision {
  const resolved = resolvePolicy(policy);
  const reasons: string[] = [];

  const hasInjection = result.findings.some((f) => f.type === "prompt_injection");
  const hasHighSeverity = result.findings.some(
    (f) => severityRank(f.severity) >= severityRank("high"),
  );

  if (result.findings.length === 0) {
    reasons.push("No sensitive content or injection detected in prompt.");
  } else {
    const kinds = [...new Set(result.findings.map((f) => f.type))].join(", ");
    reasons.push(`Detected: ${kinds}.`);
  }

  let allowed = true;
  if (resolved.mode === "block") {
    const blockInjection = resolved.blockPromptInjection && hasInjection;
    if (blockInjection || hasHighSeverity || result.recommendedAction === "block") {
      allowed = false;
      reasons.push("Blocked by policy (mode: block).");
    }
  } else {
    reasons.push(`Policy mode "${resolved.mode}" does not block; action allowed.`);
  }

  if (resolved.redactSensitiveInput && result.sanitizedInput) {
    reasons.push("Sensitive input should be redacted before sending (redactSensitiveInput).");
  }

  return {
    allowed,
    mode: resolved.mode,
    recommendedAction: aiActionToRecommended(result),
    reasons,
  };
}
