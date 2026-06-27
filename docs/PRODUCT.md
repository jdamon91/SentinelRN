# SentinelRN Product Strategy

> **Version:** 0.1 Draft\
> **Document Owner:** Joshua Damon\
> **Status:** Living Product Strategy

---

# Mission

Build the **application trust runtime** for React Native.

SentinelRN helps production mobile applications continuously evaluate
runtime trust, assess AI input risk, and make explainable security
decisions before sensitive actions occur.

Unlike traditional security libraries that expose isolated checks,
SentinelRN provides a unified trust model that developers can build
policies around.

---

# Vision

Five years from now, we want React Native developers to say:

> "Before we protect payments, AI, authentication, or sensitive user
> data, we install SentinelRN."

The goal is not to become another utility package.

The goal is to become the **de facto security runtime** for production
React Native applications.

---

# The Problem

Today's React Native security ecosystem is fragmented.

Developers install one package for:

- Jailbreak detection
- Root detection
- Secure storage
- SSL pinning
- Biometrics
- AI prompt filtering
- PII detection

Each library answers a different question.

None answer the question applications actually care about:

> **Can I trust this environment enough to perform this action?**

---

# Product Thesis

Security decisions should be:

1.  Context-aware
2.  Explainable
3.  Risk-based
4.  Action-oriented

Applications do not need more booleans.

Applications need better decisions.

---

# Product Category

SentinelRN defines a new category:

## Application Trust Runtime (ATR)

Responsibilities:

- Evaluate runtime trust
- Aggregate security signals
- Produce trust reports
- Recommend actions
- Protect AI-bound input
- Normalize risk

Think of it as the security equivalent of React Query.

React Query manages server state.

SentinelRN manages runtime trust.

---

# Target Users

Primary:

- Senior React Native Engineers
- Mobile Tech Leads
- Staff Engineers
- Platform Engineers

Secondary:

- FinTech
- Healthcare
- AI product teams
- Enterprise mobility teams
- Startups building AI features

---

# Jobs To Be Done

Developers want to answer questions like:

- Can I safely submit this payment?
- Can I trust this device?
- Should I allow token storage?
- Is this AI prompt safe?
- Should I warn the user?
- Should I block this action?

SentinelRN exists to answer those questions.

---

# Product Principles

## 1. Explain Everything

Never return:

```ts
true;
```

Return:

- What happened
- Why it matters
- Confidence
- Severity
- Recommended action

---

## 2. Security Without Fear

Avoid scare tactics.

Never claim:

- "Unhackable"
- "Military grade"
- "Guaranteed"

Always communicate uncertainty honestly.

---

## 3. AI Is First-Class

AI security is no longer optional.

Every mobile application will increasingly interact with LLMs.

Prompt protection belongs inside the runtime.

---

## 4. Secure Defaults

Developers should be guided toward safer implementations with minimal
configuration.

---

## 5. Great Developer Experience

Every API should feel like modern React Native.

Simple first.

Powerful when needed.

---

# Core Concepts

## Runtime Trust

Represents the application's confidence in the current execution
environment.

Sources include:

- Device integrity
- Runtime instrumentation
- AI findings
- Future network integrity
- Future backend attestations

---

## Trust Score

Every evaluation returns:

- Score
- Level
- Signals
- Recommendations
- Action decisions

Example:

```ts
const trust = await SentinelRN.runtime.evaluate();
```

Applications should rarely inspect individual detectors.

They should inspect trust.

---

## Action-Aware Security

Instead of:

```ts
if (isRooted) ...
```

Applications ask:

```ts
trust.canPerform("update_payment_method");
trust.canPerform("send_ai_prompt");
trust.canPerform("change_password");
```

This is the defining product concept.

---

# Competitive Landscape

Current tools generally solve isolated problems:

- Jailbreak/root detection
- Secure storage
- SSL pinning
- Biometrics

SentinelRN combines:

- Runtime integrity
- Structured risk scoring
- AI prompt protection
- Action-aware policies
- Explainable reporting

This combination is the differentiation.

---

# MVP

Phase 1

- Trust model
- Threat model
- Risk scoring
- AI guard
- Secret detection
- Prompt injection heuristics
- Policy engine

Phase 2

- Android integrity
- iOS integrity
- React hooks
- Example app

Phase 3

- Frida detection
- Play Integrity
- App Attest
- DeviceCheck

---

# Success Metrics

Technical:

- Stable public API

- 90% unit test coverage

- Excellent documentation

- Fast startup

- Low runtime overhead

Community:

- GitHub stars
- Contributors
- npm downloads
- Developer feedback
- Conference talks
- Blog references

---

# What We Will Not Build

- Authentication framework
- MDM replacement
- Full pentesting toolkit
- Backend authorization
- AI provider SDK

Those problems belong elsewhere.

---

# Long-Term Vision

SentinelRN should evolve into a trusted foundation that powers
production React Native applications handling:

- AI
- Payments
- Healthcare
- Identity
- Financial data
- Enterprise workflows

When developers think:

> "I need to trust my mobile runtime."

The first library they think of should be SentinelRN.

---

# Product North Star

Every feature must answer at least one question:

- Does this improve runtime trust?
- Does this reduce AI security risk?
- Does this produce better security decisions?
- Does this improve developer confidence?

If the answer is no, it should not become part of SentinelRN.
