# SentinelRN API Design

## Purpose

This document defines the public API for SentinelRN.

The primary goal is to provide a security framework that feels natural to React Native developers while exposing powerful runtime integrity and AI security capabilities.

The API should be:

- Type-safe
- Predictable
- Framework-friendly
- Easy to adopt
- Difficult to misuse
- Honest about security limitations

---

# Design Philosophy

SentinelRN should not feel like a collection of unrelated utility functions.

Instead, it should feel like a cohesive security platform.

Developers should immediately understand the SDK through a small number of namespaces.

Good:

```ts
const report = await SentinelRN.integrity.check();
```

Bad:

```ts
checkRoot();
checkDebugger();
checkFrida();
checkPromptInjection();
```

The SDK should expose concepts rather than individual implementation details.

---

# Public API Surface

The package should expose one primary entry point.

```ts
import { SentinelRN } from "@sentinelrn/core";
```

Top-level namespaces:

```ts
SentinelRN.configure();

SentinelRN.integrity;

SentinelRN.ai;

SentinelRN.policy;

SentinelRN.redaction;

SentinelRN.version;
```

Nothing else should be imported directly during normal usage.

---

# Configuration

Minimal configuration:

```ts
SentinelRN.configure({
  policy: "monitor",
});
```

Advanced configuration:

```ts
SentinelRN.configure({
  policy: {
    mode: "warn",
    blockOnHighRiskDevice: false,
    redactSensitiveInput: true,
    blockPromptInjection: true,
    allowInSimulator: true,
  },

  integrity: {
    includeEvidence: false,
  },

  ai: {
    includeFindings: true,
    redactMatches: true,
  },
});
```

Configuration should always remain optional.

Secure defaults are preferred.

---

# Runtime Integrity

## Check Device

```ts
const report = await SentinelRN.integrity.check();
```

Returns:

```ts
type ThreatReport = {
  riskLevel: RiskLevel;
  score: number;
  compromised: boolean;
  signals: ThreatSignal[];
  recommendedAction: RecommendedAction;
  checkedAt: string;
};
```

---

# Threat Signal

```ts
type ThreatSignal = {
  id: string;
  type: ThreatSignalType;

  platform: "ios" | "android" | "unknown";

  severity: "low" | "medium" | "high" | "critical";

  confidence: "low" | "medium" | "high";

  message: string;

  evidence?: Record<string, unknown>;
};
```

---

# Threat Signal Types

```ts
type ThreatSignalType =
  | "root"
  | "jailbreak"
  | "emulator"
  | "simulator"
  | "debugger"
  | "developer_mode"
  | "mock_location"
  | "hooking"
  | "tampering"
  | "unknown";
```

---

# Risk Levels

```ts
type RiskLevel = "low" | "medium" | "high" | "critical";
```

---

# Recommended Actions

```ts
type RecommendedAction =
  | "allow"
  | "monitor"
  | "warn_user"
  | "block_sensitive_action"
  | "block_session";
```

---

# AI Security

## Guard Prompt

```ts
const result = await SentinelRN.ai.guardPrompt({
  input: prompt,
  policy: "strict",
});
```

Returns:

```ts
type AIGuardResult = {
  allowed: boolean;

  policy: "monitor" | "warn" | "block" | "strict";

  input: string;

  sanitizedInput?: string;

  findings: AIFinding[];

  recommendedAction: "allow" | "redact" | "warn" | "block";
};
```

---

# AI Finding

```ts
type AIFinding = {
  id: string;

  type:
    | "secret"
    | "credential"
    | "jwt"
    | "email"
    | "phone"
    | "ssn"
    | "credit_card"
    | "prompt_injection"
    | "sensitive_context";

  severity: "low" | "medium" | "high" | "critical";

  confidence: "low" | "medium" | "high";

  message: string;

  match?: string;

  redacted?: string;
};
```

---

# Redaction

Simple redaction:

```ts
const output = SentinelRN.redaction.redact(input);
```

Advanced inspection:

```ts
const result = SentinelRN.redaction.inspectAndRedact(input);
```

Returns:

```ts
{
  sanitizedInput: "...",
  findings: [...]
}
```

---

# Policy Engine

Evaluate an integrity report.

```ts
const decision = SentinelRN.policy.evaluateIntegrity(report, {
  mode: "warn",
});
```

Returns:

```ts
type PolicyDecision = {
  allowed: boolean;

  mode: "monitor" | "warn" | "block";

  recommendedAction: RecommendedAction;

  reasons: string[];
};
```

---

# React Integration

## Provider

```tsx
<SentinelProvider
  config={{
    policy: "monitor",
  }}
>
  <App />
</SentinelProvider>
```

---

## Hooks

```ts
const integrity = useDeviceIntegrity();
```

Returns:

```ts
{
  (report, loading, error, refresh, compromised, riskLevel);
}
```

---

```ts
const ai = useAISecurity();
```

Returns:

```ts
{
  (guardPrompt, redact, findings);
}
```

---

```ts
const policy = useSentinelPolicy();
```

Returns:

```ts
{
  (evaluateIntegrity, evaluateAI);
}
```

---

# Example Usage

## Runtime Integrity

```ts
const report = await SentinelRN.integrity.check();

const decision = SentinelRN.policy.evaluateIntegrity(report, {
  mode: "block",
});

if (!decision.allowed) {
  throw new Error("Sensitive action blocked.");
}
```

---

## AI Prompt Protection

```ts
const result = await SentinelRN.ai.guardPrompt({
  input: userPrompt,
  policy: "strict",
});

if (!result.allowed) {
  return;
}

await sendToLLM(result.sanitizedInput ?? userPrompt);
```

---

# Error Model

The SDK should never crash the host application because a detector fails.

Errors should be structured.

```ts
type SentinelError = {
  code: string;

  module: "integrity" | "ai" | "policy" | "redaction" | "native";

  message: string;

  cause?: unknown;
};
```

---

# Design Constraints

The public API should avoid:

- Magic behavior
- Hidden side effects
- Silent blocking
- Provider-specific AI assumptions
- Tight coupling to React
- Boolean-only security responses

Every security decision should be explainable.

---

# Versioning

The public API should remain stable after v1.0.

Before v1.0, breaking changes are acceptable if they improve clarity or long-term maintainability.

---

# Guiding Principle

Every public API should answer one question:

> "If I were building a production healthcare, fintech, or AI-powered mobile application today, would this API make my application safer while remaining simple enough that another engineer could understand it immediately?"

If the answer is no, it does not belong in SentinelRN.
