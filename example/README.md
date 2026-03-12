# Image Code Scanner Example (Expo)

This app demonstrates how to use `react-native-image-code-scanner` in an Expo project.

## What this example includes

- Pick image from camera or gallery (`expo-image-picker`)
- Select barcode formats before scanning
- Scan with automatic preprocessing (built into the library)
- Show scan results and execution time

## Requirements

- Node.js `>=18`
- iOS: Xcode (for native build)
- Android: Android Studio + SDK (for native build)

## Install

```bash
cd example
npm install
# or
yarn install
```

## Run modes

### 1) Expo Go / quick UI check

```bash
npm start
# or
yarn start
```

- Useful for UI iteration.
- Barcode scanning will not work in Expo Go because this package uses native modules.

### 2) Native run (recommended, full functionality)

```bash
# iOS
npm run ios

# Android
npm run android
```

If you need a clean native regeneration:

```bash
npm run prebuild:clean
npm run ios
# or
npm run android
```

## How to test

1. Open app on iOS/Android native build.
2. Choose `Camera` or `Gallery`.
3. Pick barcode formats.
4. Tap `Scan Image`.
5. Check detected results and scan time.

## Notes

- Preprocessing is automatic (grayscale, contrast enhancement, rotation attempts).
- At least one barcode format must stay selected.
- Permissions for camera and media library are requested at runtime.

## Troubleshooting

- `No barcodes found`:
  - Use a clearer image or crop closer to barcode.
  - Select only relevant formats.
- iOS build errors:
  - Run `npm run prebuild:clean` then `npm run ios`.
- Android build errors:
  - Run `npm run prebuild:clean` then `npm run android`.
- Metro cache issues:
  - Run `expo start -c`.

## Scripts

- `npm start`: Start Expo dev server
- `npm run ios`: Build and run on iOS (native)
- `npm run android`: Build and run on Android (native)
- `npm run prebuild`: Generate native projects
- `npm run prebuild:clean`: Regenerate native projects from scratch

## Related docs

- [Main package README](../README.md)
- [Expo docs](https://docs.expo.dev/)
- [Expo image picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
