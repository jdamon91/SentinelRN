# @sentinelrn/react

Idiomatic React bindings for [SentinelRN](https://github.com/sentinelrn/sentinelrn). This layer contains **no security logic** — it only consumes `@sentinelrn/core`.

## Install

```bash
pnpm add @sentinelrn/core @sentinelrn/react
```

## Usage

```tsx
import { SentinelProvider, useDeviceIntegrity, useAISecurity } from "@sentinelrn/react";

function App() {
  return (
    <SentinelProvider config={{ policy: "warn" }}>
      <Screen />
    </SentinelProvider>
  );
}

function Screen() {
  const { report, loading, compromised, refresh } = useDeviceIntegrity();
  const { guardPrompt, findings } = useAISecurity();
  // …
}
```

## Hooks

| Hook | Returns |
| --- | --- |
| `useDeviceIntegrity(opts?)` | `{ report, loading, error, refresh, compromised, riskLevel }` |
| `useAISecurity()` | `{ guardPrompt, redact, inspectAndRedact, findings }` |
| `useSentinelPolicy()` | `{ evaluateIntegrity, evaluateAI }` |
| `useSentinel()` | The active `Sentinel` instance (falls back to the singleton). |

`SentinelProvider` defaults to the shared `SentinelRN` singleton, so native provider registration done elsewhere (`registerSentinelNative()`) takes effect. Hooks also work without a provider.

MIT © SentinelRN
