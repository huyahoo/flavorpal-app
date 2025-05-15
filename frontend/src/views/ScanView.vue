<template>
  <div class="flex flex-col min-h-screen bg-gray-800 text-white relative overflow-hidden">
    <header class="absolute top-0 left-0 z-20 p-3 sm:p-4">
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

    <div class="flex-grow bg-gray-700 flex items-center justify-center relative p-4">
      <div class="w-64 h-64 sm:w-80 sm:h-80 border-4 border-dashed border-gray-500/70 rounded-lg flex flex-col items-center justify-center p-4 text-center">
          <svg class="w-16 h-16 text-gray-500/80 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <p class="text-gray-400/90 text-sm">Align barcode or product within the frame.</p>
          <p class="text-xs text-gray-500/70 mt-1">(Camera feed will appear here)</p>
      </div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-48 sm:w-[26rem] sm:h-72 pointer-events-none">
          <div class="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-l-4 border-white/70 rounded-tl-lg"></div>
          <div class="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-r-4 border-white/70 rounded-tr-lg"></div>
          <div class="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-l-4 border-white/70 rounded-bl-lg"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-r-4 border-white/70 rounded-br-lg"></div>
      </div>
    </div>

    <div class="bg-gray-900/80 p-4 backdrop-blur-sm flex-shrink-0">
      <p class="text-center text-sm text-gray-300 mb-4">Choose scan method:</p>
      <div class="flex justify-around items-center">
        <button 
          @click="handleScanTypeSelection('barcode')" 
          class="flex flex-col items-center text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10"
          aria-label="Scan Barcode"
        >
          <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          <span class="text-xs font-medium">Barcode Scan</span>
        </button>
        <button 
          @click="handleScanTypeSelection('photo')" 
          class="flex flex-col items-center text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10"
          aria-label="Take Photo"
        >
          <svg class="w-10 h-10 sm:w-12 sm:h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span class="text-xs font-medium">Take Photo</span>
        </button>
      </div>
    </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
// Import scanStore if you were to use its reset or other simple actions here
// import { useScanStore } from '../store/scanStore'; 
import { useRouter } from 'vue-router';

// const scanStore = useScanStore(); // Not strictly needed for this simplified version, unless for reset
const router = useRouter();

const goBack = () => {
  // scanStore.resetScanView(); // If you had a reset action for any minor state
  if (window.history.state.back) {
    router.go(-1);
  } else {
    router.push({ name: 'Home' }); // Fallback to Home
  }
};

const handleScanTypeSelection = (inputType: 'barcode' | 'photo') => {
  console.log(`Scan type selected: ${inputType}`);
  // Placeholder for initiating the scan process.
  // In the full version, this would call:
  // scanStore.initiateScanProcess(inputType);
  alert(`Initiating ${inputType} scan... (functionality to be implemented)`);
  // For now, we'll just log it and maybe show an alert.
  // The UI will not change to 'analyzing' or 'result' in this simplified version.
};

onMounted(() => {
  console.log('ScanView mounted. Initial state: idle_choice.');
  // scanStore.resetScanView(); // Ensure clean state if using store
});

onUnmounted(() => {
  // Optional: if any background processes were started for this view
  // if (scanStore.isLoadingAnalysis) {
  //   scanStore.cancelAnalysis();
  // }
});

</script>

<style scoped>
/* The 'h-full' on the root div of this component relies on its parent 
  in App.vue (<main class="flex-grow ...">) to provide the available height.
  Ensure App.vue's main container is set up with flex-direction column and its
  main content area has flex-grow.
*/
</style>
