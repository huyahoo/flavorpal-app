<template>
  <div class="relative flex flex-grow items-center justify-center bg-black">
    <video
      ref="videoElementRef"
      autoplay
      playsinline
      class="h-full w-full object-contain"
    ></video>
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 aspect-[4/3] w-[80%] -translate-x-1/2 -translate-y-1/2 transform sm:w-[70%] sm:max-w-md"
    >
      <div
        class="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-white opacity-75 sm:h-10 sm:w-10"
      ></div>
      <div
        class="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-white opacity-75 sm:h-10 sm:w-10"
      ></div>
      <div
        class="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 border-white opacity-75 sm:h-10 sm:w-10"
      ></div>
      <div
        class="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-4 border-r-4 border-white opacity-75 sm:h-10 sm:w-10"
      ></div>
    </div>
    <p
      v-if="cameraError"
      class="absolute left-1/2 z-10 -translate-x-1/2 rounded-md bg-red-600/80 px-3 py-1.5 text-xs text-white shadow-lg"
      :style="{ top: `calc(env(safe-area-inset-top, 0px) + 1rem)` }"
    >
      {{ cameraError }}
    </p>

    <button
      @click="stopScanCallback"
      class="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-red-600 px-8 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-red-700"
      :style="{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 1.5rem)` }"
    >
      Cancel Scan
    </button>

    
  </div>
  <!-- <div v-if="isCameraActive" class="flex-grow relative flex items-center justify-center bg-black"></div> -->
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { BrowserMultiFormatReader, NotFoundException, BarcodeFormat, Result } from '@zxing/library';

interface Props {
  barcodeDetectedCallback: (barcode: string) => void
  stopScanCallback: () => void
}

const props = defineProps<Props>()

const cameraError = ref<string | null>(null)
const videoElementRef = ref<HTMLVideoElement | null>(null)
const isCameraActive = ref(false)
const codeReader = new BrowserMultiFormatReader();
const stream = ref<MediaStream | null>(null)

const initializeScanner = async () => {
  cameraError.value = null;
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 320 }, 
        height: { ideal: 480 }
      } 
    });
    isCameraActive.value = true; 
    
    await nextTick(); 

    if (videoElementRef.value && stream) {
      console.log('ZXing: Starting continuous scan from video stream...');
      codeReader.decodeFromStream(stream.value, videoElementRef.value, (result: Result | undefined, err: any) => { 
        if (result) {
          console.log('ZXing: Barcode detected -', result.getText());
          props.barcodeDetectedCallback(result.getText());
        }
        if (err && !(err instanceof NotFoundException)) { 
          console.error('ZXing: Decoding error -', err);
        }
      }).catch((err: Error) => {
        console.error('ZXing: Error starting video stream decoding -', err);
        cameraError.value = `Camera scan error: ${err.message}. Try manual input.`;
        props.stopScanCallback(); 
      });
    } else {
        throw new Error("Video element or stream not available for ZXing.");
    }
  } catch (err: any) {
    console.error('Error accessing camera or starting ZXing:', err);
    cameraError.value = `Could not access camera: ${err.name}. Ensure permission or try manual input.`;
    isCameraActive.value = false;
    props.stopScanCallback();
  }
};

const cleanupScanner = () => {
  console.log('Cleaning up ZXing scanner...');
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  isCameraActive.value = false;
  cameraError.value = null;
};

// Bind to lifecycle hooks
onMounted(() => {
  initializeScanner();
});

onBeforeUnmount(() => {
  cleanupScanner();
});

</script>
