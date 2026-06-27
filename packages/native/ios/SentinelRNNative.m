#import <React/RCTBridgeModule.h>

// Exposes the Swift SentinelRNNative class and its methods to the React Native
// bridge (old architecture). New-architecture codegen can replace this.
@interface RCT_EXTERN_MODULE(SentinelRNNative, NSObject)

RCT_EXTERN_METHOD(getIntegritySnapshot:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
