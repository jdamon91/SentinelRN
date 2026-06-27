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

## Status

🚧 Early development. See [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) for the full vision, product pillars, and MVP scope.

## License

MIT
