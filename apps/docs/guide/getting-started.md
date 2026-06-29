# Getting Started

## Install

::: code-group

```bash [pnpm]
pnpm add @sentinelrn/core @sentinelrn/native @sentinelrn/react
```

```bash [npm]
npm install @sentinelrn/core @sentinelrn/native @sentinelrn/react
```

```bash [yarn]
yarn add @sentinelrn/core @sentinelrn/native @sentinelrn/react
```

:::

For bare React Native, install iOS pods:

```bash
cd ios && pod install
```

You only need the packages you use:

| Package | When you need it |
| --- | --- |
| `@sentinelrn/core` | Always — the engine, AI guard, redaction, policy. |
| `@sentinelrn/native` | For on-device root/jailbreak/hooking detection. |
| `@sentinelrn/react` | For the provider and hooks. |

## Wire it up

Register the native detectors once at startup, then configure a default policy:

```ts
import { SentinelRN } from "@sentinelrn/core";
import { registerSentinelNative } from "@sentinelrn/native";

registerSentinelNative();
SentinelRN.configure({ policy: "warn" }); // optional — secure defaults apply
```

## Check device integrity

```ts
const report = await SentinelRN.integrity.check();

if (report.compromised) {
  console.warn(`Risk ${report.riskLevel} (${report.score}/100)`);
}

const decision = SentinelRN.policy.evaluateIntegrity(report, "block");
if (!decision.allowed) {
  throw new Error(`Blocked: ${decision.reasons.join(" ")}`);
}
```

## Guard an AI prompt

```ts
const result = SentinelRN.ai.guardPrompt({ input: userText, policy: "strict" });

if (!result.allowed) {
  // Contains secrets, PII, or an injection attempt.
  return;
}

await sendToLLM(result.sanitizedInput ?? userText);
```

## With React

```tsx
import { SentinelProvider, useDeviceIntegrity, useAISecurity } from "@sentinelrn/react";

function App() {
  return (
    <SentinelProvider config={{ policy: "warn" }}>
      <Checkout />
    </SentinelProvider>
  );
}

function Checkout() {
  const { compromised, riskLevel } = useDeviceIntegrity();
  const { guardPrompt } = useAISecurity();
  // …
}
```

## Try the example app

```bash
git clone https://github.com/jdamon91/SentinelRN.git
cd SentinelRN
pnpm install
pnpm --filter @sentinelrn/example start
```

Next, dive into [Runtime Integrity](/guide/runtime-integrity).
