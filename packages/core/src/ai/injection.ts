import type { Confidence, Severity } from "../types/index.js";

/**
 * Prompt-injection heuristics.
 *
 * These match common patterns used to override system instructions, exfiltrate
 * a hidden system prompt, or coerce an assistant into ignoring its guardrails.
 * This is heuristic and best-effort — it raises attacker cost and catches the
 * obvious cases, but cannot detect every injection. Always pair with
 * server-side AI safety controls (see threat model).
 */
export interface InjectionRule {
  id: string;
  severity: Severity;
  confidence: Confidence;
  message: string;
  pattern: RegExp;
}

export const INJECTION_RULES: InjectionRule[] = [
  {
    id: "ignore_previous",
    severity: "high",
    confidence: "high",
    message: "Attempt to ignore or override previous instructions.",
    pattern:
      /\b(?:ignore|disregard|forget)\b[^.?!\n]{0,40}\b(?:previous|prior|above|earlier|all)\b[^.?!\n]{0,20}\b(?:instructions?|prompts?|rules?|context)\b/i,
  },
  {
    id: "reveal_system_prompt",
    severity: "high",
    confidence: "high",
    message: "Attempt to reveal hidden or system instructions.",
    pattern:
      /\b(?:reveal|show|print|repeat|output|tell me|what (?:are|is|were))\b[^.?!\n]{0,40}\b(?:system|initial|original|hidden|developer)\b[^.?!\n]{0,15}\b(?:prompt|instructions?|message)\b/i,
  },
  {
    id: "override_rules",
    severity: "high",
    confidence: "medium",
    message: "Attempt to override safety rules or restrictions.",
    pattern:
      /\b(?:override|bypass|disable|turn off|remove)\b[^.?!\n]{0,30}\b(?:safety|guardrails?|restrictions?|filters?|rules?|limitations?)\b/i,
  },
  {
    id: "dan_jailbreak",
    severity: "high",
    confidence: "medium",
    message: 'Known jailbreak phrasing detected (e.g. "DAN" / "do anything now").',
    pattern: /\b(?:do anything now|DAN mode|jailbreak|developer mode enabled)\b/i,
  },
  {
    id: "unrestricted_persona",
    severity: "medium",
    confidence: "medium",
    message: "Attempt to assume an unrestricted persona.",
    pattern:
      /\b(?:you are now|act as|pretend (?:to be|you are)|roleplay as)\b[^.?!\n]{0,50}\b(?:no|without|free of)\b[^.?!\n]{0,20}\b(?:restrictions?|rules?|filters?|limits?|guidelines?)\b/i,
  },
  {
    id: "instruction_injection_marker",
    severity: "medium",
    confidence: "low",
    message: "Text contains instruction-injection markers (e.g. fake system tags).",
    pattern: /(?:\[\/?(?:system|inst|assistant)\]|<\/?(?:system|im_start|im_end)>|###\s*system)/i,
  },
];

export interface InjectionMatch {
  rule: InjectionRule;
  range: [number, number];
  match: string;
}

/** Find every injection-rule hit in the input, with character ranges. */
export function findInjections(input: string): InjectionMatch[] {
  const matches: InjectionMatch[] = [];
  for (const rule of INJECTION_RULES) {
    const m = rule.pattern.exec(input);
    if (m && typeof m.index === "number") {
      matches.push({ rule, range: [m.index, m.index + m[0].length], match: m[0] });
    }
  }
  return matches;
}
