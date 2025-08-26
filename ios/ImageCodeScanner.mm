#import <React/RCTBridgeModule.h>
// Don't import the header here to avoid duplicate interface definition

@interface RCT_EXTERN_MODULE(ImageCodeScanner, NSObject)

RCT_EXTERN_METHOD(scanFromPath:(NSString *)path
                  formats:(NSArray<NSString *> *)formats
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
