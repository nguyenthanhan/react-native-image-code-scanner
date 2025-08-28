package com.imagecodescanner

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import com.imagecodescanner.NativeImageCodeScannerSpec
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.io.File

@ReactModule(name = ImageCodeScannerModule.NAME)
class ImageCodeScannerModule(reactContext: ReactApplicationContext) :
  NativeImageCodeScannerSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  private fun scaleBitmapIfNeeded(bitmap: Bitmap): Bitmap {
    val maxSize = 1024 // Max width or height
    val width = bitmap.width
    val height = bitmap.height
    
    if (width <= maxSize && height <= maxSize) {
      return bitmap
    }
    
    val scale = if (width > height) {
      maxSize.toFloat() / width
    } else {
      maxSize.toFloat() / height
    }
    
    val newWidth = (width * scale).toInt()
    val newHeight = (height * scale).toInt()
    
    return Bitmap.createScaledBitmap(bitmap, newWidth, newHeight, true)
  }
  
  private fun enhanceContrast(bitmap: Bitmap): Bitmap {
    val width = bitmap.width
    val height = bitmap.height
    val config = bitmap.config ?: Bitmap.Config.ARGB_8888
    val enhancedBitmap = Bitmap.createBitmap(width, height, config)
    
    val canvas = Canvas(enhancedBitmap)
    val paint = Paint()
    
    // Increase contrast
    val colorMatrix = ColorMatrix()
    val contrast = 2f // Increase contrast by 2x
    val brightness = -50f // Decrease brightness slightly
    val scale = contrast
    val translate = (-.5f * scale + .5f) * 255f + brightness
    
    colorMatrix.set(floatArrayOf(
      scale, 0f, 0f, 0f, translate,
      0f, scale, 0f, 0f, translate,
      0f, 0f, scale, 0f, translate,
      0f, 0f, 0f, 1f, 0f
    ))
    
    paint.colorFilter = ColorMatrixColorFilter(colorMatrix)
    canvas.drawBitmap(bitmap, 0f, 0f, paint)
    
    return enhancedBitmap
  }
  
  private fun convertToGrayscale(bitmap: Bitmap): Bitmap {
    val width = bitmap.width
    val height = bitmap.height
    val config = bitmap.config ?: Bitmap.Config.ARGB_8888
    val grayscaleBitmap = Bitmap.createBitmap(width, height, config)
    
    val canvas = Canvas(grayscaleBitmap)
    val paint = Paint()
    
    val colorMatrix = ColorMatrix()
    colorMatrix.setSaturation(0f)
    
    paint.colorFilter = ColorMatrixColorFilter(colorMatrix)
    canvas.drawBitmap(bitmap, 0f, 0f, paint)
    
    return grayscaleBitmap
  }
  
  private fun rotateBitmap(bitmap: Bitmap, degrees: Float): Bitmap {
    val matrix = Matrix()
    matrix.postRotate(degrees)
    return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
  }
  
  override fun scanFromPath(path: String, formats: ReadableArray, options: ReadableMap, promise: Promise) {
    android.util.Log.d("ImageCodeScanner", "scanFromPath called with path: $path")
    android.util.Log.d("ImageCodeScanner", "Starting scan with all preprocessing options enabled")
    
    val cleanPath = path.replace("file://", "")
    val imgFile = File(cleanPath)
    
    if (!imgFile.exists()) {
      promise.reject("INVALID_PATH", "Image file does not exist: $path", null)
      return
    }

    try {
      // Load and validate bitmap with sampling if too large
      val bitmapOptions = BitmapFactory.Options()
      bitmapOptions.inJustDecodeBounds = true
      BitmapFactory.decodeFile(imgFile.absolutePath, bitmapOptions)
      
      // Calculate sample size if image is too large
      var sampleSize = 1
      val maxDimension = 2048
      while (bitmapOptions.outWidth / sampleSize > maxDimension || bitmapOptions.outHeight / sampleSize > maxDimension) {
        sampleSize *= 2
      }
      
      bitmapOptions.inJustDecodeBounds = false
      bitmapOptions.inSampleSize = sampleSize
      
      val originalBitmap = BitmapFactory.decodeFile(imgFile.absolutePath, bitmapOptions)
      if (originalBitmap == null) {
        promise.reject("INVALID_IMAGE", "Cannot decode image file: $path", null)
        return
      }
      
      // Scale if needed for better processing
      val bitmap = scaleBitmapIfNeeded(originalBitmap)

      // Convert formats array to ML Kit barcode formats
      val barcodeFormats = mutableListOf<Int>()
      
      for (i in 0 until formats.size()) {
        val format = formats.getString(i)
        when (format) {
          "QR_CODE" -> barcodeFormats.add(Barcode.FORMAT_QR_CODE)
          "CODE_128" -> barcodeFormats.add(Barcode.FORMAT_CODE_128)
          "CODE_39" -> barcodeFormats.add(Barcode.FORMAT_CODE_39)
          "CODE_93" -> barcodeFormats.add(Barcode.FORMAT_CODE_93)
          "EAN_13" -> barcodeFormats.add(Barcode.FORMAT_EAN_13)
          "EAN_8" -> barcodeFormats.add(Barcode.FORMAT_EAN_8)
          "UPC_A" -> barcodeFormats.add(Barcode.FORMAT_UPC_A)
          "UPC_E" -> barcodeFormats.add(Barcode.FORMAT_UPC_E)
          "PDF_417" -> barcodeFormats.add(Barcode.FORMAT_PDF417)
          "DATA_MATRIX" -> barcodeFormats.add(Barcode.FORMAT_DATA_MATRIX)
          "AZTEC" -> barcodeFormats.add(Barcode.FORMAT_AZTEC)
          "ITF" -> barcodeFormats.add(Barcode.FORMAT_ITF)
          "CODABAR" -> barcodeFormats.add(Barcode.FORMAT_CODABAR)
          else -> {
            // Log unsupported format but continue
            android.util.Log.w("ImageCodeScanner", "Unsupported format: $format")
          }
        }
      }
      
      // If no formats specified, default to QR_CODE
      if (barcodeFormats.isEmpty()) {
        barcodeFormats.add(Barcode.FORMAT_QR_CODE)
      }
      
      // Configure barcode scanner with specified formats
      val scannerOptions = BarcodeScannerOptions.Builder()
        .setBarcodeFormats(barcodeFormats.first(), *barcodeFormats.drop(1).toIntArray())
        .build()

      // List of images to try with different preprocessing - always try all options
      val imagesToTry = mutableListOf<Pair<String, Bitmap>>()
      imagesToTry.add("Original" to bitmap)
      
      // Always add grayscale version
      try {
        imagesToTry.add("Grayscale" to convertToGrayscale(bitmap))
        android.util.Log.d("ImageCodeScanner", "Added grayscale version")
      } catch (e: Exception) {
        android.util.Log.w("ImageCodeScanner", "Failed to create grayscale: ${e.message}")
      }
      
      // Always add enhanced contrast version
      try {
        imagesToTry.add("Enhanced contrast" to enhanceContrast(bitmap))
        android.util.Log.d("ImageCodeScanner", "Added contrast enhanced version")
      } catch (e: Exception) {
        android.util.Log.w("ImageCodeScanner", "Failed to enhance contrast: ${e.message}")
      }
      
      // Always add rotated versions
      try {
        imagesToTry.add("Rotated 90°" to rotateBitmap(bitmap, 90f))
        imagesToTry.add("Rotated 180°" to rotateBitmap(bitmap, 180f))
        imagesToTry.add("Rotated 270°" to rotateBitmap(bitmap, 270f))
        android.util.Log.d("ImageCodeScanner", "Added rotated versions")
      } catch (e: Exception) {
        android.util.Log.w("ImageCodeScanner", "Failed to rotate: ${e.message}")
      }
      
      var currentIndex = 0
      
      fun tryNextImage() {
        if (currentIndex >= imagesToTry.size) {
          // No more images to try, return empty result
          val arr = Arguments.fromList(emptyList<String>())
          promise.resolve(arr)
          return
        }
        
        val (description, currentBitmap) = imagesToTry[currentIndex]
        currentIndex++
        
        val image = InputImage.fromBitmap(currentBitmap, 0)
        val scanner = BarcodeScanning.getClient(scannerOptions)
        
        scanner.process(image)
          .addOnSuccessListener { barcodes ->
            try {
              if (barcodes.isNotEmpty()) {
                // Found barcodes, process and return
                val codes = barcodes
                  .mapNotNull { barcode -> 
                    val value = barcode.displayValue ?: barcode.rawValue
                    value
                  }
                  .filter { it.isNotEmpty() }
                
                val arr = Arguments.fromList(codes)
                promise.resolve(arr)
              } else {
                // No barcodes found, try next preprocessing
                tryNextImage()
              }
            } catch (e: Exception) {
              android.util.Log.e("ImageCodeScanner", "Error processing results for $description", e)
              tryNextImage()
            } finally {
              scanner.close()
            }
          }
          .addOnFailureListener { exception ->
            android.util.Log.e("ImageCodeScanner", "Scan failed for $description: ${exception.message}")
            scanner.close()
            tryNextImage()
          }
      }
      
      // Start the scanning process
      tryNextImage()
        
    } catch (e: Exception) {
      promise.reject("IMAGE_LOAD_ERROR", "Error loading image: ${e.message}", e)
    }
  }

  companion object {
    const val NAME = "ImageCodeScanner"
  }
}
