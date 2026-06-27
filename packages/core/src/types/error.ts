/** Module a {@link SentinelError} originated from. */
export type SentinelErrorModule = "integrity" | "ai" | "policy" | "redaction" | "native" | "core";

/**
 * Structured error shape. SentinelRN should never crash the host app because a
 * detector failed; instead it surfaces structured, inspectable errors and
 * degrades gracefully (e.g. an integrity check returns `unknown` signals).
 */
export interface SentinelErrorShape {
  code: string;
  module: SentinelErrorModule;
  message: string;
  cause?: unknown;
}

/** Concrete `Error` subclass carrying the structured {@link SentinelErrorShape}. */
export class SentinelError extends Error implements SentinelErrorShape {
  readonly code: string;
  readonly module: SentinelErrorModule;
  readonly cause?: unknown;

  constructor(shape: SentinelErrorShape) {
    super(shape.message);
    this.name = "SentinelError";
    this.code = shape.code;
    this.module = shape.module;
    this.cause = shape.cause;
  }

  /** Serialize to the plain structured shape (safe for logging/telemetry). */
  toJSON(): SentinelErrorShape {
    return { code: this.code, module: this.module, message: this.message, cause: this.cause };
  }
}
