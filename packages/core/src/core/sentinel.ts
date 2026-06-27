import { guardPrompt as guardPromptImpl } from "../ai/guard.js";
import { inspectAndRedact, redact } from "../ai/redaction.js";
import { createIntegrityModule, type IntegrityModule, type IntegrityProvider } from "../integrity/index.js";
import { evaluateAI, evaluateIntegrity } from "../policy/index.js";
import type {
  AIGuardPolicy,
  AIGuardResult,
  GuardPromptArgs,
  PolicyDecision,
  RedactionResult,
  ResolvedConfig,
  SentinelConfig,
  SentinelPolicy,
  ThreatReport,
} from "../types/index.js";
import { DEFAULT_CONFIG, resolveConfig } from "./config.js";

/** Current package version, surfaced as `SentinelRN.version`. */
export const VERSION = "0.1.0";

/** Map the top-level policy onto an AI-guard policy (no `strict` at this level). */
function defaultAIPolicy(policy: SentinelPolicy): AIGuardPolicy {
  const mode = typeof policy === "string" ? policy : (policy.mode ?? "warn");
  return mode;
}

/** The cohesive public API object returned by {@link createSentinel}. */
export interface Sentinel {
  /** Apply configuration. Optional — secure defaults apply otherwise. */
  configure(config: SentinelConfig): void;
  /** The fully-resolved active configuration (read-only snapshot). */
  getConfig(): ResolvedConfig;

  /** Runtime-integrity namespace. */
  integrity: IntegrityModule;

  /** AI-security namespace. */
  ai: {
    /** Inspect AI-bound input and return an explainable, policy-aware result. */
    guardPrompt(args: GuardPromptArgs): AIGuardResult;
  };

  /** Policy namespace — turn reports into application decisions. */
  policy: {
    evaluateIntegrity(report: ThreatReport, policy?: SentinelPolicy): PolicyDecision;
    evaluateAI(result: AIGuardResult, policy?: SentinelPolicy): PolicyDecision;
  };

  /** Redaction namespace. */
  redaction: {
    redact(input: string): string;
    inspectAndRedact(input: string): RedactionResult;
  };

  /** Register a platform integrity provider (used by `@sentinelrn/native`). */
  registerIntegrityProvider(provider: IntegrityProvider): void;

  /** Package version. */
  readonly version: string;
}

/**
 * Create an isolated SentinelRN instance. Most apps use the shared singleton
 * exported as `SentinelRN`, but isolated instances are handy for tests.
 */
export function createSentinel(initial?: SentinelConfig): Sentinel {
  let config: ResolvedConfig = resolveConfig(initial, DEFAULT_CONFIG);

  const integrity = createIntegrityModule({ getConfig: () => config.integrity });

  const sentinel: Sentinel = {
    configure(next: SentinelConfig) {
      config = resolveConfig(next, config);
    },
    getConfig() {
      return config;
    },
    integrity,
    ai: {
      guardPrompt(args: GuardPromptArgs): AIGuardResult {
        return guardPromptImpl(
          args,
          { includeMatch: config.ai.includeFindings, redactMatches: config.ai.redactMatches },
          defaultAIPolicy(config.policy),
        );
      },
    },
    policy: {
      evaluateIntegrity(report: ThreatReport, policy?: SentinelPolicy): PolicyDecision {
        return evaluateIntegrity(report, policy ?? config.policy);
      },
      evaluateAI(result: AIGuardResult, policy?: SentinelPolicy): PolicyDecision {
        return evaluateAI(result, policy ?? config.policy);
      },
    },
    redaction: {
      redact,
      inspectAndRedact,
    },
    registerIntegrityProvider(provider: IntegrityProvider) {
      integrity.registerProvider(provider);
    },
    version: VERSION,
  };

  return sentinel;
}

/** The shared, app-wide SentinelRN instance. */
export const SentinelRN: Sentinel = createSentinel();
