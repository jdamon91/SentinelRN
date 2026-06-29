# Threat Model

SentinelRN is a **risk-based** security framework. It does not claim perfect
protection — mobile runtime checks can be bypassed, prompt-injection detection
can miss attacks, and PII detection can produce false positives and negatives.
The goal is to help developers make better, more informed security decisions.

## Threats SentinelRN addresses

1. **Compromised runtime environments** — rooted, jailbroken, emulated, or
   otherwise modified devices that weaken platform protections.
2. **Runtime instrumentation & tampering** — debuggers, Frida, hooking
   frameworks, method swizzling, repackaged builds.
3. **Unsafe AI input handling** — secrets, PII, or injection sent to an AI
   provider without inspection.
4. **Sensitive data leakage** — secrets/PII leaking into logs, analytics, crash
   reports, or AI payloads.
5. **Poor application response to risk** — boolean-only APIs with no severity,
   confidence, or recommended action.

## What SentinelRN does **not** protect against

- A fully compromised backend
- A malicious authorized user
- Stolen credentials already accepted by the server
- A determined attacker with full device control
- All possible root/jailbreak bypasses or prompt-injection attacks
- Insecure API design or AI provider configuration

## Backend still matters

SentinelRN should never be your only security boundary. Continue to enforce
backend authorization, rate limiting, token revocation, server-side prompt
validation, audit logging, and abuse detection.

> The client can reduce risk. The server must enforce trust.

The full threat model lives in the repository:
[`docs/THREAT_MODEL.md`](https://github.com/jdamon91/SentinelRN/blob/main/docs/THREAT_MODEL.md).
