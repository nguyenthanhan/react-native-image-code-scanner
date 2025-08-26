# Image Code Scanner Example - Expo

This is an Expo-compatible example app demonstrating the `react-native-image-code-scanner` library capabilities.

## Features

- 📱 **Cross-platform**: Works on iOS, Android, and Web
- 📷 **Image Selection**: Choose images from camera or photo gallery
- 🔍 **Multiple Formats**: Support for 13+ barcode formats
- ⚙️ **Preprocessing Options**: Image enhancement for better recognition
- 🎯 **Real-time Configuration**: Toggle preprocessing options on the fly
- ⏱️ **Performance Metrics**: See scan time for optimization

## Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS testing)
- Android Emulator (for Android testing)

## Installation

1. **Install dependencies:**
   ```bash
   cd example
   npm install
   # or
   yarn install
   ```

2. **Install Expo Go app** on your device for testing:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Running the App

### Development Mode (Expo Go)

For quick testing and development:

```bash
npm start
# or
yarn start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web browser
- Scan QR code with Expo Go app on your device

### Production Mode (Prebuild Required)

Since this app uses a native module (`react-native-image-code-scanner`), you need to prebuild for full functionality:

```bash
# Prebuild the project (creates native iOS/Android folders)
npm run prebuild

# Run on iOS
npm run build:ios

# Run on Android  
npm run build:android
```

**Note**: Prebuild is required because:
- The library uses native iOS Vision Framework and Android ML Kit
- Native modules need to be compiled into the app bundle
- Expo Go has limited native module support

## App Structure

```
├── App.tsx              # Main entry point
├── src/
│   └── App.tsx          # Main application component
├── assets/              # App assets (icons, images)
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
├── babel.config.js      # Babel configuration
├── tsconfig.json        # TypeScript configuration
└── expo-env.d.ts        # Expo type definitions
```

## Usage

1. **Select Image**: Use camera or gallery to pick an image
2. **Choose Formats**: Select which barcode formats to scan for
3. **Configure Preprocessing**: Enable/disable image enhancement options
4. **Scan**: Tap "Scan Image" to process the image
5. **View Results**: See detected barcodes and scan performance

## Preprocessing Options

- **Enhance Contrast**: Improves image contrast for better recognition
- **Grayscale**: Converts image to grayscale (often improves barcode detection)
- **Rotations**: Tries multiple orientations (0°, 90°, 180°, 270°)

## Supported Barcode Formats

- QR Code
- Code 128
- Code 39
- EAN-13
- PDF417
- Data Matrix
- And 7 more formats...

## Troubleshooting

### Common Issues

**Permission Denied:**
- Ensure camera and photo library permissions are granted
- On iOS, check Info.plist settings
- On Android, verify manifest permissions

**No Barcodes Detected:**
- Try enabling preprocessing options
- Ensure image quality is sufficient
- Check that selected formats include the barcode type

**Build Errors:**
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Clean prebuild: `npm run prebuild:clean`

**Prebuild Issues:**
- Ensure you have Xcode (iOS) and Android Studio (Android) installed
- Run `expo doctor` to check your development environment
- Use `npm run prebuild:clean` to start fresh

### Platform-Specific Notes

**iOS:**
- Requires iOS 13.4+
- Camera and photo library permissions are handled automatically
- Xcode required for prebuild

**Android:**
- Requires Android 5.0+ (API 21)
- Permissions are requested at runtime
- Android Studio required for prebuild

**Web:**
- Limited camera access (browser restrictions)
- Photo library works via file input
- No prebuild required

## Development

### Adding New Features

1. Modify `src/App.tsx` for UI changes
2. Update preprocessing options in the state
3. Test on multiple platforms

### Linting

```bash
npm run lint
# or
yarn lint
```

## Dependencies

- `expo`: Core Expo framework
- `expo-image-picker`: Image selection from camera/gallery
- `expo-status-bar`: Status bar management
- `react-native-image-code-scanner`: Main library (local dependency)

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Image Code Scanner](../README.md)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/image-picker/)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)

---

Built with ❤️ using Expo and React Native
