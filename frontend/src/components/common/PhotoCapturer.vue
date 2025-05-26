<template>
  <div class="flex flex-col h-full w-full bg-black text-white relative items-center justify-center">
    <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
      <video
        ref="videoRef"
        class="w-full h-full object-cover" autoplay
        playsinline
        muted
        aria-label="Live camera feed"
      />
      
      <div v-if="isInitializing" class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-20">
        <div class="w-10 h-10 border-4 border-white/30 border-t-white rounded-full spinner mx-auto mb-4"></div>
        <p class="text-sm">Initializing camera...</p>
      </div>
      
      <div v-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-red-700/90 text-white z-20">
        <div class="text-center p-8">
          <svg class="w-12 h-12 mx-auto mb-3 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="text-xl font-semibold mb-3">Camera Error</h3>
          <p class="text-sm opacity-90 mb-6">{{ error }}</p>
          <button 
            @click="initializeCamera" 
            class="bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="isCameraReady" class="absolute inset-0 flex flex-col justify-between items-center z-10 pointer-events-none">
      <div 
        class="w-full flex justify-start p-3 sm:p-4 pointer-events-auto"
        :style="{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 0.75rem)` }"
      >
        <button
          @click="props.cancelCaptureCallback"
          class="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-white/80 transition-colors"
          aria-label="Cancel photo capture"
        >
          <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <div 
        class="w-full flex justify-center p-4 pointer-events-auto"
        :style="{ paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 1rem)` }"
      >
        <button
          @click="capturePhoto"
          :disabled="isCapturing"
          class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center ring-4 ring-white/50 focus:outline-none focus:ring-flavorpal-green transition-all duration-200 ease-in-out hover:opacity-80 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'ring-flavorpal-green capturing-ring': isCapturing }"
          aria-label="Capture photo"
        >
          <div 
            class="w-[85%] h-[85%] bg-white rounded-full border-2 border-gray-500/50 transition-all duration-100"
            :class="{ 'scale-90 bg-gray-200': isCapturing }"
          ></div>
          <span v-if="isCapturing" class="absolute text-xs font-semibold text-gray-700 spinner-text">Wait</span>
        </button>
      </div>
    </div>
    
    <canvas ref="canvasRef" class="hidden" />
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