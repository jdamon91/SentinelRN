import type {
  AIFinding,
  AIGuardPolicy,
  AIGuardResult,
  AIRecommendedAction,
  GuardPromptArgs,
  Severity,
} from "../types/index.js";
import { severityRank } from "../types/index.js";
import { detectFindings } from "./detector.js";
import { redact } from "./redaction.js";

/**
 * PromptGuard.
 *
 * Inspects AI-bound input and produces an explainable, policy-aware decision:
 * whether the input may proceed, what was found, a redacted version, and a
 * recommended action. It never sends anything anywhere — SentinelRN protects
 * prompts, it is not an AI SDK.
 */

/** Options resolved from {@link AIConfig} that shape the findings detail. */
export interface GuardOptions {
  includeMatch?: boolean;
  redactMatches?: boolean;
}

const ACTION_RANK: Record<AIRecommendedAction, number> = {
  allow: 0,
  redact: 1,
  warn: 2,
  block: 3,
};

function maxAction(a: AIRecommendedAction, b: AIRecommendedAction): AIRecommendedAction {
  return ACTION_RANK[a] >= ACTION_RANK[b] ? a : b;
}

/** The action a single finding argues for, independent of policy. */
function actionForFinding(finding: AIFinding): AIRecommendedAction {
  if (finding.type === "prompt_injection") {
    return severityRank(finding.severity) >= severityRank("high") ? "block" : "warn";
  }
  return "redact";
}

/** The strongest action argued for across all findings. */
function baselineAction(findings: readonly AIFinding[]): AIRecommendedAction {
  return findings.reduce<AIRecommendedAction>((acc, f) => maxAction(acc, actionForFinding(f)), "allow");
}

function hasSeverityAtLeast(findings: readonly AIFinding[], min: Severity): boolean {
  return findings.some((f) => severityRank(f.severity) >= severityRank(min));
}

function hasRedactable(findings: readonly AIFinding[]): boolean {
  return findings.some((f) => f.type !== "prompt_injection");
}

interface Decision {
  allowed: boolean;
  recommendedAction: AIRecommendedAction;
}

/** Apply a policy to the set of findings to reach a final decision. */
function decide(policy: AIGuardPolicy, findings: readonly AIFinding[]): Decision {
  const baseline = baselineAction(findings);
  switch (policy) {
    case "monitor":
      // Log only: surface advice but never block.
      return { allowed: true, recommendedAction: baseline };
    case "warn":
      return { allowed: true, recommendedAction: baseline };
    case "block": {
      const blockWorthy = baseline === "block" || hasSeverityAtLeast(findings, "high");
      return { allowed: !blockWorthy, recommendedAction: blockWorthy ? "block" : baseline };
    }
    case "strict": {
      const hasFindings = findings.length > 0;
      return { allowed: !hasFindings, recommendedAction: hasFindings ? "block" : "allow" };
    }
  }
}

/**
 * Guard an AI prompt under the given policy. `policy` defaults to `"warn"`.
 */
export function guardPrompt(
  args: GuardPromptArgs,
  options: GuardOptions = {},
  defaultPolicy: AIGuardPolicy = "warn",
): AIGuardResult {
  const policy = args.policy ?? defaultPolicy;
  const input = args.input ?? "";
  const findings = detectFindings(input, {
    includeMatch: options.includeMatch,
    redactMatches: options.redactMatches,
  });
  const decision = decide(policy, findings);

  const result: AIGuardResult = {
    allowed: decision.allowed,
    policy,
    input,
    findings,
    recommendedAction: decision.recommendedAction,
  };

  // Offer a sanitized version whenever there is something redactable, so the
  // caller can choose to send the safe text instead of the raw input.
  if (hasRedactable(findings)) {
    result.sanitizedInput = redact(input);
  }

  return result;
}
