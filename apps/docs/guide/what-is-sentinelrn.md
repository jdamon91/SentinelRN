# What is SentinelRN?

SentinelRN is an open-source **Application Trust Runtime (ATR)** for React
Native. It helps production mobile apps continuously evaluate runtime trust,
assess AI input risk, and make explainable security decisions before sensitive
actions occur.

## The problem

Today's React Native security ecosystem is fragmented. You install one package
for jailbreak detection, another for secure storage, another for SSL pinning,
another for PII detection. Each answers a different question — and none answer
the one apps actually care about:

> **Can I trust this environment enough to perform this action?**

Most libraries also return bare booleans:

```ts
const rooted = await isRooted(); // …now what?
```

A boolean doesn't tell you how severe the situation is, how confident the
detection is, or what your app should do about it.

## The SentinelRN approach

SentinelRN returns **structured, explainable reports** instead of booleans:

```ts
{
  riskLevel: "high",
  score: 82,
  compromised: true,
  recommendedAction: "block_sensitive_action",
  signals: [
    {
      type: "jailbreak",
      severity: "high",
      confidence: "medium",
      platform: "ios",
      message: "Suspicious jailbreak filesystem path detected"
    }
  ]
}
```

Every result explains **what** happened, **why** it matters, **how severe** it
is, **how confident** the detection is, and **what action** to consider.

## Two pillars

1. **Runtime integrity** — identify rooted, jailbroken, emulated, debugged,
   hooked, or tampered device environments.
2. **AI input protection** — detect and redact secrets, PII, and
   prompt-injection attempts before user content leaves the device.

## Design principles

- **Risk-based.** Detection is probabilistic. SentinelRN helps you make better
  decisions; it never claims perfect protection.
- **Explainable.** No bare booleans. Severity, confidence, and a recommended
  action on every result.
- **AI is first-class.** Prompt protection lives inside the runtime.
- **Secure defaults.** The safest path is the easiest path.
- **React Native first.** TypeScript, hooks, providers, Expo, and bare RN.

## What it is not

SentinelRN is **not** an authentication framework, an MDM replacement, a backend
authorization layer, or an AI provider SDK. It is a client-side signal that
reduces risk — your server must still enforce trust. See the
[threat model](/reference/threat-model).

Next: [Getting Started](/guide/getting-started).
