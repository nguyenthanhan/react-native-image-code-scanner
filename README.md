# React Native Image Code Scanner

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-image-code-scanner">
    <img src="https://img.shields.io/npm/v/react-native-image-code-scanner.svg" alt="npm version">
  </a>
  <a href="https://github.com/nguyenthanhan/react-native-image-code-scanner/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/react-native-image-code-scanner.svg" alt="license">
  </a>
  <a href="https://www.npmjs.com/package/react-native-image-code-scanner">
    <img src="https://img.shields.io/npm/dm/react-native-image-code-scanner.svg" alt="downloads">
  </a>
  <a href="https://github.com/nguyenthanhan/react-native-image-code-scanner/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/nguyenthanhan/react-native-image-code-scanner/ci.yml?branch=main" alt="CI Status">
  </a>
  <a href="https://github.com/nguyenthanhan/react-native-image-code-scanner/issues">
    <img src="https://img.shields.io/github/issues/nguyenthanhan/react-native-image-code-scanner" alt="Issues">
  </a>
</p>

A lightweight, high-performance React Native library for scanning QR codes and barcodes from images with advanced preprocessing options. Built with native performance in mind using iOS Vision Framework and Android ML Kit.

## ✨ Features

- **🚀 High Performance**: Native implementation using iOS Vision Framework and Google ML Kit
- **📱 Cross-Platform**: Support for both iOS and Android
- **🎯 Multiple Formats**: Supports 13+ barcode formats including QR, Code128, EAN, UPC, and more
- **🔧 Advanced Preprocessing**: Built-in image enhancement for better recognition rates
- **⚡ New Architecture Ready**: Full support for React Native's New Architecture (Turbo Modules)
- **📦 Lightweight**: Minimal dependencies, optimized bundle size
- **🔄 Smart Retry Logic**: Intelligent preprocessing with rotation, grayscale, and contrast enhancement
- **🔒 Type Safe**: Full TypeScript support with comprehensive type definitions
- **🛠️ Expo Compatible**: Works with Expo (requires prebuild for native functionality)

## 📋 Supported Barcode Formats

| Format | iOS | Android |
|--------|-----|---------|  
| QR Code | ✅ | ✅ |
| Code 128 | ✅ | ✅ |
| Code 39 | ✅ | ✅ |
| Code 93 | ✅ | ✅ |
| EAN-13 | ✅ | ✅ |
| EAN-8 | ✅ | ✅ |
| UPC-A | ✅ | ✅ |
| UPC-E | ✅ | ✅ |
| PDF417 | ✅ | ✅ |
| Data Matrix | ✅ | ✅ |
| Aztec | ✅ | ✅ |
| ITF | ✅ | ✅ |
| Codabar | ✅ | ✅ |

## 🚀 Installation

```bash
npm install react-native-image-code-scanner
# or
yarn add react-native-image-code-scanner
```

### iOS Setup

```bash
cd ios && pod install
```

**Requirements:**
- iOS 13.4+
- Add camera usage description to `Info.plist` if you're picking images from camera:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to scan barcodes</string>
```

### Android Setup

No additional setup required for Android. The library automatically includes ML Kit dependencies.

**Requirements:**
- minSdkVersion 21+
- compileSdkVersion 33+

### Expo Setup

For Expo projects, you'll need to prebuild your project to use native modules:

```bash
# Install the library
npm install react-native-image-code-scanner

# Prebuild your project
npx expo prebuild

# Run on your preferred platform
npx expo run:ios
# or
npx expo run:android
```

**Note**: This library requires prebuild because it uses native iOS Vision Framework and Android ML Kit. It won't work in Expo Go.

## 💻 Usage

### Basic Usage

```typescript
import ImageCodeScanner from 'react-native-image-code-scanner';

// Scan QR code from image
const scanQRCode = async (imagePath: string) => {
  try {
    const results = await ImageCodeScanner.scan({
      path: imagePath,
      formats: [ImageCodeScanner.BarcodeFormat.QR_CODE],
    });
    
    if (results.length > 0) {
      console.log('QR Code found:', results[0]);
    } else {
      console.log('No QR code found in image');
    }
  } catch (error) {
    console.error('Scan error:', error);
  }
};
```

### Advanced Usage with Preprocessing

```typescript
import ImageCodeScanner, { BarcodeFormat } from 'react-native-image-code-scanner';

const scanWithPreprocessing = async (imagePath: string) => {
  try {
    const results = await ImageCodeScanner.scan({
      path: imagePath,
      formats: [
        BarcodeFormat.QR_CODE,
        BarcodeFormat.CODE_128,
        BarcodeFormat.EAN_13,
      ],
      // Enable all preprocessing options
      preprocessing: {
        enhanceContrast: true,  // Try contrast enhancement
        grayscale: true,        // Try grayscale conversion
        rotations: true,        // Try multiple rotations (0°, 90°, 180°, 270°)
      },
    });
    
    console.log('Found barcodes:', results);
  } catch (error) {
    console.error('Scan error:', error);
  }
};
```

### Platform-Specific Preprocessing

```typescript
const scanWithPlatformOverrides = async (imagePath: string) => {
  const results = await ImageCodeScanner.scan({
    path: imagePath,
    formats: [BarcodeFormat.QR_CODE],
    preprocessing: {
      enhanceContrast: true,
      grayscale: true,
      rotations: false,  // Default for both platforms
    },
    platformOverrides: {
      ios: {
        rotations: true,  // Enable rotations only on iOS
      },
      android: {
        enhanceContrast: false,  // Disable contrast enhancement on Android
      },
    },
  });
};
```

### With Image Picker

```typescript
import ImageCodeScanner from 'react-native-image-code-scanner';
import { launchImageLibrary } from 'react-native-image-picker';

const scanFromGallery = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
  });
  
  if (result.assets && result.assets[0]) {
    const imagePath = result.assets[0].uri;
    
    const scanResults = await ImageCodeScanner.scan({
      path: imagePath,
      formats: [ImageCodeScanner.BarcodeFormat.QR_CODE],
      preprocessing: true,  // Enable all preprocessing
    });
    
    if (scanResults.length > 0) {
      console.log('Barcode data:', scanResults);
    }
  }
};
```

### With Expo Image Picker

```typescript
import ImageCodeScanner from 'react-native-image-code-scanner';
import * as ImagePicker from 'expo-image-picker';

const scanFromGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });
  
  if (!result.canceled && result.assets && result.assets[0]) {
    const imagePath = result.assets[0].uri;
    
    const scanResults = await ImageCodeScanner.scan({
      path: imagePath,
      formats: [ImageCodeScanner.BarcodeFormat.QR_CODE],
      preprocessing: true,  // Enable all preprocessing
    });
    
    if (scanResults.length > 0) {
      console.log('Barcode data:', scanResults);
    }
  }
};
```

### Quick Start with All Features

```typescript
import ImageCodeScanner, { BarcodeFormat } from 'react-native-image-code-scanner';

// Scan with all preprocessing enabled and multiple formats
const scanEverything = async (imagePath: string) => {
  try {
    const results = await ImageCodeScanner.scan({
      path: imagePath,
      formats: Object.values(BarcodeFormat), // All supported formats
      preprocessing: true, // Enable all preprocessing options
    });
    
    console.log(`Found ${results.length} barcodes:`, results);
    return results;
  } catch (error) {
    console.error('Scan failed:', error);
    return [];
  }
};
```

## 📚 API Reference

### `ImageCodeScanner.scan(options)`

Scans an image for barcodes.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `ScanOptions` | Yes | Scanning configuration |

#### ScanOptions

```typescript
interface ScanOptions {
  path: string;                          // Path to the image file
  formats?: BarcodeFormat[];             // Array of barcode formats to detect
  preprocessing?: PreprocessingOptions | boolean;  // Preprocessing configuration
  platformOverrides?: {                  // Platform-specific preprocessing overrides
    android?: PreprocessingOptions | boolean;
    ios?: PreprocessingOptions | boolean;
  };
}
```

#### PreprocessingOptions

```typescript
interface PreprocessingOptions {
  enhanceContrast?: boolean;  // Enhance image contrast
  grayscale?: boolean;        // Convert to grayscale
  rotations?: boolean;        // Try multiple rotations
}
```

#### Returns

`Promise<string[]>` - Array of decoded barcode values

### `ImageCodeScanner.BarcodeFormat`

Enum of supported barcode formats:

```typescript
enum BarcodeFormat {
  QR_CODE = 'QR_CODE',
  CODE_128 = 'CODE_128',
  CODE_39 = 'CODE_39',
  CODE_93 = 'CODE_93',
  EAN_13 = 'EAN_13',
  EAN_8 = 'EAN_8',
  UPC_A = 'UPC_A',
  UPC_E = 'UPC_E',
  PDF_417 = 'PDF_417',
  DATA_MATRIX = 'DATA_MATRIX',
  AZTEC = 'AZTEC',
  ITF = 'ITF',
  CODABAR = 'CODABAR',
}
```

## ⚡ Performance Tips

1. **🖼️ Image Size**: Large images may take longer to process. Consider resizing images before scanning if performance is critical.

2. **🎯 Format Selection**: Specify only the formats you need rather than scanning for all formats.

3. **🔧 Preprocessing**: While preprocessing can improve recognition rates, it also increases processing time. Use selectively based on your needs.

4. **📱 Platform Differences**: iOS Vision Framework and Android ML Kit may have slight differences in recognition capabilities. Test on both platforms for critical use cases.

5. **🔄 Batch Processing**: For multiple images, process them sequentially rather than in parallel to avoid memory issues.

## 🛠️ Troubleshooting

### No barcodes detected

1. Ensure the image has sufficient quality and resolution
2. Enable preprocessing options for challenging images
3. Check that the barcode format is supported and included in the formats array
4. Try different preprocessing combinations

### iOS Build Issues

1. Clean build folder: `cd ios && rm -rf build && pod install`
2. Ensure minimum iOS version is 13.4 or higher in your Podfile
3. Check that all pods are properly installed

### Android Build Issues

1. Ensure you have the correct Kotlin version in your project
2. Clean and rebuild: `cd android && ./gradlew clean`
3. Check that ML Kit dependencies are properly included

### Expo Issues

1. **Prebuild Required**: This library requires prebuild because it uses native modules
2. **Expo Go Limitation**: Won't work in Expo Go - use prebuild for full functionality
3. **Build Errors**: Run `npx expo prebuild --clean` to start fresh

## 📱 Example App

Check out the [example app](./example) for a complete implementation with Expo:

```bash
cd example
npm install
# or
yarn install

# For quick UI testing (Expo Go)
npm start

# For full functionality (requires prebuild)
npm run prebuild
npm run build:ios    # or npm run build:android
```

The example app demonstrates:
- Image selection from camera and gallery using Expo Image Picker
- Real-time preprocessing option toggles
- Multiple barcode format selection
- Performance timing measurements
- Beautiful, responsive UI
- Cross-platform support (iOS, Android, Web)

**Important Notes:**
- 🚀 **Expo Go Mode**: Quick UI testing, but barcode scanning won't work
- ⚡ **Prebuild Mode**: Full functionality including barcode scanning (requires Xcode/Android Studio)
- 📖 **See [QUICK_START.md](./example/QUICK_START.md)** for detailed setup instructions

**Platform Support:**
- 📱 **iOS**: Full camera and gallery access
- 🤖 **Android**: Full camera and gallery access  
- 🌐 **Web**: Photo library access (camera limited by browser)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies: `yarn install`
3. Run tests: `yarn test`
4. Run linter: `yarn lint`
5. Run type checking: `yarn typecheck`

## 📄 License

MIT © [Heimer Nguyen](https://github.com/nguyenthanhan)

## 🆘 Support

- 🐛 [Report Issues](https://github.com/nguyenthanhan/react-native-image-code-scanner/issues)
- 💬 [Discussions](https://github.com/nguyenthanhan/react-native-image-code-scanner/discussions)
- ⭐ Star us on [GitHub](https://github.com/nguyenthanhan/react-native-image-code-scanner)

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

Made with ❤️ by [Heimer Nguyen](https://github.com/nguyenthanhan)
