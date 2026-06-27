# @sentinelrn/core

The framework-agnostic engine behind [SentinelRN](https://github.com/sentinelrn/sentinelrn) — the Application Trust Runtime for React Native.

This package contains all the security logic and **no platform or React code**: shared types, the risk engine, the threat engine, AI detectors (secrets, PII, prompt injection), redaction, and the policy engine — assembled behind a single cohesive `SentinelRN` object.

## Install

```bash
pnpm add @sentinelrn/core
```

## Usage

```ts
import { SentinelRN } from "@sentinelrn/core";

SentinelRN.configure({ policy: "warn" });

// Runtime integrity (requires a registered provider, e.g. @sentinelrn/native)
const report = await SentinelRN.integrity.check();
const decision = SentinelRN.policy.evaluateIntegrity(report, "block");
if (!decision.allowed) throw new Error("Sensitive action blocked");

// AI prompt protection
const result = SentinelRN.ai.guardPrompt({ input: userText, policy: "strict" });
if (!result.allowed) return;
await sendToLLM(result.sanitizedInput ?? userText);

// Redaction
const safe = SentinelRN.redaction.redact("my key is sk-…");
```

## API surface

| Namespace | Purpose |
| --- | --- |
| `SentinelRN.configure()` | Apply configuration (optional; secure defaults apply). |
| `SentinelRN.integrity` | Run runtime-integrity checks via a registered provider. |
| `SentinelRN.ai` | Guard AI-bound prompts for secrets, PII, and injection. |
| `SentinelRN.policy` | Turn reports into allow/block decisions with reasons. |
| `SentinelRN.redaction` | Redact sensitive content from strings. |

The lower-level engines (`assessRisk`, `buildThreatReport`, `detectFindings`, `evaluateIntegrity`, …) are also exported for advanced use and extension.

## Philosophy

SentinelRN is **risk-based**: detection is probabilistic and explainable, never a guarantee. Every result tells you what was detected, how severe it is, how confident the detection is, and what action to consider. Always enforce trust on the server too.

MIT © SentinelRN
