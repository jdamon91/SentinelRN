# Roadmap

SentinelRN follows a phased plan. Every feature must map back to a documented
threat.

## Phase 1 — Trust core ✅ (0.1)

Risk engine, threat engine, AI guard (secrets, PII, prompt injection), redaction,
policy engine, and the cohesive `SentinelRN` API.

## Phase 2 — Platform & React ✅ (initial)

Android + iOS integrity detectors, pluggable provider with graceful fallback,
React hooks + provider, new-architecture TurboModule codegen spec, and an example
app. Ongoing: broader detector coverage and this documentation site.

## Phase 3 — Attestation & advanced detection

- Frida / runtime-hooking hardening
- App signature / tampering validation
- Play Integrity API
- Apple App Attest + DeviceCheck
- SSL pinning helpers
- Secure logging helpers

## Phase 4 — Ecosystem

- Remote risk telemetry (opt-in)
- OWASP MASVS mappings
- Expo config plugin
- Enterprise policy packs

The authoritative roadmap lives in
[`ROADMAP.md`](https://github.com/sentinelrn/sentinelrn/blob/main/ROADMAP.md).
