# API Reference

The primary entry point is the cohesive `SentinelRN` object.

```ts
import { SentinelRN } from "@sentinelrn/core";
```

## `SentinelRN.configure(config)`

Apply configuration. Optional — secure defaults apply otherwise.

```ts
SentinelRN.configure({
  policy: "monitor",
  integrity: { includeEvidence: false },
  ai: { includeFindings: false, redactMatches: true },
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `policy` | `SentinelPolicy` | `"monitor"` | Default policy across modules. |
| `integrity.includeEvidence` | `boolean` | `false` | Attach raw evidence to signals (may be sensitive). |
| `ai.includeFindings` | `boolean` | `false` | Include the matched substring on findings. |
| `ai.redactMatches` | `boolean` | `true` | Populate `redacted` previews on findings. |

## `SentinelRN.integrity`

| Member | Signature | Description |
| --- | --- | --- |
| `check()` | `() => Promise<ThreatReport>` | Run an integrity check via the registered provider. |
| `registerProvider(p)` | `(IntegrityProvider) => void` | Register the active platform provider. |
| `getProvider()` | `() => IntegrityProvider \| undefined` | The current provider. |

## `SentinelRN.ai`

| Member | Signature | Description |
| --- | --- | --- |
| `guardPrompt(args)` | `(GuardPromptArgs) => AIGuardResult` | Inspect AI-bound input under a policy. |

```ts
type GuardPromptArgs = { input: string; policy?: "monitor" | "warn" | "block" | "strict" };
```

## `SentinelRN.policy`

| Member | Signature |
| --- | --- |
| `evaluateIntegrity(report, policy?)` | `(ThreatReport, SentinelPolicy?) => PolicyDecision` |
| `evaluateAI(result, policy?)` | `(AIGuardResult, SentinelPolicy?) => PolicyDecision` |

## `SentinelRN.redaction`

| Member | Signature | Description |
| --- | --- | --- |
| `redact(input)` | `(string) => string` | Replace secrets/PII with placeholders. |
| `inspectAndRedact(input)` | `(string) => RedactionResult` | Sanitized text plus findings. |

## `SentinelRN.registerIntegrityProvider(provider)`

Shortcut for `integrity.registerProvider`. Used by `@sentinelrn/native`.

## `SentinelRN.version`

The package version string.

## Types

```ts
type RiskLevel = "low" | "medium" | "high" | "critical";
type Severity = "low" | "medium" | "high" | "critical";
type Confidence = "low" | "medium" | "high";
type RecommendedAction =
  | "allow" | "monitor" | "warn_user" | "block_sensitive_action" | "block_session";

type SentinelPolicy = "monitor" | "warn" | "block" | PolicyConfig;

interface PolicyConfig {
  mode?: "monitor" | "warn" | "block";
  blockOnHighRiskDevice?: boolean;
  redactSensitiveInput?: boolean;
  blockPromptInjection?: boolean;
  allowInSimulator?: boolean;
}

interface IntegrityProvider {
  readonly name: string;
  collectSignals(): Promise<RawSignal[]> | RawSignal[];
}
```

## Advanced exports

For extension and advanced use, `@sentinelrn/core` also exports the underlying
engines: `assessRisk`, `aggregateScore`, `riskLevelFromScore`,
`buildThreatReport`, `normalizeSignal`, `detectFindings`, `guardPrompt`,
`redact`, `inspectAndRedact`, `evaluateIntegrity`, `evaluateAI`, `resolvePolicy`,
`createSentinel`, and the detector/rule tables (`PATTERN_DETECTORS`,
`INJECTION_RULES`).

## Errors

The SDK never crashes the host app because a detector fails. Errors are
structured:

```ts
class SentinelError {
  code: string;
  module: "integrity" | "ai" | "policy" | "redaction" | "native" | "core";
  message: string;
  cause?: unknown;
}
```
