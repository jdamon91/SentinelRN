# React Integration

`@sentinelrn/react` provides an idiomatic provider and hooks. This layer contains
**no security logic** — it only consumes `@sentinelrn/core`.

## Provider

Wrap your app once. The provider defaults to the shared `SentinelRN` singleton,
so native registration done elsewhere takes effect.

```tsx
import { SentinelProvider } from "@sentinelrn/react";

export default function App() {
  return (
    <SentinelProvider config={{ policy: "warn" }}>
      <RootNavigator />
    </SentinelProvider>
  );
}
```

Hooks also work **without** a provider — they fall back to the singleton.

## `useDeviceIntegrity`

Runs a check on mount (unless disabled) and exposes a manual `refresh`.

```tsx
function Banner() {
  const { report, loading, error, refresh, compromised, riskLevel } = useDeviceIntegrity();

  if (loading) return <Spinner />;
  if (compromised) return <Warning level={riskLevel} onRecheck={refresh} />;
  return null;
}
```

Disable the automatic check with `useDeviceIntegrity({ auto: false })`.

## `useAISecurity`

```tsx
function PromptBox() {
  const { guardPrompt, redact, findings } = useAISecurity();

  const onSubmit = (text: string) => {
    const result = guardPrompt({ input: text, policy: "strict" });
    if (!result.allowed) {
      showWarning(findings);
      return;
    }
    send(result.sanitizedInput ?? text);
  };
}
```

## `useSentinelPolicy`

```tsx
const { evaluateIntegrity, evaluateAI } = useSentinelPolicy();
const decision = evaluateIntegrity(report, "block");
```

## `useSentinel`

Access the active instance directly when you need the full API:

```tsx
const sentinel = useSentinel();
const report = await sentinel.integrity.check();
```

## Hook reference

| Hook | Returns |
| --- | --- |
| `useDeviceIntegrity(opts?)` | `{ report, loading, error, refresh, compromised, riskLevel }` |
| `useAISecurity()` | `{ guardPrompt, redact, inspectAndRedact, findings }` |
| `useSentinelPolicy()` | `{ evaluateIntegrity, evaluateAI }` |
| `useSentinel()` | The active `Sentinel` instance. |
