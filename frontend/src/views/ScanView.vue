<template>
  <div class="flex flex-col min-h-screen bg-gray-800 text-white relative overflow-hidden">
    <header 
      v-if="!isCameraActive && scanStore.currentStage !== 'analyzing'" 
      class="absolute top-0 left-0 z-30 p-3 sm:p-4"
    >
      <button 
        @click="goBack" 
        class="p-2 rounded-full hover:bg-white/20 focus:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50" 
        aria-label="Go back"
      >
        <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    </header>

    <div class="flex-grow flex flex-col">

      <div v-if="isCameraActive" class="flex-grow relative flex items-center justify-center bg-black">
        <video ref="videoElementRef" autoplay playsinline class="w-full min-h-screen object-contain"></video>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-[4/3] sm:w-[70%] sm:max-w-md pointer-events-none">
            <div class="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-l-4 border-white rounded-tl-lg opacity-75"></div>
            <div class="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-r-4 border-white rounded-tr-lg opacity-75"></div>
            <div class="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-l-4 border-white rounded-bl-lg opacity-75"></div>
            <div class="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-r-4 border-white rounded-br-lg opacity-75"></div>
        </div>
         <p v-if="cameraError" class="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-red-600/80 text-white text-xs px-3 py-1.5 rounded-md shadow-lg">{{ cameraError }}</p>
        <button @click="stopCameraScanAndReset" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-lg text-base">
            Cancel Scan
        </button>
      </div>

      <div v-if="scanStore.currentStage === 'idle_choice' && !isCameraActive" class="flex flex-col min-h-screen">
        <div class="flex-grow bg-gray-700 flex items-center justify-center relative p-4">
          <div class="w-64 h-64 sm:w-80 sm:h-80 border-4 border-dashed border-gray-500/70 rounded-lg flex flex-col items-center justify-center p-4 text-center">
              <svg class="w-16 h-16 text-gray-500/80 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <p v-if="cameraError" class="text-red-400 text-sm mb-2">{{ cameraError }}</p>
              <p class="text-gray-400/90 text-sm">Ready to scan or take a photo.</p>
          </div>
        </div>
        <div class="bg-gray-900/80 p-4 backdrop-blur-sm flex-shrink-0">
          <p class="text-center text-sm text-gray-300 mb-4">Choose scan method:</p>
          <div class="flex justify-around items-center">
            <button @click="attemptStartCameraScanWithZXing" class="flex flex-col items-center text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10" aria-label="Scan Barcode with Camera">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              <span class="text-xs font-medium">Scan Barcode</span>
            </button>
            <button @click="scanStore.prepareBarcodeScan()" class="flex flex-col items-center text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10" aria-label="Enter Barcode Manually">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11H2V9H3V5C3 3.9 3.9 3 5 3H9V5H5V9H9V11H5V15H9V17H5C3.9 17 3 16.1 3 15V11ZM19 17H15V15H19V11H15V9H19V5H15V3H19C20.1 3 21 3.9 21 5V9H22V11H21V15C21 16.1 20.1 17 19 17ZM13 15H11V9H13V15Z"></path></svg>
              <span class="text-xs font-medium">Enter Manually</span>
            </button>
            <button @click="handlePhotoScan" class="flex flex-col items-center text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10" aria-label="Take Photo">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span class="text-xs font-medium">Product Photo</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="scanStore.currentStage === 'inputting_barcode' && !isCameraActive" class="flex flex-col min-h-screen items-center justify-center p-6 bg-gray-700">
          <h2 class="text-xl font-semibold mb-4 text-white">Enter Barcode Manually</h2>
          <form @submit.prevent="submitBarcode" class="w-full max-w-sm">
              <input 
                  type="text"
                  v-model="scanStore.scannedBarcodeValue"
                  placeholder="Type or paste barcode"
                  class="w-full px-4 py-3 mb-4 border border-gray-500 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green"
                  ref="barcodeInputRef"
                  required
              />
              <div class="flex space-x-3">
                  <button type="button" @click="scanStore.resetScanView()" class="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
                      Cancel
                  </button>
                  <button type="submit" :disabled="!scanStore.scannedBarcodeValue.trim()" class="flex-1 bg-flavorpal-green hover:bg-flavorpal-green-dark text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50">
                      Submit
                  </button>
              </div>
          </form>
      </div>

      <div v-if="scanStore.currentStage === 'analyzing'" class="absolute inset-0 bg-gray-800/95 backdrop-blur-sm flex flex-col items-center justify-center z-40 p-6">
          <svg class="animate-spin h-12 w-12 text-flavorpal-green mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-xl font-semibold text-white mb-3">Analyzing Product...</p>
          <p class="text-sm text-gray-300 mb-8 text-center">Please wait while we fetch and analyze product information.</p>
          <button @click="scanStore.cancelAnalysis()" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
              Cancel Analysis
          </button>
      </div>

      <div v-if="scanStore.currentStage === 'result_reviewed' || scanStore.currentStage === 'result_new'" 
           class="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 max-w-md mx-auto"
           aria-live="polite">
        <div class="bg-white text-flavorpal-gray-dark p-5 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up space-y-4">
          <div v-if="scanStore.productForDisplay" class="relative w-full aspect-[16/9] bg-flavorpal-gray-light rounded-lg overflow-hidden flex items-center justify-center mb-3">
              <div 
                v-if="scanStore.productForDisplay.isReviewed" 
                class="absolute top-0 left-0 z-10"
                aria-label="Item has been reviewed"
              >
                <div class="w-24 h-24 overflow-hidden">
                  <div class="absolute transform -rotate-45 bg-flavorpal-green text-white text-center shadow-md"
                    style="left: -30px; top: 12px; width: 110px; font-size: 0.7rem; padding: 2px 0;" 
                    > 
                    Reviewed
                  </div>
                </div>
              </div>
              <img 
                v-if="scanStore.productForDisplay.imageUrl" 
                :src="scanStore.productForDisplay.imageUrl" 
                :alt="scanStore.productForDisplay.name" 
                class="w-full min-h-screen object-contain" 
                onerror="this.style.display='none'; this.nextSibling.style.display='flex';"
              />
              <svg 
                v-else 
                class="w-12 h-12 text-gray-400" 
                style="display: flex;"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>

          <div v-if="scanStore.currentStage === 'result_reviewed' && scanStore.productForDisplay">
            <h3 class="text-lg font-semibold mb-1">{{ scanStore.productForDisplay.name }}</h3>
            <StarRating v-if="typeof scanStore.productForDisplay.userRating === 'number'" :rating="scanStore.productForDisplay.userRating" starSize="w-5 h-5" class="mb-1"/>
            <p v-if="scanStore.productForDisplay.dateReviewed" class="text-xs text-gray-500 mb-2">Reviewed on: {{ scanStore.productForDisplay.dateReviewed }}</p>
            <p class="text-sm text-gray-600 line-clamp-3 mb-3">{{ scanStore.productForDisplay.userNotes || 'You have reviewed this item.' }}</p>
            <div class="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <button @click="handleScanAnother" class="w-full sm:w-auto text-sm text-gray-500 hover:text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-100 border border-gray-300 sm:border-transparent transition-colors">Scan Another</button>
              <button @click="handleNavigateToProductDetail" class="w-full sm:w-auto bg-flavorpal-green hover:bg-flavorpal-green-dark text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors">
                View Full Review &rarr;
              </button>
            </div>
          </div>

          <div v-if="scanStore.currentStage === 'result_new' && scanStore.productForDisplay">
            <h3 class="text-lg font-semibold mb-1">{{ scanStore.productForDisplay.name }}</h3>
            <p class="text-sm text-gray-600 mb-1 line-clamp-2">{{ scanStore.productForDisplay.aiHealthSummary || 'Product information processed.' }}</p>
            <div v-if="scanStore.productForDisplay.aiHealthConclusion" class="flex items-center mb-3">
                  <span class="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0" :class="getConclusionColor(scanStore.productForDisplay.aiHealthConclusion)" aria-hidden="true"></span>
                  <span class="text-xs font-medium" :class="getConclusionTextColor(scanStore.productForDisplay.aiHealthConclusion)">
                      {{ getConclusionText(scanStore.productForDisplay.aiHealthConclusion) }}
                  </span>
              </div>
            <div class="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <button @click="handleScanAnother" class="w-full sm:w-auto text-sm text-gray-500 hover:text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-100 border border-gray-300 sm:border-transparent transition-colors">Scan Another</button>
              <button 
                @click="handleNavigateToProductDetail" 
                class="w-full sm:w-auto bg-flavorpal-orange hover:bg-flavorpal-orange-dark text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors"
              >
                See Details &rarr; 
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="scanStore.currentStage === 'error'" class="absolute inset-0 bg-gray-800/95 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center">
          <svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-xl font-semibold text-white mb-2">Scan Failed</p>
          <p class="text-sm text-gray-300 mb-6">{{ scanStore.analysisError || 'An unknown error occurred.' }}</p>
          <button @click="scanStore.resetScanView()" class="bg-flavorpal-green hover:bg-flavorpal-green-dark text-white font-medium py-2.5 px-6 rounded-lg transition-colors"> Try Again </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports and script setup from artifact: flavorpal_scan_view_v4_zxing
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useScanStore } from '../store/scanStore';
import { useHistoryStore } from '../store/historyStore';
import { useRouter } from 'vue-router';
import StarRating from '@/components/common/StarRating.vue';
import type { AiHealthConclusion, ProductInteraction } from '../types'; 
import { BrowserMultiFormatReader, NotFoundException, BarcodeFormat, Result } from '@zxing/library';

const scanStore = useScanStore();
const historyStore = useHistoryStore();
const router = useRouter();

const videoElementRef = ref<HTMLVideoElement | null>(null);
const barcodeInputRef = ref<HTMLInputElement | null>(null);
const isCameraActive = ref(false); 
const cameraError = ref<string | null>(null);
const codeReader = new BrowserMultiFormatReader(); 
let stream: MediaStream | null = null;

const goBack = () => {
  stopCameraScanAndReset(); 
  if (window.history.state.back) {
    router.go(-1);
  } else {
    router.push({ name: 'Home' }); 
  }
};

watch(() => scanStore.currentStage, (newStage) => {
    if (newStage === 'inputting_barcode') {
        nextTick(() => { 
            barcodeInputRef.value?.focus();
        });
    }
    if (newStage === 'result_reviewed' || newStage === 'result_new' || newStage === 'error') {
        isCameraActive.value = false; 
    }
});

const submitBarcode = () => {
    if (scanStore.scannedBarcodeValue.trim()) {
        scanStore.initiateScanProcess('barcode'); 
    } else {
        alert("Please enter a barcode.");
    }
};

const handlePhotoScan = () => {
    isCameraActive.value = false; 
    scanStore.initiateScanProcess('photo');
};

const attemptStartCameraScanWithZXing = async () => {
  cameraError.value = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 640 }, 
        height: { ideal: 480 }
      } 
    });
    isCameraActive.value = true; 
    
    await nextTick(); 

    if (videoElementRef.value && stream) {
      console.log('ZXing: Starting continuous scan from video stream...');
      codeReader.decodeFromStream(stream, videoElementRef.value, (result: Result | undefined, err: any) => { 
        if (result) {
          console.log('ZXing: Barcode detected -', result.getText());
          handleBarcodeDetected(result.getText());
        }
        if (err && !(err instanceof NotFoundException)) { 
          console.error('ZXing: Decoding error -', err);
        }
      }).catch((err: Error) => {
        console.error('ZXing: Error starting video stream decoding -', err);
        cameraError.value = `Camera scan error: ${err.message}. Try manual input.`;
        stopCameraScanAndReset(); 
      });
    } else {
        throw new Error("Video element or stream not available for ZXing.");
    }
  } catch (err: any) {
    console.error('Error accessing camera or starting ZXing:', err);
    cameraError.value = `Could not access camera: ${err.name}. Ensure permission or try manual input.`;
    isCameraActive.value = false;
    scanStore.resetScanView(); 
  }
};


const handleBarcodeDetected = (barcodeValue: string) => {
  if (isCameraActive.value || scanStore.currentStage === 'idle_choice') { 
    console.log('Processing detected barcode:', barcodeValue);
    stopCameraStream(); 
    isCameraActive.value = false; 
    
    scanStore.scannedBarcodeValue = barcodeValue; 
    scanStore.initiateScanProcess('barcode', barcodeValue); 
  }
};

const stopCameraStream = () => {
  codeReader.reset(); 
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  if (videoElementRef.value) {
    videoElementRef.value.srcObject = null; 
  }
};

const stopCameraScanAndReset = () => {
  stopCameraStream();
  isCameraActive.value = false;
  scanStore.resetScanView(); 
};

const handleScanAnother = () => {
    scanStore.resetScanView(); 
    nextTick(() => { 
        attemptStartCameraScanWithZXing(); 
    });
};

const handleNavigateToProductDetail = () => {
    const productId = scanStore.prepareForProductDetail(); 
    if (productId) { 
        router.push({ name: 'ProductDetail', params: { id: productId } });
        // Do not reset scan view here, allow user to go back to the popup if they want
    }
};

onMounted(async () => {
  scanStore.resetScanView(); 
  if (historyStore.allProductInteractions.length === 0 && !historyStore.loadingInteractions) {
    await historyStore.loadProductInteractions();
  }
});

onUnmounted(() => {
  stopCameraScanAndReset(); 
  if (scanStore.isLoadingAnalysis && scanStore.currentStage === 'analyzing' && !isCameraActive.value) { 
    scanStore.cancelAnalysis();
  }
});

// --- AI Conclusion Styling Helpers ---
const getConclusionColor = (conclusion?: AiHealthConclusion): string => { 
  switch (conclusion) {
    case 'good': return 'bg-flavorpal-green';
    case 'caution': return 'bg-yellow-400';
    case 'avoid': return 'bg-red-500';
    case 'info_needed': return 'bg-blue-400';
    case 'error_analyzing': return 'bg-purple-500';
    case 'neutral': default: return 'bg-gray-400';
  }
};
const getConclusionTextColor = (conclusion?: AiHealthConclusion): string => { 
  switch (conclusion) {
    case 'good': return 'text-flavorpal-green-dark';
    case 'caution': return 'text-yellow-600';
    case 'avoid': return 'text-red-700';
    case 'info_needed': return 'text-blue-600';
    case 'error_analyzing': return 'text-purple-700';
    case 'neutral': default: return 'text-gray-600';
  }
};
const getConclusionText = (conclusion?: AiHealthConclusion): string => { 
  switch (conclusion) {
    case 'good': return 'Looks good for you';
    case 'caution': return 'Use with caution';
    case 'avoid': return 'Best to avoid';
    case 'info_needed': return 'More info needed';
    case 'error_analyzing': return 'Analysis Error';
    case 'neutral': return 'Neutral';
    default: return 'Analysis pending';
  }
};

</script>

<style scoped>
.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0.6; }
  to { transform: translateY(0); opacity: 1; }
}
.line-clamp-2, .line-clamp-3 {
  overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;
}
.line-clamp-2 { -webkit-line-clamp: 2; }
.line-clamp-3 { -webkit-line-clamp: 3; }
.min-h-screen { height: 100%; } 
.aspect-\[16\/9\] { 
  aspect-ratio: 16 / 9;
}
</style>
