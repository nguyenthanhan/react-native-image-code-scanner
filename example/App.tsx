import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import ImageCodeScanner, {
  BarcodeFormat,
} from 'react-native-image-code-scanner';

interface ScanResult {
  data: string[];
  time: number;
}

const BARCODE_FORMATS = [
  { key: BarcodeFormat.QR_CODE, label: 'QR Code' },
  { key: BarcodeFormat.CODE_128, label: 'Code 128' },
  { key: BarcodeFormat.CODE_39, label: 'Code 39' },
  { key: BarcodeFormat.EAN_13, label: 'EAN-13' },
  { key: BarcodeFormat.PDF_417, label: 'PDF417' },
  { key: BarcodeFormat.DATA_MATRIX, label: 'Data Matrix' },
];

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<BarcodeFormat[]>([
    BarcodeFormat.QR_CODE,
  ]);

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take photos'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setScanResult(null);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Gallery permission is required to select photos'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setScanResult(null);
    }
  };

  const scanImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const startTime = Date.now();

      const results = await ImageCodeScanner.scan({
        path: selectedImage,
        formats: selectedFormats,
      });

      const endTime = Date.now();
      const scanTime = endTime - startTime;

      setScanResult({
        data: results,
        time: scanTime,
      });

      if (results.length === 0) {
        Alert.alert(
          'No Codes Found',
          'No barcodes were detected in the image. Try using a clearer image or different barcode formats.'
        );
      }
    } catch (err) {
      Alert.alert(
        'Scan Error',
        err instanceof Error ? err.message : 'Unknown error occurred'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const toggleFormat = (format: BarcodeFormat) => {
    setSelectedFormats((prev) => {
      if (prev.includes(format)) {
        if (prev.length === 1) {
          Alert.alert(
            'Format Required',
            'At least one format must be selected'
          );
          return prev;
        }
        return prev.filter((f) => f !== format);
      } else {
        return [...prev, format];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>📷 Image Code Scanner</Text>
          <Text style={styles.subtitle}>Expo Example App</Text>
        </View>

        {/* Image Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Image Source</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={pickImageFromCamera}
            >
              <Text style={styles.buttonText}>📸 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.buttonText}>🖼️ Gallery</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
              />
              <Text style={styles.imagePath}>Image loaded</Text>
            </View>
          )}
        </View>

        {/* Format Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Select Barcode Formats</Text>
          <View style={styles.formatGrid}>
            {BARCODE_FORMATS.map((format) => (
              <TouchableOpacity
                key={format.key}
                style={[
                  styles.formatChip,
                  selectedFormats.includes(format.key) &&
                    styles.formatChipSelected,
                ]}
                onPress={() => toggleFormat(format.key)}
              >
                <Text
                  style={[
                    styles.formatChipText,
                    selectedFormats.includes(format.key) &&
                      styles.formatChipTextSelected,
                  ]}
                >
                  {format.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preprocessing Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Automatic Preprocessing</Text>
          <Text style={styles.preprocessingInfo}>
            The scanner automatically applies image enhancements for optimal
            recognition:
            {'\n'}• Contrast enhancement
            {'\n'}• Grayscale conversion
            {'\n'}• Multiple rotation attempts (0°, 90°, 180°, 270°)
            {'\n'}\nThese optimizations ensure the best possible barcode
            detection rates.
          </Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={[styles.scanButton, !selectedImage && styles.disabledButton]}
          onPress={scanImage}
          disabled={!selectedImage || isScanning}
        >
          {isScanning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.scanButtonText}>🔍 Scan Image</Text>
          )}
        </TouchableOpacity>

        {/* Results */}
        {scanResult && (
          <View style={[styles.section, styles.resultsSection]}>
            <Text style={styles.sectionTitle}>Results</Text>
            <View style={styles.resultMeta}>
              <Text style={styles.scanTime}>
                ⏱️ Scan time: {scanResult.time}ms
              </Text>
              <Text style={styles.resultCount}>
                Found: {scanResult.data.length} code
                {scanResult.data.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {scanResult.data.length > 0 ? (
              <View>
                {scanResult.data.map((code, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.resultItem}
                    onPress={() => {
                      Alert.alert('Code Content', code);
                    }}
                  >
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultLabel}>Code {index + 1}</Text>
                      <Text style={styles.tapHint}>Tap to view</Text>
                    </View>
                    <Text style={styles.resultText} numberOfLines={2}>
                      {code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResults}>No codes detected</Text>
                <Text style={styles.noResultsHint}>
                  Try using a clearer image or selecting different formats
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#f8f8f8',
  },
  imagePath: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  formatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formatChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  formatChipSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  formatChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  formatChipTextSelected: {
    color: '#007AFF',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  preprocessingInfo: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 13,
    color: '#ff6b6b',
    fontStyle: 'italic',
    marginTop: 8,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsSection: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scanTime: {
    fontSize: 14,
    color: '#666',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  resultItem: {
    backgroundColor: '#f8f8f8',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resultLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tapHint: {
    fontSize: 11,
    color: '#007AFF',
  },
  resultText: {
    fontSize: 15,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noResults: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsHint: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
});
