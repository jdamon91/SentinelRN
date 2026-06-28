# AI Security

AI-powered mobile apps increasingly send user-generated content to external
models. That content may contain secrets, personal information, or attempts to
hijack the model. SentinelRN inspects AI-bound text **before it leaves the
device**.

## Guarding a prompt

```ts
const result = SentinelRN.ai.guardPrompt({ input: userText, policy: "strict" });

if (!result.allowed) return;
await sendToLLM(result.sanitizedInput ?? userText);
```

```ts
type AIGuardResult = {
  allowed: boolean;
  policy: "monitor" | "warn" | "block" | "strict";
  input: string;
  sanitizedInput?: string;   // present when there is redactable content
  findings: AIFinding[];
  recommendedAction: "allow" | "redact" | "warn" | "block";
};
```

## Findings

```ts
type AIFinding = {
  id: string;
  type: "secret" | "credential" | "jwt" | "api_key" | "email" | "phone"
      | "ssn" | "credit_card" | "ip_address" | "prompt_injection" | "sensitive_context";
  severity: "low" | "medium" | "high" | "critical";
  confidence: "low" | "medium" | "high";
  message: string;
  range?: [number, number];
  match?: string;     // only when ai.includeFindings is enabled
  redacted?: string;  // e.g. "sk-•••••"
};
```

## What's detected

**Secrets & credentials** (high/critical): OpenAI, Anthropic, AWS, GitHub
(classic + fine-grained), Google, Slack tokens & webhooks, Stripe, SendGrid, npm,
Twilio, PEM private keys, JWTs, `Authorization: Bearer` tokens, and
`password:`/`secret:`-style assignments.

**Personal information**: emails, US SSNs, payment card numbers (Luhn-validated),
phone numbers, and IPv4 addresses.

**Prompt injection** (heuristic): instruction overrides ("ignore all previous
instructions"), system-prompt exfiltration, safety-rule overrides, DAN-style
jailbreaks, unrestricted-persona requests, injected instruction blocks, "repeat
verbatim" extraction, fake system tags, and encoded-payload obfuscation.

## Redaction

Use redaction directly when you just want safe text:

```ts
SentinelRN.redaction.redact("my key is sk-abc…");
// "my key is [REDACTED_API_KEY]"

SentinelRN.redaction.inspectAndRedact(text);
// { sanitizedInput: "…", findings: [...] }
```

Secrets and PII are replaced with stable placeholders like `[REDACTED_SSN]`.
Prompt-injection findings are **reported but not redacted** — the surrounding
text is the payload, so policy (not redaction) decides whether to block it.

## How policy affects the result

| Policy | Behavior |
| --- | --- |
| `monitor` | Always allowed; findings surfaced for logging. |
| `warn` | Allowed; recommends redaction/warning. |
| `block` | Blocks high-severity secrets and injection. |
| `strict` | Blocks if **any** finding is present. |

## Limitations

Prompt-injection detection is heuristic and PII detection can produce false
positives and negatives. Always enforce server-side AI safety controls too.
