/**
 * @sentinelrn/react — idiomatic React bindings for SentinelRN.
 *
 * Wrap your app in {@link SentinelProvider} and consume runtime trust through
 * hooks. This layer contains no security logic; it only consumes `SentinelRN`.
 */
export { SentinelContext } from "./context.js";
export { SentinelProvider, type SentinelProviderProps } from "./SentinelProvider.js";
export {
  useAISecurity,
  type UseAISecurityResult,
} from "./useAISecurity.js";
export {
  useDeviceIntegrity,
  type UseDeviceIntegrityOptions,
  type UseDeviceIntegrityResult,
} from "./useDeviceIntegrity.js";
export { useSentinel } from "./useSentinel.js";
export {
  useSentinelPolicy,
  type UseSentinelPolicyResult,
} from "./useSentinelPolicy.js";
