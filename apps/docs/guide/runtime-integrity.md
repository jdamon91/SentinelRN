# Runtime Integrity

Runtime integrity answers: *is this device environment trustworthy enough?*
SentinelRN collects platform signals, normalizes them, scores the risk, and
returns a structured `ThreatReport`.

## Running a check

```ts
import { SentinelRN } from "@sentinelrn/core";

const report = await SentinelRN.integrity.check();
```

```ts
type ThreatReport = {
  riskLevel: "low" | "medium" | "high" | "critical";
  score: number;            // 0–100
  compromised: boolean;
  signals: ThreatSignal[];
  recommendedAction: RecommendedAction;
  checkedAt: string;        // ISO-8601
};
```

## Signals

Each signal is explainable on its own:

```ts
type ThreatSignal = {
  id: string;
  type: "root" | "jailbreak" | "emulator" | "simulator" | "debugger"
      | "developer_mode" | "mock_location" | "hooking" | "tampering" | "unknown";
  platform: "ios" | "android" | "unknown";
  severity: "low" | "medium" | "high" | "critical";
  confidence: "low" | "medium" | "high";
  message: string;
  evidence?: Record<string, unknown>; // only when includeEvidence is enabled
};
```

## What's detected

| Platform | Signals |
| --- | --- |
| **Android** | root (su binaries, root/cloaking packages, busybox, test-keys, writable system paths, `ro.debuggable`), emulator, debugger, developer mode, mock location, hooking (Frida/Xposed/Substrate, Frida port), tampering (debuggable app, sideloaded installer) |
| **iOS** | jailbreak (filesystem paths, sandbox-escape write, suspicious symlinks, Cydia/Sileo/Zebra schemes), simulator, debugger (`P_TRACED`), hooking (`DYLD_INSERT_LIBRARIES`, suspicious dyld images) |

## How scoring works

Signals are combined with a probabilistic "noisy-or": more signals push the score
up, but it saturates toward 100. Severity sets the base weight; confidence
discounts it. The aggregate maps to a risk level and a recommended action:

| Score | Risk level | Recommended action |
| --- | --- | --- |
| 0–19 | low | `allow` (or `monitor` if any signals) |
| 20–49 | medium | `warn_user` |
| 50–84 | high | `block_sensitive_action` |
| 85–100 | critical | `block_session` |

## Bring your own provider

`@sentinelrn/native` is one implementation of the `IntegrityProvider` interface.
You can register your own — for tests, custom detectors, or future attestation
sources like Play Integrity or App Attest:

```ts
SentinelRN.registerIntegrityProvider({
  name: "my-provider",
  collectSignals: () => [{ type: "jailbreak", platform: "ios", confidence: "high" }],
});
```

If no provider is registered (or one throws), `check()` returns a clean report
and never crashes the app — a detection gap, not a failure.

## Limitations

Root and jailbreak detection are an arms race. SentinelRN raises attacker cost
but cannot guarantee detection. Never treat a "clean" report as proof of safety.
See the [threat model](/reference/threat-model).
