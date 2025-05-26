<template>
    <div class="flex flex-col flex-grow">
        <div class="flex-grow bg-gray-700 flex items-center justify-center relative p-4">
          <div class="w-64 h-64 sm:w-80 sm:h-80 border-4 border-dashed border-gray-500/70 rounded-lg flex flex-col items-center justify-center p-4 text-center">
              <svg class="w-16 h-16 text-gray-500/80 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <!-- <p v-if="cameraError" class="text-red-400 text-sm mb-2">{{ cameraError }}</p> -->
              <p class="text-gray-400/90 text-sm">Ready to scan or take a photo.</p>
          </div>
        </div>
        <div 
          class="bg-gray-900/80 p-4 backdrop-blur-sm flex-shrink-0"
          :style="{ paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 1rem)` }"
        >
          <p class="text-center text-sm text-gray-300 mb-4">Choose scan method:</p>
          <div class="flex justify-around items-center">
            <button @click="activateBarcodeScanner" class="flex flex-col items-center text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10" aria-label="Scan Barcode with Camera">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              <span class="text-xs font-medium">Scan Barcode</span>
            </button>
            <button @click="activateDirectBarcodeInput" class="flex flex-col items-center text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10" aria-label="Enter Barcode Manually">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11H2V9H3V5C3 3.9 3.9 3 5 3H9V5H5V9H9V11H5V15H9V17H5C3.9 17 3 16.1 3 15V11ZM19 17H15V15H19V11H15V9H19V5H15V3H19C20.1 3 21 3.9 21 5V9H22V11H21V15C21 16.1 20.1 17 19 17ZM13 15H11V9H13V15Z"></path></svg>
              <span class="text-xs font-medium">Enter Manually</span>
            </button>
            <button @click="activatePhotoTaker" class="flex flex-col items-center text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10" aria-label="Take Photo">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span class="text-xs font-medium">Product Photo</span>
            </button>
          </div>
        </div>
    </div>

    <!-- <div v-if="scanStore.currentStage === 'idle_choice' && !isCameraActive && !isCameraViewActive" class="flex flex-col flex-grow"></div> -->
</template>

<script setup lang="ts">
interface Props {
    activateBarcodeScanner: () => void;
    activateDirectBarcodeInput: () => void;
    activatePhotoTaker: () => void;
}

const props = defineProps<Props>();
</script>