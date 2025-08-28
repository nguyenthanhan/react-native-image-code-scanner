module.exports = {
  dependency: {
    platforms: {
      ios: {
        podspecPath: './RNImageCodeScanner.podspec',
      },
      android: {
        sourceDir: './android',
        manifestPath: './android/src/main/AndroidManifest.xml',
      },
    },
  },
};
