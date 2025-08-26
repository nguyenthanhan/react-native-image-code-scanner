import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  scanFromPath(
    path: string,
    formats: string[],
    options: {
      enhanceContrast: boolean;
      convertToGrayscale: boolean;
      tryRotations: boolean;
    }
  ): Promise<string[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ImageCodeScanner');
