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
  Switch,
} from 'react-native';
import ImageCodeScanner, {
  BarcodeFormat,
} from 'react-native-image-code-scanner';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

interface ScanResult {
  data: string[];
  time: number;
  preprocessingUsed?: string;
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

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library permissions are required to use this app.'
      );
      return false;
    }
    return true;
  };

  const handleImagePicker = async (type: 'camera' | 'gallery') => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      let result: ImagePicker.ImagePickerResult;

      if (type === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setScanResult(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
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
        // Preprocessing is always enabled automatically for optimal results
      });

      const endTime = Date.now();
      const scanTime = endTime - startTime;

      setScanResult({
        data: results,
        time: scanTime,
      });

      if (results.length === 0) {
        Alert.alert('No Codes Found', 'No barcodes were detected in the image');
      }
    } catch (err) {
      Alert.alert(
        'Scan Error',
        err instanceof Error ? err.message : 'Unknown error'
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Image Code Scanner</Text>
          <Text style={styles.subtitle}>Test all features with Expo</Text>
        </View>

        {/* Image Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Image</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleImagePicker('camera')}
            >
              <Text style={styles.buttonText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleImagePicker('gallery')}
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
            </View>
          )}
        </View>

        {/* Barcode Format Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Barcode Formats</Text>
          <Text style={styles.sectionSubtitle}>
            Select formats to scan for:
          </Text>
          {BARCODE_FORMATS.map((format) => (
            <View key={format.key} style={styles.optionRow}>
              <Text>{format.label}</Text>
              <Switch
                value={selectedFormats.includes(format.key)}
                onValueChange={(value) => {
                  if (value) {
                    setSelectedFormats((prev) =>
                      prev.includes(format.key) ? prev : [...prev, format.key]
                    );
                  } else {
                    setSelectedFormats((prev) => {
                      if (prev.length === 1) {
                        Alert.alert(
                          'Format Required',
                          'At least one format must be selected'
                        );
                        return prev;
                      }
                      return prev.filter((f) => f !== format.key);
                    });
                  }
                }}
              />
            </View>
          ))}
        </View>

        {/* Automatic Preprocessing Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automatic Preprocessing</Text>
          <Text style={styles.sectionSubtitle}>
            The following enhancements are automatically applied:
          </Text>

          <View style={styles.infoRow}>
            <Text>• Grayscale conversion for better barcode detection</Text>
          </View>
          <View style={styles.infoRow}>
            <Text>• Contrast enhancement for improved readability</Text>
          </View>
          <View style={styles.infoRow}>
            <Text>• Automatic rotation detection (0°, 90°, 180°, 270°)</Text>
          </View>
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
            <Text style={styles.scanButtonText}>Scan Image</Text>
          )}
        </TouchableOpacity>

        {/* Results */}
        {scanResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Results</Text>
            <Text style={styles.scanTime}>Scan time: {scanResult.time}ms</Text>

            {scanResult.data.length > 0 ? (
              <View>
                {scanResult.data.map((code, index) => (
                  <View key={index} style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Code {index + 1}:</Text>
                    <Text style={styles.resultText}>{code}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noResults}>No codes found</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoRow: {
    paddingVertical: 4,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  resultItem: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  noResults: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
});
