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

Scan QR codes and barcodes from local image files in React Native (iOS Vision Framework + Android ML Kit), with Expo prebuild support.

- Native engine: iOS Vision Framework + Android ML Kit
- Cross-platform: iOS, Android
- Auto preprocessing: grayscale, contrast boost, rotation retry
- TypeScript support

## Use Cases

- Scan QR/barcode from gallery images
- Process receipts, labels, and shipping codes from static photos
- Support mixed barcode formats in one scan flow

## Requirements

- React Native `>=0.70.0`
- React `>=17.0.0`
- iOS `13.4+`
- Android `minSdkVersion 21+`
- Node `>=18`

## Installation

### Expo (recommended)

This package uses native modules, so it works with Expo prebuild, not Expo Go.

```bash
npx expo install react-native-image-code-scanner
npx expo prebuild --clean
npx expo run:ios
# or
npx expo run:android
```

### React Native CLI

```bash
npm install react-native-image-code-scanner
# or
yarn add react-native-image-code-scanner
```

### iOS

```bash
cd ios && pod install
```

If your app picks image from camera, add this to `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan barcodes</string>
```

### Android

No extra setup.

## Usage

### Example 1: Pick image with `expo-image-picker`, then scan

```ts
import * as ImagePicker from 'expo-image-picker';
import ImageCodeScanner, {
  BarcodeFormat,
} from 'react-native-image-code-scanner';

async function pickAndScan() {
  const picked = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (picked.canceled || !picked.assets?.[0]?.uri) {
    return [];
  }

  return ImageCodeScanner.scan({
    path: picked.assets[0].uri,
    formats: [BarcodeFormat.QR_CODE],
  });
}
```

### Example 2: Pick image with `react-native-image-picker`, then scan

```ts
import { launchImageLibrary } from 'react-native-image-picker';
import ImageCodeScanner, {
  BarcodeFormat,
} from 'react-native-image-code-scanner';

async function pickAndScanWithRNImagePicker() {
  const picked = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
  });

  const imagePath = picked.assets?.[0]?.uri;
  if (!imagePath) {
    return [];
  }

  return ImageCodeScanner.scan({
    path: imagePath,
    formats: [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128],
  });
}
```

## API

```ts
ImageCodeScanner.scan(options: ScanOptions): Promise<ScanResult[]>
```

```ts
interface ScanOptions {
  path: string;
  formats?: BarcodeFormat[]; // default: QR_CODE
}

interface ScanResult {
  content: string;
  format: string;
}
```

Supported `BarcodeFormat` values:

- `QR_CODE`
- `CODE_128`
- `CODE_39`
- `CODE_93`
- `EAN_13`
- `EAN_8`
- `UPC_A`
- `UPC_E`
- `PDF_417`
- `DATA_MATRIX`
- `AZTEC`
- `ITF`
- `CODABAR`

## Preprocessing Techniques

To maximize recognition, scanner will try these techniques automatically:

1. Original image scan
2. Grayscale conversion
3. Contrast enhancement
4. Rotation attempts (`0°`, `90°`, `180°`, `270°`)

When a barcode is detected, the scan stops early and returns results.

## Performance Tips

1. Resize very large images before scanning.
2. Pass only needed `formats` instead of scanning all formats.
3. Process images sequentially for batch jobs to reduce memory spikes.
4. Test on both iOS and Android for critical use cases.

## Troubleshooting

- No result found:
  - Check image quality and resolution
  - Limit `formats` to what you actually need
  - Ensure barcode type is in supported list
  - Crop image closer to barcode when possible
- iOS build issues:
  - Reinstall pods: `cd ios && pod install`
  - Ensure deployment target is `13.4+`
- Android build issues:
  - Clean project: `cd android && ./gradlew clean`
  - Ensure `minSdkVersion >= 21`
- Expo:
  - Must run prebuild
  - Not supported in Expo Go

## Example App

See [example app](./example) and [example README](./example/README.md).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
