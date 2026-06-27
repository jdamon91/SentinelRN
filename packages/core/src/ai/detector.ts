import type { AIFinding, AIFindingType, Confidence, Severity } from "../types/index.js";
import { slugId } from "../utils/index.js";
import { findInjections } from "./injection.js";
import { PATTERN_DETECTORS } from "./patterns.js";

/**
 * Detection layer for AI-bound input.
 *
 * Runs every pattern detector (secrets, PII) and injection rule over the input,
 * resolves overlapping matches by priority (secrets beat PII beat injection
 * markers), and returns normalized {@link AIFinding}s sorted in reading order.
 */

/** Options controlling what detail is attached to findings. */
export interface DetectOptions {
  /** Include the raw matched substring on each finding. Off by default. */
  includeMatch?: boolean;
  /** Populate the `redacted` preview on each finding. On by default. */
  redactMatches?: boolean;
}

interface Candidate {
  id: string;
  type: AIFindingType;
  severity: Severity;
  confidence: Confidence;
  message: string;
  start: number;
  end: number;
  match: string;
  /** Lower wins when ranges overlap. */
  priority: number;
}

/** Mask a matched value into a short, non-sensitive preview. */
export function maskMatch(match: string): string {
  const trimmed = match.trim();
  if (trimmed.length <= 4) return "•".repeat(trimmed.length);
  return `${trimmed.slice(0, 3)}•••••`;
}

function gatherPatternCandidates(input: string): Candidate[] {
  const candidates: Candidate[] = [];
  PATTERN_DETECTORS.forEach((det, priority) => {
    // Reset lastIndex defensively since detectors share module-level regexes.
    det.pattern.lastIndex = 0;
    for (const m of input.matchAll(det.pattern)) {
      if (typeof m.index !== "number") continue;
      const whole = m[0];
      let value = whole;
      let start = m.index;
      if (det.group != null && m[det.group]) {
        value = m[det.group] as string;
        const offset = whole.indexOf(value);
        if (offset >= 0) start = m.index + offset;
      }
      if (det.validate && !det.validate(value)) continue;
      candidates.push({
        id: slugId("ai", det.id),
        type: det.type,
        severity: det.severity,
        confidence: det.confidence,
        message: det.message,
        start,
        end: start + value.length,
        match: value,
        priority,
      });
    }
  });
  return candidates;
}

function gatherInjectionCandidates(input: string): Candidate[] {
  const base = PATTERN_DETECTORS.length;
  return findInjections(input).map((hit, i) => ({
    id: slugId("ai", "injection", hit.rule.id),
    type: "prompt_injection" as const,
    severity: hit.rule.severity,
    confidence: hit.rule.confidence,
    message: hit.rule.message,
    start: hit.range[0],
    end: hit.range[1],
    match: hit.match,
    priority: base + i,
  }));
}

/** Drop candidates whose span overlaps a higher-priority one already kept. */
function resolveOverlaps(candidates: Candidate[]): Candidate[] {
  const ordered = [...candidates].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.end - b.start - (a.end - a.start);
  });
  const kept: Candidate[] = [];
  for (const cand of ordered) {
    const overlaps = kept.some((k) => cand.start < k.end && cand.end > k.start);
    if (!overlaps) kept.push(cand);
  }
  return kept.sort((a, b) => a.start - b.start);
}

function toFinding(cand: Candidate, options: DetectOptions): AIFinding {
  const finding: AIFinding = {
    id: cand.id,
    type: cand.type,
    severity: cand.severity,
    confidence: cand.confidence,
    message: cand.message,
    range: [cand.start, cand.end],
  };
  if (options.includeMatch) finding.match = cand.match;
  if (options.redactMatches !== false) finding.redacted = maskMatch(cand.match);
  return finding;
}

/** Internal: resolved candidates, used by both detection and redaction. */
export function detectCandidates(input: string): Candidate[] {
  if (!input) return [];
  return resolveOverlaps([...gatherPatternCandidates(input), ...gatherInjectionCandidates(input)]);
}

/** Detect all secrets, PII, and injection attempts in the input. */
export function detectFindings(input: string, options: DetectOptions = {}): AIFinding[] {
  return detectCandidates(input).map((c) => toFinding(c, options));
}

export type { Candidate };
