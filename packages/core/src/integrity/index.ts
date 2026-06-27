import { buildThreatReport } from "../threat/index.js";
import type { IntegrityConfig, RawSignal, ThreatReport } from "../types/index.js";

/**
 * Integrity orchestration.
 *
 * Core owns the *orchestration* of runtime-integrity checks but contains no
 * platform-specific logic. Platform detectors are supplied as
 * {@link IntegrityProvider}s (e.g. by `@sentinelrn/native`) and registered at
 * runtime. `check()` collects raw signals from the active provider and hands
 * them to the threat engine to produce a structured report.
 *
 * If no provider is registered, or a provider throws, `check()` degrades
 * gracefully to an empty (clean) report rather than crashing the host app —
 * detection gaps must never take down the application.
 */

/**
 * A source of runtime-integrity signals for a given platform. Implementations
 * live outside core (native modules, test doubles) and are registered via
 * {@link IntegrityModule.registerProvider}.
 */
export interface IntegrityProvider {
  /** Human-readable provider name, for diagnostics. */
  readonly name: string;
  /** Collect raw integrity observations for the current environment. */
  collectSignals(): Promise<RawSignal[]> | RawSignal[];
}

/** Public surface of the integrity module. */
export interface IntegrityModule {
  /** Run a runtime-integrity check and return a structured report. */
  check(): Promise<ThreatReport>;
  /** Register (or replace) the active platform provider. */
  registerProvider(provider: IntegrityProvider): void;
  /** The currently-registered provider, if any. */
  getProvider(): IntegrityProvider | undefined;
}

/** Dependencies the integrity module reads at call time. */
export interface IntegrityDeps {
  /** Returns the current integrity config (so config changes take effect live). */
  getConfig: () => IntegrityConfig;
}

/** Create an integrity module bound to a config source. */
export function createIntegrityModule(deps: IntegrityDeps): IntegrityModule {
  let provider: IntegrityProvider | undefined;

  return {
    registerProvider(next: IntegrityProvider) {
      provider = next;
    },
    getProvider() {
      return provider;
    },
    async check(): Promise<ThreatReport> {
      const { includeEvidence = false } = deps.getConfig();
      let raws: RawSignal[] = [];
      if (provider) {
        try {
          raws = await provider.collectSignals();
        } catch {
          // Fail open: a detector error becomes a detection gap, not a crash.
          raws = [];
        }
      }
      return buildThreatReport(raws, { includeEvidence });
    },
  };
}
