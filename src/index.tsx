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

export interface ScanOptions {
  path: string;
  formats?: BarcodeFormat[];
}

const ImageCodeScannerModule = {
  scan: (options: ScanOptions): Promise<string[]> => {
    const { path, formats = [BarcodeFormat.QR_CODE] } = options;

    // Note: Preprocessing is always enabled in native implementation
    // The native code automatically tries multiple preprocessing techniques
    const nativeOptions = {
      enhanceContrast: true,
      convertToGrayscale: true,
      tryRotations: true,
    };

    return ImageCodeScanner.scanFromPath(
      path,
      formats.map((f) => f.toString()),
      nativeOptions
    );
  },
  BarcodeFormat,
};

export default ImageCodeScannerModule;
