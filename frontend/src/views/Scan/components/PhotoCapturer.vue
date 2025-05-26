<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-4 sm:p-0 h-full justify-center">
    <!-- Camera Preview -->
    <div class="relative w-full rounded-xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/3]">
      <video
        ref="videoRef"
        class="w-full h-full object-cover"
        autoplay
        playsinline
        muted
      />
      
      <!-- Loading State -->
      <div v-if="isInitializing" class="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
        <div class="text-center">
          <div class="w-10 h-10 border-4 border-white/30 border-t-white rounded-full spinner mx-auto mb-4"></div>
          <p class="text-sm">Initializing camera...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-red-600/90 text-white">
        <div class="text-center p-8">
          <h3 class="text-xl font-semibold mb-4">Camera Error</h3>
          <p class="text-sm opacity-90 mb-6">{{ error }}</p>
          <button 
            @click="initializeCamera" 
            class="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="flex items-center gap-4">
      <button
        @click="capturePhoto"
        :disabled="!isCameraReady || isCapturing"
        class="w-20 h-20 sm:w-24 sm:h-24 border-4 border-blue-500 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:border-blue-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        :class="{ 'border-green-500 capturing': isCapturing }"
      >
        <div class="text-center">
          <span v-if="isCapturing" class="text-xs sm:text-sm font-semibold text-gray-700">Processing...</span>
          <span v-else class="text-sm sm:text-base font-semibold text-gray-700">📸 Capture</span>
        </div>
      </button>
      
      <!-- Optional: Switch Camera Button
      <button
        v-if="availableCameras.length > 1"
        @click="switchCamera"
        :disabled="!isCameraReady"
        class="px-4 py-3 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        🔄 Switch
      </button> -->
      <button
        @click="props.cancelCaptureCallback"
        class="px-4 py-3 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        ❌ Cancel
      </button>
    </div>
    
    <!-- Optional: Preview Canvas (hidden, used for capture) -->
    <canvas
      ref="canvasRef"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Types
export interface CapturedPhoto {
  data: string // Base64 image data
  timestamp: number
  dimensions: {
    width: number
    height: number
  }
  mimeType: string
  size: number // Approximate size in bytes
}

export interface CameraError {
  code: string
  message: string
}

export type OnCaptureCallback = (photo: CapturedPhoto) => Promise<void> | void

// Props
interface Props {
  onCapture: OnCaptureCallback
  cancelCaptureCallback: () => void
  quality?: number // JPEG quality (0-1)
  maxWidth?: number
  maxHeight?: number
  facingMode?: 'user' | 'environment' // front or back camera
}

const props = withDefaults(defineProps<Props>(), {
  quality: 0.9,
  maxWidth: 1920,
  maxHeight: 1080,
  facingMode: 'environment'
})

// Refs
const videoRef = ref<HTMLVideoElement>()
const canvasRef = ref<HTMLCanvasElement>()
const stream = ref<MediaStream | null>(null)

// State
const isInitializing = ref(true)
const isCapturing = ref(false)
const error = ref<string>('')
const availableCameras = ref<MediaDeviceInfo[]>([])
const currentCameraIndex = ref(0)

// Computed
const isCameraReady = computed(() => 
  !isInitializing.value && !error.value && stream.value
)

// Methods
const initializeCamera = async (): Promise<void> => {
  try {
    isInitializing.value = true
    error.value = ''
    
    // Stop existing stream
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
    }
    
    // Get available cameras
    await getCameraDevices()
    
    // Request camera access
    const videoConstraints: MediaTrackConstraints = {
      facingMode: props.facingMode,
      width: { ideal: props.maxWidth },
      height: { ideal: props.maxHeight }
    }
    
    // If we have multiple cameras and user selected one
    if (availableCameras.value.length > 0 && currentCameraIndex.value > 0) {
      const selectedCamera = availableCameras.value[currentCameraIndex.value]
      videoConstraints.deviceId = { exact: selectedCamera.deviceId }
      // Remove facingMode when using specific deviceId to avoid conflicts
      delete videoConstraints.facingMode
    }
    
    const constraints: MediaStreamConstraints = {
      video: videoConstraints,
      audio: false
    }
    
    stream.value = await navigator.mediaDevices.getUserMedia(constraints)
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
    
  } catch (err) {
    console.error('Camera initialization failed:', err)
    
    if (err instanceof Error) {
      if (err.name === 'NotAllowedError') {
        error.value = 'Camera access denied. Please allow camera permissions.'
      } else if (err.name === 'NotFoundError') {
        error.value = 'No camera found on this device.'
      } else if (err.name === 'NotReadableError') {
        error.value = 'Camera is already in use by another application.'
      } else {
        error.value = `Camera error: ${err.message}`
      }
    } else {
      error.value = 'Unknown camera error occurred.'
    }
  } finally {
    isInitializing.value = false
  }
}

const getCameraDevices = async (): Promise<void> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableCameras.value = devices.filter(device => device.kind === 'videoinput')
  } catch (err) {
    console.warn('Could not enumerate camera devices:', err)
  }
}

const switchCamera = async (): Promise<void> => {
  if (availableCameras.value.length <= 1) return
  
  currentCameraIndex.value = (currentCameraIndex.value + 1) % availableCameras.value.length
  await initializeCamera()
}

const capturePhoto = async (): Promise<void> => {
  if (!videoRef.value || !canvasRef.value || !isCameraReady.value) {
    console.error('Camera not ready for capture')
    return
  }
  
  try {
    isCapturing.value = true
    
    const video = videoRef.value
    const canvas = canvasRef.value
    const context = canvas.getContext('2d')
    
    if (!context) {
      throw new Error('Could not get canvas context')
    }
    
    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', props.quality)
    
    // Calculate approximate size
    const base64Length = imageData.length - 'data:image/jpeg;base64,'.length
    const sizeInBytes = Math.round((base64Length * 3) / 4)
    
    // Create photo object
    const photo: CapturedPhoto = {
      data: imageData,
      timestamp: Date.now(),
      dimensions: {
        width: canvas.width,
        height: canvas.height
      },
      mimeType: 'image/jpeg',
      size: sizeInBytes
    }
    console.log('Captured photo:', photo)
    
    // Call the callback
    await props.onCapture(photo)
    
  } catch (err) {
    console.error('Photo capture failed:', err)
    error.value = err instanceof Error ? err.message : 'Failed to capture photo'
  } finally {
    isCapturing.value = false
  }
}

const cleanup = (): void => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

// Lifecycle
onMounted(() => {
  initializeCamera()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.spinner {
  animation: spin 1s linear infinite;
}

.capturing {
  animation: pulse 1s infinite;
}
</style>