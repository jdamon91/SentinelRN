# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in SentinelRN, please report it
privately. **Do not open a public GitHub issue.**

- Use [GitHub Security Advisories](https://github.com/sentinelrn/sentinelrn/security/advisories/new)
  ("Report a vulnerability"), or
- email the maintainers (see the repository's organization profile).

Please include a description, affected version(s), reproduction steps, and the
potential impact. We aim to acknowledge reports within a few business days and
will keep you updated on remediation.

## Supported versions

SentinelRN is pre-1.0. Security fixes target the latest published `0.x` release.

| Version | Supported |
| --- | --- |
| 0.1.x | ✅ |
| < 0.1 | ❌ |

## Scope and expectations

SentinelRN is a **risk-based** framework. It reduces risk and increases attacker
cost; it does not provide guarantees. Please keep in mind:

- Root, jailbreak, and hooking detection can be bypassed by determined attackers.
- Prompt-injection and PII/secret detection are heuristic — false positives and
  false negatives are expected.
- SentinelRN is a **client-side** signal. It must never be your only security
  boundary. See the [threat model](docs/THREAT_MODEL.md) and "Backend Still
  Matters."

Reports demonstrating practical bypasses, detection gaps, or weaknesses that
materially mislead applications are in scope and very welcome.
