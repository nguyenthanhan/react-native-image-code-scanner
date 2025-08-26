import {Platform} from 'react-native';

import ImageCodeScanner from './NativeImageCodeScanner';

// Common formats supported by both iOS Vision and Android ML Kit
export enum BarcodeFormat {
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

/**
 * Scan options for the image code scanner
 * @param {string} path - The path to the image to scan
 * @param {BarcodeFormat[]} formats - The formats to scan for
 * @param {AndroidOptions} android - Android-specific options
 * @param {IosOptions} ios - iOS-specific options
 */
/**
 * Preprocessing options for image enhancement
 */
export interface PreprocessingOptions {
  /**
   * Try scanning with contrast-enhanced version if initial scan fails
   * Android: Uses Bitmap manipulation | iOS: Uses Core Image filters
   */
  enhanceContrast?: boolean;
  /**
   * Try scanning with grayscale version if initial scan fails
   * Android: Uses Bitmap conversion | iOS: Uses Core Image filters
   */
  grayscale?: boolean;
  /**
   * Try scanning with rotated versions (90°, 180°, 270°) if initial scan fails
   * Android: Uses Matrix rotation | iOS: Uses Core Graphics
   */
  rotations?: boolean;
}

export interface ScanOptions {
  path: string;
  formats?: BarcodeFormat[];

  /**
   * Preprocessing options applied to both platforms
   * Set to false to disable all preprocessing
   */
  preprocessing?: PreprocessingOptions | boolean;

  /**
   * Platform-specific preprocessing overrides
   * These override the general preprocessing settings for specific platforms
   */
  platformOverrides?: {
    android?: PreprocessingOptions | boolean;
    ios?: PreprocessingOptions | boolean;
  };
}

// Helper function to resolve preprocessing options
function resolvePreprocessingOptions(
  preprocessing?: PreprocessingOptions | boolean,
  platformOverrides?: {
    android?: PreprocessingOptions | boolean;
    ios?: PreprocessingOptions | boolean;
  },
): PreprocessingOptions {
  const isIOS = Platform.OS === 'ios';
  const platformOverride = isIOS
    ? platformOverrides?.ios
    : platformOverrides?.android;

  // If platform override is explicitly false, disable all preprocessing
  if (platformOverride === false) {
    return {
      enhanceContrast: false,
      grayscale: false,
      rotations: false,
    };
  }

  // If platform override is an object, use it
  if (typeof platformOverride === 'object' && platformOverride !== null) {
    return {
      enhanceContrast: platformOverride.enhanceContrast ?? false,
      grayscale: platformOverride.grayscale ?? false,
      rotations: platformOverride.rotations ?? false,
    };
  }

  // If general preprocessing is false, disable all
  if (preprocessing === false) {
    return {
      enhanceContrast: false,
      grayscale: false,
      rotations: false,
    };
  }

  // If general preprocessing is true, enable all
  if (preprocessing === true) {
    return {
      enhanceContrast: true,
      grayscale: true,
      rotations: true,
    };
  }

  // Use general preprocessing options if provided
  if (typeof preprocessing === 'object' && preprocessing !== null) {
    return {
      enhanceContrast: preprocessing.enhanceContrast ?? false,
      grayscale: preprocessing.grayscale ?? false,
      rotations: preprocessing.rotations ?? false,
    };
  }

  // Default: no preprocessing
  return {
    enhanceContrast: false,
    grayscale: false,
    rotations: false,
  };
}

const ImageCodeScannerModule = {
  scan: (options: ScanOptions): Promise<string[]> => {
    const {
      path,
      formats = [BarcodeFormat.QR_CODE],
      preprocessing,
      platformOverrides,
    } = options;

    // Resolve preprocessing options based on platform and overrides
    const resolvedOptions = resolvePreprocessingOptions(
      preprocessing,
      platformOverrides,
    );

    // Map to native module format
    const nativeOptions = {
      enhanceContrast: resolvedOptions.enhanceContrast ?? false,
      convertToGrayscale: resolvedOptions.grayscale ?? false,
      tryRotations: resolvedOptions.rotations ?? false,
    };

    return ImageCodeScanner.scanFromPath(
      path,
      formats.map(f => f.toString()),
      nativeOptions,
    );
  },
  BarcodeFormat,
};

export default ImageCodeScannerModule;
