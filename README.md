# React Native Image Code Scanner

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-image-code-scanner">
    <img src="https://img.shields.io/npm/v/react-native-image-code-scanner.svg" alt="npm version">
  </a>
  <a href="https://github.com/nguyenthanhan/react-native-image-code-scanner/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/nguyenthanhan/react-native-image-code-scanner.svg" alt="license">
  </a>
  <a href="https://www.npmjs.com/package/react-native-image-code-scanner">
    <img src="https://img.shields.io/npm/dm/react-native-image-code-scanner.svg" alt="downloads">
  </a>
  <a href="https://github.com/nguyenthanhan/react-native-image-code-scanner/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/nguyenthanhan/react-native-image-code-scanner/ci.yml" alt="CI Status">
  </a>
  <a href="https://github.com/nguyenthanhan/react-native-image-code-scanner/issues">
    <img src="https://img.shields.io/github/issues/nguyenthanhan/react-native-image-code-scanner" alt="Issues">
  </a>
</p>

A lightweight, high-performance React Native library for scanning QR codes and barcodes from images with automatic preprocessing for optimal recognition. Built with native performance in mind using iOS Vision Framework and Android ML Kit.

## ✨ Features

- **🚀 High Performance**: Native implementation using iOS Vision Framework and Google ML Kit
- **📱 Cross-Platform**: Support for both iOS and Android
- **🎯 Multiple Formats**: Supports 13+ barcode formats including QR, Code128, EAN, UPC, and more
- **🔧 Automatic Preprocessing**: Built-in image enhancement automatically applied for better recognition
- **⚡ New Architecture Ready**: Full support for React Native's New Architecture (Turbo Modules)
- **📦 Lightweight**: Minimal dependencies, optimized bundle size
- **🔄 Smart Recognition**: Automatic rotation, grayscale conversion, and contrast enhancement
- **🔒 Type Safe**: Full TypeScript support with comprehensive type definitions
- **🛠️ Expo Compatible**: Works with Expo (requires prebuild for native functionality)
- **🏗️ Robust CI/CD**: Enhanced build pipeline with improved cross-platform reliability

## 📋 Supported Barcode Formats

| Format      | iOS | Android |
| ----------- | --- | ------- |
| QR Code     | ✅  | ✅      |
| Code 128    | ✅  | ✅      |
| Code 39     | ✅  | ✅      |
| Code 93     | ✅  | ✅      |
| EAN-13      | ✅  | ✅      |
| EAN-8       | ✅  | ✅      |
| UPC-A       | ✅  | ✅      |
| UPC-E       | ✅  | ✅      |
| PDF417      | ✅  | ✅      |
| Data Matrix | ✅  | ✅      |
| Aztec       | ✅  | ✅      |
| ITF         | ✅  | ✅      |
| Codabar     | ✅  | ✅      |

### React Native Version Support

| React Native    | Package Version | Architecture Support           | Status                    |
| --------------- | --------------- | ------------------------------ | ------------------------- |
| 0.70.x - 0.74.x | ✅ 1.0.x        | Old Architecture               | Fully Supported           |
| 0.75.x - 0.78.x | ✅ 1.0.x        | Old & New Architecture         | Fully Supported           |
| **0.79.x**      | ✅ **1.0.x**    | **New Architecture (default)** | **Latest - Full Support** |
| 0.80.x+         | 🔜 1.0.x        | New Architecture               | Ready when released       |

### Requirements

- **React Native**: >=0.70.0
- **React**: >=17.0.0
- **iOS**: 13.4+
- **Android**: minSdkVersion 21+
- **Node**: >=18

## Installation

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
#or
npx expo install react-native-image-code-scanner

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
import ImageCodeScanner, { ScanResult } from 'react-native-image-code-scanner';

// Scan QR code from image
const scanQRCode = async (imagePath: string) => {
  try {
    const results: ScanResult[] = await ImageCodeScanner.scan({
      path: imagePath,
    });

    if (results.length > 0) {
      const firstResult = results[0];
      console.log('QR Code found:', firstResult.content);
      console.log('Format:', firstResult.format); // "QR_CODE"
    } else {
      console.log('No QR code found in image');
    }
  } catch (error) {
    console.error('Scan error:', error);
  }
};
```

### Advanced Usage with Multiple Formats

```typescript
import ImageCodeScanner, {
  BarcodeFormat,
  ScanResult,
} from 'react-native-image-code-scanner';

const scanMultipleFormats = async (imagePath: string) => {
  try {
    const results: ScanResult[] = await ImageCodeScanner.scan({
      path: imagePath,
      formats: [
        BarcodeFormat.QR_CODE,
        BarcodeFormat.CODE_128,
        BarcodeFormat.EAN_13,
      ],
      // Automatic preprocessing is enabled by default for optimal recognition
    });

    results.forEach((result, index) => {
      console.log(`Barcode ${index + 1}:`, result.content);
      console.log(`Format:`, result.format);
    });
  } catch (error) {
    console.error('Scan error:', error);
  }
};
```

### How It Works

The scanner automatically applies multiple preprocessing techniques to maximize recognition:

1. **Original Image**: First scan attempt
2. **Grayscale Conversion**: Improves detection in colored backgrounds
3. **Contrast Enhancement**: Better recognition in low-contrast images
4. **Rotation Attempts**: Tries 0°, 90°, 180°, and 270° rotations

As soon as a barcode is detected with any technique, the result is returned immediately for optimal performance.

### With Image Picker

```typescript
import ImageCodeScanner, { ScanResult } from 'react-native-image-code-scanner';
import { launchImageLibrary } from 'react-native-image-picker';

const scanFromGallery = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
  });

  if (result.assets && result.assets[0]) {
    const imagePath = result.assets[0].uri;

    const scanResults: ScanResult[] = await ImageCodeScanner.scan({
      path: imagePath,
      formats: [ImageCodeScanner.BarcodeFormat.QR_CODE],
      // Automatic preprocessing is enabled by default
    });

    if (scanResults.length > 0) {
      scanResults.forEach((result) => {
        console.log('Content:', result.content);
        console.log('Format:', result.format);
      });
    }
  }
};
```

### With Expo Image Picker

```typescript
import ImageCodeScanner, { ScanResult } from 'react-native-image-code-scanner';
import * as ImagePicker from 'expo-image-picker';

const scanFromGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets[0]) {
    const imagePath = result.assets[0].uri;

    const scanResults: ScanResult[] = await ImageCodeScanner.scan({
      path: imagePath,
      formats: [ImageCodeScanner.BarcodeFormat.QR_CODE],
      // Automatic preprocessing is enabled by default
    });

    if (scanResults.length > 0) {
      scanResults.forEach((result) => {
        console.log('Content:', result.content);
        console.log('Format:', result.format);
      });
    }
  }
};
```

### Quick Start with All Features

```typescript
import ImageCodeScanner, {
  BarcodeFormat,
  ScanResult,
} from 'react-native-image-code-scanner';

// Scan with automatic preprocessing and multiple formats
const scanEverything = async (imagePath: string): Promise<ScanResult[]> => {
  try {
    const results: ScanResult[] = await ImageCodeScanner.scan({
      path: imagePath,
      formats: Object.values(BarcodeFormat), // All supported formats
      // Automatic preprocessing is enabled by default
    });

    console.log(`Found ${results.length} barcodes:`);
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.format}: ${result.content}`);
    });

    return results;
  } catch (error) {
    console.error('Scan failed:', error);
    return [];
  }
};
```

## 📚 API Reference

### `ImageCodeScanner.scan(options)`

Scans an image for barcodes with automatic preprocessing enabled.

#### Parameters

| Parameter | Type          | Required | Description            |
| --------- | ------------- | -------- | ---------------------- |
| `options` | `ScanOptions` | Yes      | Scanning configuration |

#### ScanOptions

```typescript
interface ScanOptions {
  path: string; // Path to the image file
  formats?: BarcodeFormat[]; // Array of barcode formats to detect (default: QR_CODE)
}
```

#### Returns

`Promise<ScanResult[]>` - Array of scan results with content and format information

#### ScanResult

```typescript
interface ScanResult {
  content: string; // The decoded barcode content
  format: string; // The detected barcode format (e.g., "QR_CODE", "EAN_13")
}
```

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

### Automatic Preprocessing

The library automatically applies the following preprocessing techniques for better recognition:

- **Grayscale Conversion**: Converts images to grayscale for improved barcode detection
- **Contrast Enhancement**: Enhances image contrast to make barcodes more readable
- **Rotation Detection**: Tries multiple orientations (0°, 90°, 180°, 270°) automatically
- **Smart Retry Logic**: If initial scan fails, automatically tries with different preprocessing techniques

## ⚡ Performance Tips

1. **🖼️ Image Size**: Large images may take longer to process. Consider resizing images before scanning if performance is critical.

2. **🎯 Format Selection**: Specify only the formats you need rather than scanning for all formats.

3. **🔧 Preprocessing**: Automatic preprocessing improves recognition rates but may increase processing time. The library optimizes this automatically.

4. **📱 Platform Differences**: iOS Vision Framework and Android ML Kit may have slight differences in recognition capabilities. Test on both platforms for critical use cases.

5. **🔄 Batch Processing**: For multiple images, process them sequentially rather than in parallel to avoid memory issues.

## 🛠️ Troubleshooting

### No barcodes detected

1. Ensure the image has sufficient quality and resolution
2. Specify only the relevant barcode formats to reduce noise
3. Check that the barcode format is supported and included in the formats array
4. Try resizing/cropping the image (e.g., focus on the barcode area) or improving contrast before scanning

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
- Automatic preprocessing (always on; no manual toggles required)
- Multiple barcode format selection
- Performance timing measurements
- Beautiful, responsive UI
- Cross-platform support (iOS, Android, Web)

**Important Notes:**

- 🚀 **Expo Go Mode**: Barcode scanning won't work
- ⚡ **Prebuild Mode**: Full functionality including barcode scanning (requires Xcode/Android Studio)
- 📖 **See [README.md](./example/README.md)** for detailed setup instructions

**Platform Support:**

- 📱 **iOS**: Gallery access
- 🤖 **Android**: Gallery access

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies: `yarn install`
3. Run tests: `yarn test`
4. Run linter: `yarn lint`
5. Run type checking: `yarn typecheck`

## 📄 License

MIT

## 🆘 Support

- 🐛 [Report Issues](https://github.com/nguyenthanhan/react-native-image-code-scanner/issues)
- 💬 [Discussions](https://github.com/nguyenthanhan/react-native-image-code-scanner/discussions)
- ⭐ Star us on [GitHub](https://github.com/nguyenthanhan/react-native-image-code-scanner)
