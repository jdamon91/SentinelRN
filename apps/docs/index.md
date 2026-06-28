---
layout: home

hero:
  name: SentinelRN
  text: Application Trust Runtime for React Native
  tagline: Runtime integrity and AI security with structured, explainable threat reports — never bare booleans.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: What is SentinelRN?
      link: /guide/what-is-sentinelrn
    - theme: alt
      text: View on GitHub
      link: https://github.com/sentinelrn/sentinelrn

features:
  - icon: 🛡️
    title: Runtime Integrity
    details: Detect rooted, jailbroken, emulated, debugged, hooked, and tampered devices on Android and iOS.
    link: /guide/runtime-integrity
  - icon: 🤖
    title: AI Security
    details: Catch secrets, PII, and prompt-injection in AI-bound text before it leaves the device — with redaction.
    link: /guide/ai-security
  - icon: ⚖️
    title: Action-Aware Policies
    details: Turn risk into decisions. monitor / warn / block / strict modes, with explainable reasons.
    link: /guide/policies
  - icon: ⚛️
    title: React First
    details: A provider and hooks that feel native to React Native. TypeScript, Expo, and bare RN.
    link: /guide/react
  - icon: 🧩
    title: Explainable & Honest
    details: Every result tells you what, how severe, how confident, and what to do. No "unhackable" claims.
    link: /reference/threat-model
  - icon: 📦
    title: Modular & Tree-shakeable
    details: A pure-TypeScript core with pluggable native detectors. Use what you need.
    link: /reference/architecture
---

## Quick taste

```ts
import { SentinelRN } from "@sentinelrn/core";

// Runtime integrity → structured report
const report = await SentinelRN.integrity.check();
// { riskLevel: "high", score: 82, compromised: true,
//   recommendedAction: "block_sensitive_action", signals: [...] }

// AI prompt protection
const result = SentinelRN.ai.guardPrompt({ input: userText, policy: "strict" });
if (!result.allowed) return;
await sendToLLM(result.sanitizedInput ?? userText);
```
