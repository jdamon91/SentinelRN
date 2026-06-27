/**
 * @sentinelrn/react — idiomatic React bindings for SentinelRN.
 *
 * Wrap your app in {@link SentinelProvider} and consume runtime trust through
 * hooks. This layer contains no security logic; it only consumes `SentinelRN`.
 */
export { SentinelContext } from "./context.js";
export { SentinelProvider, type SentinelProviderProps } from "./SentinelProvider.js";
export {
  type UseAISecurityResult,
  useAISecurity,
} from "./useAISecurity.js";
export {
  type UseDeviceIntegrityOptions,
  type UseDeviceIntegrityResult,
  useDeviceIntegrity,
} from "./useDeviceIntegrity.js";
export { useSentinel } from "./useSentinel.js";
export {
  type UseSentinelPolicyResult,
  useSentinelPolicy,
} from "./useSentinelPolicy.js";
