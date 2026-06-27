import type { AIFinding, AIGuardResult, GuardPromptArgs, RedactionResult } from "@sentinelrn/core";
import { useCallback, useState } from "react";
import { useSentinel } from "./useSentinel.js";

/** Return shape of {@link useAISecurity}. */
export interface UseAISecurityResult {
  /** Guard an AI prompt; also stores the resulting findings in state. */
  guardPrompt: (args: GuardPromptArgs) => AIGuardResult;
  /** Redact sensitive content from a string. */
  redact: (input: string) => string;
  /** Inspect and redact, returning both sanitized text and findings. */
  inspectAndRedact: (input: string) => RedactionResult;
  /** Findings from the most recent `guardPrompt` call. */
  findings: AIFinding[];
}

/**
 * AI input protection from React.
 *
 * ```tsx
 * const { guardPrompt, findings } = useAISecurity();
 * const result = guardPrompt({ input, policy: "strict" });
 * if (!result.allowed) return;
 * ```
 */
export function useAISecurity(): UseAISecurityResult {
  const sentinel = useSentinel();
  const [findings, setFindings] = useState<AIFinding[]>([]);

  const guardPrompt = useCallback(
    (args: GuardPromptArgs): AIGuardResult => {
      const result = sentinel.ai.guardPrompt(args);
      setFindings(result.findings);
      return result;
    },
    [sentinel],
  );

  const redact = useCallback((input: string) => sentinel.redaction.redact(input), [sentinel]);
  const inspectAndRedact = useCallback(
    (input: string) => sentinel.redaction.inspectAndRedact(input),
    [sentinel],
  );

  return { guardPrompt, redact, inspectAndRedact, findings };
}
