import type { AIGuardResult, PolicyDecision, SentinelPolicy, ThreatReport } from "@sentinelrn/core";
import { useCallback } from "react";
import { useSentinel } from "./useSentinel.js";

/** Return shape of {@link useSentinelPolicy}. */
export interface UseSentinelPolicyResult {
  evaluateIntegrity: (report: ThreatReport, policy?: SentinelPolicy) => PolicyDecision;
  evaluateAI: (result: AIGuardResult, policy?: SentinelPolicy) => PolicyDecision;
}

/**
 * Access the policy engine from React, bound to the active instance's default
 * policy unless an override is passed.
 */
export function useSentinelPolicy(): UseSentinelPolicyResult {
  const sentinel = useSentinel();

  const evaluateIntegrity = useCallback(
    (report: ThreatReport, policy?: SentinelPolicy) =>
      sentinel.policy.evaluateIntegrity(report, policy),
    [sentinel],
  );

  const evaluateAI = useCallback(
    (result: AIGuardResult, policy?: SentinelPolicy) => sentinel.policy.evaluateAI(result, policy),
    [sentinel],
  );

  return { evaluateIntegrity, evaluateAI };
}
