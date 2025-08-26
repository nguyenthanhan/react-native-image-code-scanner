# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-08-26

### Added
- Initial release of React Native Image Code Scanner
- Native implementation for iOS using Vision Framework
- Native implementation for Android using ML Kit
- Support for 13 barcode formats (QR Code, Code 128, Code 39, etc.)
- Advanced image preprocessing options:
  - Contrast enhancement
  - Grayscale conversion
  - Automatic rotation attempts
- Platform-specific preprocessing overrides
- Full support for React Native's New Architecture (Turbo Modules)
- TypeScript support with complete type definitions
- Comprehensive documentation and examples
- **Expo compatibility** with prebuild support
- **Expo example app** with modern UI and full feature demonstration
- Cross-platform example app (iOS, Android, Web)

### Features
- Lightweight and performant native implementation
- Smart retry logic with image preprocessing
- No additional setup required for Android
- Minimal iOS setup with just pod install
- **Expo integration** with proper prebuild workflow
- **Modern example app** using Expo Image Picker and StatusBar
- **Real-time configuration** of preprocessing options
- **Performance metrics** and timing measurements

### Example App Features
- Modern Expo-based example application
- Barcode format selection UI with real-time toggles
- Enhanced preprocessing options with visual controls
- Improved error handling and user feedback
- Comprehensive setup documentation
- Support for both Expo Go (UI testing) and prebuild (full functionality)
- Cross-platform compatibility (iOS, Android, Web)
- Performance timing and metrics display

[0.1.0]: https://github.com/nguyenthanhan/react-native-image-code-scanner/releases/tag/v0.1.0
