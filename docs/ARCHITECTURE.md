# SentinelRN Architecture

## Overview

SentinelRN is a modular React Native security framework focused on runtime integrity and AI security.

The project is intentionally designed as a collection of focused modules built around a shared security engine.

Every module should be independently testable while exposing a consistent developer experience through a single public API.

---

# High Level Architecture

                    React Native App
                           │
                           │
                 SentinelProvider
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
      Integrity      AI Security     Policy Engine
             │             │             │
             └──────┬──────┴──────┬──────┘
                    │             │
                    ▼             ▼
              Threat Engine   Risk Scoring
                    │
                    ▼
            Recommended Actions

---

# Design Goals

SentinelRN should be:

- Modular
- Type-safe
- Tree-shakeable
- Platform-aware
- Framework agnostic where possible
- React Native first
- Expo compatible
- Easy to extend
- Easy to test

---

# Public API

Everything exposed publicly should come through:

```ts
import { SentinelRN } from "@sentinelrn/core";
```

Developers should rarely import individual modules.

The package should feel cohesive.

---

# Core Modules

## Core

Responsibilities:

- configuration
- initialization
- dependency injection
- plugin registration
- shared interfaces

Nothing in Core should contain platform-specific logic.

---

## Integrity

Responsibilities:

- collect runtime signals
- normalize signals
- invoke platform detectors
- produce integrity reports

Owns:

- Android detectors
- iOS detectors
- emulator detection
- debugger detection
- developer mode detection

Does NOT:

- decide application behavior

---

## AI Security

Responsibilities:

- prompt inspection
- prompt sanitization
- sensitive data detection
- prompt injection heuristics
- redaction

Owns:

- PromptGuard
- SecretDetector
- PIIDetector
- InjectionDetector

Does NOT:

- communicate with LLM providers

The SDK protects prompts.

It does not become an AI SDK.

---

## Threat Engine

Responsibilities:

Convert raw signals into normalized threats.

Example:

Filesystem path

↓

Runtime signal

↓

Threat

↓

Risk Score

↓

Recommendation

Every module feeds data into the Threat Engine.

---

## Risk Engine

Responsibilities:

Assign:

- severity
- confidence
- score
- recommendation

Example:

Debugger attached

↓

Severity:
Medium

↓

Confidence:
High

↓

Recommended Action:
Warn

---

## Policy Engine

Responsibilities:

Convert threat reports into application decisions.

Example:

```ts
policy: "monitor";
```

↓

Log only

---

```ts
policy: "warn";
```

↓

Notify application

---

```ts
policy: "block";
```

↓

Prevent sensitive operation

---

Policy Engine should never collect runtime information.

It only evaluates reports.

---

## React Layer

Responsibilities:

Expose idiomatic React APIs.

Examples:

```tsx
useDeviceIntegrity();
```

```tsx
useAISecurity();
```

```tsx
useThreatReport();
```

```tsx
<SentinelProvider>
```

React Layer contains zero security logic.

It only consumes the SDK.

---

# Internal Flow

Application

↓

SentinelRN.check()

↓

Integrity Module

↓

AI Module

↓

Threat Engine

↓

Risk Engine

↓

Policy Engine

↓

Structured Report

↓

Application

---

# Folder Structure

packages/

core/

src/

core/

integrity/

ai/

threat/

risk/

policy/

react/

types/

utils/

ios/

android/

example/

---

# Dependency Rules

Core

↓

Everything

Integrity

↓

Threat Engine

↓

Risk Engine

↓

Policy Engine

AI

↓

Threat Engine

↓

Risk Engine

↓

Policy Engine

React

↓

Everything

No module should depend on React except the React layer.

---

# Security Philosophy

SentinelRN should never claim certainty.

Instead:

Collect signals

↓

Analyze

↓

Score

↓

Recommend

↓

Let applications choose policy.

---

# Future Extension Points

Future modules should plug into the Threat Engine.

Examples:

- Play Integrity
- DeviceCheck
- App Attest
- SSL Pinning
- Certificate Validation
- Runtime Telemetry
- Enterprise Policy Packs

The architecture should remain stable even as new modules are introduced.

---

# Guiding Principle

Every API should answer one question:

"If I were building a banking or healthcare app today, would this make my application safer without making development harder?"

If the answer is no, it does not belong in SentinelRN.
