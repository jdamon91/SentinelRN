# Architecture

SentinelRN is a modular framework built around a single, framework-agnostic
engine. The security logic lives in one place; everything else either feeds it
signals or consumes its reports.

## Packages

| Package | Role |
| --- | --- |
| `@sentinelrn/core` | The engine — types, risk + threat engines, AI guard, redaction, policy. Pure TypeScript; no platform or React code. |
| `@sentinelrn/native` | Android (Kotlin) + iOS (Swift) integrity detectors behind a pluggable provider. |
| `@sentinelrn/react` | `SentinelProvider` and hooks. |

## Dependency rules

```
core    →  (no dependencies)
native  →  core      (implements IntegrityProvider)
react   →  core      (consumes the SentinelRN API)
```

- Nothing depends on React except `@sentinelrn/react`.
- `core` contains no platform-specific code. Detectors are injected at runtime.
- New capabilities (Play Integrity, App Attest, SSL pinning) plug in as
  additional providers without changing the public API.

## Data flow

```
provider → integrity → threat → risk → report → policy → app
```

1. A **provider** collects raw platform signals.
2. The **integrity** module orchestrates the check.
3. The **threat engine** normalizes raw signals into typed, explainable signals.
4. The **risk engine** scores the set → score, risk level, recommended action.
5. The result is a structured **report**.
6. The **policy engine** turns the report into an allow/block decision.

## Inside core

```
types/      shared vocabulary (severity, confidence, reports, findings, config)
risk/       severity + confidence  → score, level, recommended action
threat/     raw signals            → normalized signals → ThreatReport
ai/         secret/PII/injection detection, redaction, PromptGuard
policy/     reports                → decisions with reasons
integrity/  orchestration + IntegrityProvider interface
core/       config resolution + assembled SentinelRN facade
```

See [`docs/REPO_ARCHITECTURE.md`](https://github.com/jdamon91/SentinelRN/blob/main/docs/REPO_ARCHITECTURE.md)
for the full monorepo layout and tooling.
