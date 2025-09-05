import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface ScanResult {
  content: string;
  format: string;
}

export interface Spec extends TurboModule {
  scanFromPath(
    path: string,
    formats: string[],
    options: {
      enhanceContrast: boolean;
      convertToGrayscale: boolean;
      tryRotations: boolean;
    }
  ): Promise<ScanResult[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ImageCodeScanner');
