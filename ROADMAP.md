# Roadmap

SentinelRN follows the phased plan from the [product strategy](docs/PRODUCT.md).
Every feature must map back to a documented threat in the
[threat model](docs/THREAT_MODEL.md).

## Phase 1 — Trust core ✅

The framework-agnostic engine. **Shipped in 0.1.**

- [x] Shared trust/threat types
- [x] Risk engine (scoring, levels, recommended actions)
- [x] Threat engine (signal normalization, structured reports)
- [x] AI guard — secret, credential, JWT, PII, and prompt-injection detection
- [x] Redaction utilities
- [x] Policy engine (`monitor` / `warn` / `block`, plus `strict` for AI)
- [x] Cohesive `SentinelRN` public API

## Phase 2 — Platform & React ✅ (initial)

- [x] Android integrity detectors (root, emulator, debugger, dev mode, mock location, hooking)
- [x] iOS integrity detectors (jailbreak, simulator, debugger)
- [x] Pluggable `IntegrityProvider` + graceful JS fallback
- [x] React hooks + `SentinelProvider`
- [x] Example app
- [ ] New-architecture TurboModule codegen spec
- [ ] Expand detector coverage + hardening
- [ ] Documentation site (`apps/docs`)

## Phase 3 — Attestation & advanced detection

- [ ] Frida / runtime-hooking detection hardening
- [ ] App signature / tampering validation
- [ ] Play Integrity API integration
- [ ] Apple App Attest + DeviceCheck
- [ ] SSL pinning helpers
- [ ] Secure logging helpers

## Phase 4 — Ecosystem

- [ ] Remote risk telemetry (opt-in)
- [ ] OWASP MASVS mappings
- [ ] Expo config plugin
- [ ] Enterprise policy packs

## Quality bars

- Stable public API (semver after 1.0)
- ≥ 90% unit-test coverage on `@sentinelrn/core`
- Fast startup, low runtime overhead
- Excellent, honest documentation — no "unhackable" claims

See [CONTRIBUTING.md](CONTRIBUTING.md) to get involved.
