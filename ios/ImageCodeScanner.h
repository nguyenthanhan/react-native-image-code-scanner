#ifdef RCT_NEW_ARCH_ENABLED
#import <ImageCodeScannerSpec/ImageCodeScannerSpec.h>

@interface ImageCodeScanner : NSObject <NativeImageCodeScannerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ImageCodeScanner : NSObject <RCTBridgeModule>
#endif

@end
