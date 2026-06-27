import type { AIFinding, RedactionResult } from "../types/index.js";
import { type Candidate, detectCandidates, maskMatch } from "./detector.js";

/**
 * Redaction utilities.
 *
 * Replaces detected secrets and PII in-place with stable placeholder tokens,
 * preserving the surrounding text so the input remains usable by an AI provider
 * without leaking sensitive values. Prompt-injection findings are *reported*
 * but not redacted — the surrounding text is the payload, and policy (not
 * redaction) decides whether to block it.
 */

/** Build the placeholder token for a finding, e.g. `[REDACTED_CREDIT_CARD]`. */
export function placeholderFor(type: Candidate["type"]): string {
  return `[REDACTED_${type.toUpperCase()}]`;
}

/** Candidate types that are redacted from text (everything except injection). */
function isRedactable(cand: Candidate): boolean {
  return cand.type !== "prompt_injection";
}

function applyRedactions(input: string, candidates: Candidate[]): string {
  // Replace from the end so earlier indices stay valid as the string shrinks.
  const ordered = candidates.filter(isRedactable).sort((a, b) => b.start - a.start);
  let output = input;
  for (const cand of ordered) {
    output = output.slice(0, cand.start) + placeholderFor(cand.type) + output.slice(cand.end);
  }
  return output;
}

function toFinding(cand: Candidate): AIFinding {
  return {
    id: cand.id,
    type: cand.type,
    severity: cand.severity,
    confidence: cand.confidence,
    message: cand.message,
    range: [cand.start, cand.end],
    redacted: isRedactable(cand) ? maskMatch(cand.match) : undefined,
  };
}

/**
 * Redact sensitive content from `input`, returning only the sanitized string.
 * The simplest entry point — `SentinelRN.redaction.redact(text)`.
 */
export function redact(input: string): string {
  if (!input) return input;
  return applyRedactions(input, detectCandidates(input));
}

/**
 * Redact sensitive content and return both the sanitized string and structured
 * findings describing what was redacted.
 */
export function inspectAndRedact(input: string): RedactionResult {
  const candidates = detectCandidates(input);
  return {
    sanitizedInput: applyRedactions(input, candidates),
    findings: candidates.map(toFinding),
  };
}
