# Policies

Detection is only useful if your app knows what to do with it. The policy engine
turns reports into **decisions** — `allowed` or not, with explainable reasons.
SentinelRN recommends; policy decides; your app enforces.

## Policy modes

```ts
SentinelRN.configure({ policy: "monitor" }); // log only
SentinelRN.configure({ policy: "warn" });    // surface advice, never block
SentinelRN.configure({ policy: "block" });   // block high-risk actions
```

Or configure fine-grained behavior:

```ts
SentinelRN.configure({
  policy: {
    mode: "warn",
    blockOnHighRiskDevice: false,
    redactSensitiveInput: true,
    blockPromptInjection: true,
    allowInSimulator: true,
  },
});
```

## Evaluating an integrity report

```ts
const report = await SentinelRN.integrity.check();
const decision = SentinelRN.policy.evaluateIntegrity(report, "block");

if (!decision.allowed) {
  console.log(decision.reasons);
  // [ "Risk level: high (score 82).",
  //   "Detected signals: jailbreak, hooking.",
  //   "Blocked by policy (mode: block)." ]
}
```

```ts
type PolicyDecision = {
  allowed: boolean;
  mode: "monitor" | "warn" | "block";
  recommendedAction: RecommendedAction;
  reasons: string[];
};
```

## Evaluating an AI result

```ts
const result = SentinelRN.ai.guardPrompt({ input });
const decision = SentinelRN.policy.evaluateAI(result, "block");
```

## Action-aware security

The product north star is asking about **actions**, not raw flags. Rather than:

```ts
if (isRooted) { /* ??? */ }
```

evaluate the report against the policy for the action at hand — `block` for a
payment, `warn` for a profile view — and let the decision (with its reasons)
drive your UX.

## Simulator exemption

During development you usually don't want simulator/emulator signals to block
you. With `allowInSimulator: true` (the default), those signals are ignored when
making the decision, and the reason is recorded:

```
"Simulator/emulator signals ignored by policy (allowInSimulator)."
```

Turn it off for production builds that should treat emulation as risk.
