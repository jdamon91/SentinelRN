# SentinelRN

**Runtime Integrity and AI Security for React Native Apps**

SentinelRN is an open-source React Native security SDK focused on two high-risk areas of modern mobile development:

1. **Runtime integrity detection** — identify rooted, jailbroken, emulated, hooked, or tampered device environments.
2. **AI input protection** — detect and redact secrets, PII, and prompt-injection attempts before user content leaves the device.

Rather than returning bare booleans, SentinelRN produces **structured, explainable threat reports** that tell you what was detected, how severe it is, how confident the detection is, and what action your app should take.

```ts
const report = await SentinelRN.integrity.check();
// {
//   riskLevel: "high",
//   score: 82,
//   compromised: true,
//   recommendedAction: "block_sensitive_action",
//   signals: [ ... ]
// }
```

## Install

```bash
pnpm add @sentinelrn/core @sentinelrn/native @sentinelrn/react
```

## Quick start

```tsx
import { SentinelRN } from "@sentinelrn/core";
import { registerSentinelNative } from "@sentinelrn/native";
import { SentinelProvider, useDeviceIntegrity, useAISecurity } from "@sentinelrn/react";

registerSentinelNative();                 // wire up native integrity detectors
SentinelRN.configure({ policy: "warn" }); // secure defaults otherwise

function Checkout() {
  const { report, compromised } = useDeviceIntegrity();
  const { guardPrompt } = useAISecurity();

  const ask = (input: string) => {
    const result = guardPrompt({ input, policy: "strict" });
    if (!result.allowed) return;          // blocked: secrets/PII/injection
    sendToLLM(result.sanitizedInput ?? input);
  };
  // …
}
```

## Packages

| Package | Description |
| --- | --- |
| [`@sentinelrn/core`](packages/core) | The engine: types, risk + threat engines, AI guard, redaction, policy. Pure TypeScript. |
| [`@sentinelrn/native`](packages/native) | Android (Kotlin) + iOS (Swift) runtime-integrity detectors. |
| [`@sentinelrn/react`](packages/react) | `SentinelProvider` and hooks. |
| [`apps/example`](apps/example) | Expo demo of the full MVP. |

## Documentation

- [Product strategy](docs/PRODUCT.md) · [Project brief](docs/PROJECT_BRIEF.md)
- [Architecture](docs/ARCHITECTURE.md) · [Repo architecture](docs/REPO_ARCHITECTURE.md)
- [API design](docs/API_DESIGN.md) · [Threat model](docs/THREAT_MODEL.md)
- [Roadmap](ROADMAP.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## Status

🚧 Early development (0.1). The trust core, native detectors, React bindings, and
example app are in place. See the [roadmap](ROADMAP.md) for what's next.

SentinelRN is **risk-based**: detection is probabilistic and explainable, never a
guarantee. Always enforce trust on the server too.

## License

MIT
