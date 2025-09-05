# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-09-05

### Added

- **Enhanced scan results** - Now returns both content and format information
- New `ScanResult` interface with `content` and `format` properties
- Format detection for all supported barcode types (QR_CODE, CODE_128, EAN_13, etc.)
- Updated example app to display both content and barcode format
- TypeScript support for the new result format

### Changed

- **Breaking Change**: `ImageCodeScanner.scan()` now returns `ScanResult[]` instead of `string[]`
- Updated API to provide more detailed scan results
- Enhanced example app UI to show barcode format alongside content
- Improved result display with format badges

### Fixed

- Better type safety with comprehensive result interface
- Enhanced debugging capabilities with format information

[1.1.0]: https://github.com/nguyenthanhan/react-native-image-code-scanner/releases/tag/v1.1.0

_This changelog will be updated with each new release to document all changes, improvements, and new features._
