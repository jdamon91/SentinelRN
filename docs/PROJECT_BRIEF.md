# SentinelRN

## Runtime Integrity and AI Security for React Native Apps

SentinelRN is an open-source React Native security SDK focused on two high-risk areas of modern mobile development:

1. Runtime integrity detection
2. AI input protection

The goal is to help React Native teams identify compromised or suspicious device environments, protect sensitive user input before it leaves the app, and make safer decisions around AI-powered mobile workflows.

---

# Problem

Modern React Native applications increasingly handle sensitive workflows including:

- Authentication
- Payments
- Healthcare data
- Personal user content
- AI prompts
- Uploaded files
- Location
- Identity
- Private messaging

At the same time, these applications execute on devices that may be:

- Rooted
- Jailbroken
- Running inside emulators
- Attached to a debugger
- Instrumented by runtime hooking frameworks
- Running with mock locations
- Tampered with
- Leaking sensitive information into AI systems

Most existing React Native security libraries solve only a single piece of this problem.

Many simply return values such as:

```ts
const rooted = await isRooted();
```

or

```ts
{
  isJailbroken: true;
}
```

While useful, this isn't enough for production decision making.

SentinelRN should answer:

- What was detected?
- How severe is it?
- How confident are we?
- What action should the application take?

---

# Vision

Build the most practical runtime integrity and AI security framework for React Native.

SentinelRN should feel like a production-ready security layer that teams confidently ship into healthcare, fintech, AI, education, and enterprise mobile applications.

---

# Product Pillars

## Runtime Integrity

Detect suspicious runtime environments including:

- Rooted Android devices
- Jailbroken iOS devices
- Emulators
- Simulators
- Debugger attachment
- Developer mode
- Mock location
- Runtime hooking
- Suspicious binaries
- Suspicious filesystem paths
- Application tampering indicators

---

## Structured Threat Reports

Instead of returning booleans, return structured reports.

Example:

```ts
const report = await SentinelRN.integrity.check();
```

```ts
{
  riskLevel: "high",
  score: 82,
  compromised: true,
  recommendedAction: "block_sensitive_action",
  signals: [
    {
      type: "jailbreak",
      severity: "high",
      confidence: "medium",
      platform: "ios",
      message: "Suspicious jailbreak filesystem path detected"
    }
  ]
}
```

---

## AI Security

Modern mobile applications increasingly send user-generated content directly to AI providers.

Before prompts leave the device, SentinelRN should help identify:

- API keys
- JWTs
- Passwords
- Emails
- Phone numbers
- SSNs
- Credit cards
- PII
- Sensitive health information
- Prompt injection attempts
- Jailbreak prompts
- Instruction override attempts

Example:

```ts
const result = await SentinelRN.ai.guardPrompt({
  input: prompt,
  policy: "strict",
});

if (!result.allowed) {
  // Prevent request
}
```

---

## Policy Engine

Applications should define security policies instead of manually inspecting every result.

Examples:

```ts
policy: "monitor";
```

```ts
policy: "warn";
```

```ts
policy: "block";
```

Or:

```ts
policy: {
  blockOnHighRiskDevice: true,
  redactSensitiveInput: true,
  blockPromptInjection: true,
  allowInSimulator: false
}
```

---

# Target Audience

SentinelRN is built for:

- React Native engineers
- Mobile Technical Leads
- Staff Mobile Engineers
- Mobile Security Engineers
- Teams building AI-powered mobile apps
- Healthcare applications
- Fintech applications
- Enterprise applications
- Consumer applications handling sensitive data

---

# Design Principles

## Risk-Based Security

SentinelRN should never claim perfect protection.

Root detection, jailbreak detection, runtime integrity, and prompt protection are all probabilistic.

The framework exists to help developers make better decisions, not guarantee security.

---

## Explainable Security

Every result should explain:

- What happened
- Why it matters
- How severe it is
- Recommended action

---

## AI Security is First-Class

AI introduces entirely new attack surfaces.

Prompt protection should be treated as a core feature, not an optional add-on.

---

## React Native First

The framework should feel native to React Native developers.

Support:

- TypeScript
- React Hooks
- Providers
- Expo
- Bare React Native

---

## Secure Defaults

The safest implementation should also be the easiest implementation.

Developers should naturally end up following better security practices.

---

# MVP

## TypeScript Core

- Shared types
- Risk scoring
- Signal normalization
- Policy engine
- Recommended actions

---

## AI Security

- Secret detection
- Sensitive data detection
- Prompt injection heuristics
- Redaction
- Prompt Guard

---

## Runtime Integrity

- Public API
- Platform abstraction
- Native interfaces
- Initial Android implementation
- Initial iOS implementation

---

## React API

- SentinelProvider
- useDeviceIntegrity()
- useAISecurity()
- usePolicy()

---

## Example App

Demonstrate:

- Device integrity report
- Threat score
- Signal explanations
- Prompt Guard
- Redaction
- Policy modes

---

# Non Goals

SentinelRN is not intended to:

- Guarantee root detection
- Guarantee jailbreak detection
- Replace backend security
- Replace MDM
- Replace authentication
- Replace penetration testing
- Store secrets directly
- Make unsafe AI systems secure

---

# Success Criteria

A developer should be able to:

- Install SentinelRN
- Check device integrity
- Receive a structured threat report
- Detect sensitive AI prompts
- Redact sensitive information
- Choose a policy mode
- Understand why a security decision was made

within a few minutes.

---

# Long-Term Roadmap

Future releases may include:

- Advanced Android root detection
- Advanced iOS jailbreak detection
- Frida detection
- Runtime hooking detection
- Play Integrity API integration
- Apple App Attest
- DeviceCheck
- SSL pinning helpers
- Secure analytics
- Risk telemetry
- OWASP MASVS mappings
- Expo config plugin
- Enterprise policy packs

---

# Positioning

SentinelRN is positioned as:

> Runtime Integrity and AI Security for React Native Apps.

Not:

- A generic mobile security toolkit
- A collection of utility functions
- A jailbreak detection library

The goal is to become the security framework React Native teams reach for when building production applications that handle sensitive user data and AI-powered experiences.
