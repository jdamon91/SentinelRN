import type { AIFindingType, Confidence, Severity } from "../types/index.js";

/**
 * Pattern-based detectors for secrets and structured PII.
 *
 * Each entry describes a regular expression plus the metadata SentinelRN
 * attaches to anything it matches. Patterns are deliberately conservative:
 * recognizable, structured tokens (provider API keys, JWTs, card numbers that
 * pass Luhn) get high confidence, while looser patterns (free-form credential
 * assignments, phone numbers) get medium/low confidence to reflect false
 * positives. Detection is heuristic by design — see the threat model.
 */
export interface PatternDetector {
  /** Stable identifier suffix, e.g. `"openai_key"`. */
  id: string;
  type: AIFindingType;
  severity: Severity;
  confidence: Confidence;
  message: string;
  /** Global regex. The `g` flag is required so every occurrence is found. */
  pattern: RegExp;
  /**
   * Optional capture-group index whose span is treated as the sensitive match
   * (and redacted), instead of the whole match. Used to keep e.g. the
   * `password:` label while redacting only the value.
   */
  group?: number;
  /** Optional extra validation (e.g. Luhn) applied to the matched text. */
  validate?: (match: string) => boolean;
}

/** Luhn checksum, used to reduce credit-card false positives. */
export function luhnValid(value: string): boolean {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/** Reject obviously-invalid SSNs (all zeros in a group, reserved ranges). */
export function ssnValid(value: string): boolean {
  const m = value.match(/(\d{3})-?(\d{2})-?(\d{4})/);
  if (!m) return false;
  const [, area, group, serial] = m as unknown as [string, string, string, string];
  if (area === "000" || area === "666" || area.startsWith("9")) return false;
  if (group === "00" || serial === "0000") return false;
  return true;
}

/** Secrets and credentials — highest-severity AI findings. */
export const SECRET_DETECTORS: PatternDetector[] = [
  {
    id: "openai_key",
    type: "api_key",
    severity: "critical",
    confidence: "high",
    message: "An OpenAI-style API key was detected.",
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: "anthropic_key",
    type: "api_key",
    severity: "critical",
    confidence: "high",
    message: "An Anthropic-style API key was detected.",
    pattern: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: "aws_access_key",
    type: "secret",
    severity: "critical",
    confidence: "high",
    message: "An AWS access key ID was detected.",
    pattern: /\b(?:AKIA|ASIA|AGPA|AIDA)[0-9A-Z]{16}\b/g,
  },
  {
    id: "github_token",
    type: "secret",
    severity: "critical",
    confidence: "high",
    message: "A GitHub token was detected.",
    pattern: /\bgh[posru]_[A-Za-z0-9]{36,}\b/g,
  },
  {
    id: "google_api_key",
    type: "api_key",
    severity: "critical",
    confidence: "high",
    message: "A Google API key was detected.",
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    id: "slack_token",
    type: "secret",
    severity: "critical",
    confidence: "high",
    message: "A Slack token was detected.",
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    id: "private_key",
    type: "secret",
    severity: "critical",
    confidence: "high",
    message: "A PEM private key block was detected.",
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    id: "jwt",
    type: "jwt",
    severity: "high",
    confidence: "high",
    message: "A JSON Web Token (JWT) was detected.",
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    id: "credential_assignment",
    type: "credential",
    severity: "high",
    confidence: "medium",
    message: "A password or secret assignment was detected.",
    pattern:
      /\b(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\b\s*[:=]\s*["']?([^\s"']{6,})/gi,
    group: 1,
  },
];

/** Structured personal information — lower severity than secrets. */
export const PII_DETECTORS: PatternDetector[] = [
  {
    id: "email",
    type: "email",
    severity: "low",
    confidence: "high",
    message: "An email address was detected.",
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  },
  {
    id: "ssn",
    type: "ssn",
    severity: "high",
    confidence: "medium",
    message: "A US Social Security Number was detected.",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    validate: ssnValid,
  },
  {
    id: "credit_card",
    type: "credit_card",
    severity: "high",
    confidence: "high",
    message: "A payment card number was detected.",
    pattern: /\b(?:\d[ -]?){13,19}\b/g,
    validate: luhnValid,
  },
  {
    id: "phone",
    type: "phone",
    severity: "low",
    confidence: "medium",
    message: "A phone number was detected.",
    pattern: /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
  },
  {
    id: "ipv4",
    type: "ip_address",
    severity: "low",
    confidence: "low",
    message: "An IPv4 address was detected.",
    pattern: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
  },
];

/** All pattern detectors, secrets first so they win on overlapping ranges. */
export const PATTERN_DETECTORS: PatternDetector[] = [...SECRET_DETECTORS, ...PII_DETECTORS];
