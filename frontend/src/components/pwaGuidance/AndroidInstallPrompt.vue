<template>
  <div v-if="showInstallPromptModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300 ease-in-out"
    aria-labelledby="android-install-modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-6 space-y-5 transform transition-all duration-300 ease-in-out scale-100">
      <div class="flex justify-between items-start">
        <h2 id="android-install-modal-title" class="text-xl font-semibold text-flavorpal-gray-dark">
          Install on Your Android Device
        </h2>
        <button @click="dismissInstallPrompt" class="text-gray-400 hover:text-gray-600 p-1 -mr-2 -mt-1 rounded-full focus:outline-none focus:ring-2 focus:ring-flavorpal-green-light" aria-label="Close instructions">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <p class="text-sm text-flavorpal-gray">
        For quick access and the best experience, install this app on your home screen.
        Ensure you are using the <strong>Chrome</strong> browser. 
      </p>

      <ol class="space-y-4 text-sm text-flavorpal-gray-dark">
        <li class="flex items-start space-x-3">
          <span class="flex-shrink-0 bg-flavorpal-green text-white h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ring-2 ring-flavorpal-green-light">1</span>
          <span class="leading-relaxed">
            tap the <strong>menu icon</strong>
            <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5 mx-0.5 text-gray-700 align-middle relative -top-px" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            in the top-right corner.<br>
          </span>
        </li>
        <li class="flex items-start space-x-3">
          <span class="flex-shrink-0 bg-flavorpal-green text-white h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ring-2 ring-flavorpal-green-light">2</span>
          <span class="leading-relaxed">
            Find and tap <strong>"Add to Home screen"</strong>
            <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5 ml-1 text-gray-700 align-middle relative -top-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            in the menu.<br>
          </span>
        </li>
        <li class="flex items-start space-x-3">
          <span class="flex-shrink-0 bg-flavorpal-green text-white h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ring-2 ring-flavorpal-green-light">3</span>
          <span class="leading-relaxed">
            A confirmation pop-up will appear. Tap <strong>"Install"</strong> to add the app to your home screen.
          </span>
        </li>
      </ol>

      <button @click="dismissInstallPrompt" class="w-full mt-5 bg-flavorpal-green hover:bg-flavorpal-green-dark focus:ring-2 focus:ring-offset-2 focus:ring-flavorpal-green text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150 ease-in-out">
        Got it!
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showInstallPromptModal = ref(false);

// Helper function to detect Android
const isAndroid = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android/i.test(userAgent);
};

// Helper function to detect if the PWA is in standalone mode
const isInStandaloneMode = () => {
  return (window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
};

// Check if the user has already seen/dismissed the prompt
const hasSeenInstallPrompt = () => {
  try {
    return localStorage.getItem('flavorpal_hasSeenAndroidInstallPrompt') === 'true';
  } catch (e) {
    console.warn('Could not access localStorage for Android install prompt status.');
    return false; // Assume not seen if localStorage fails
  }
};

// Mark that the user has seen/dismissed the prompt
const setSeenInstallPrompt = () => {
  try {
    localStorage.setItem('flavorpal_hasSeenAndroidInstallPrompt', 'true');
  } catch (e) {
    console.warn('Could not set localStorage for Android install prompt status.');
  }
};

onMounted(() => {
  if (isAndroid() && !isInStandaloneMode() && !hasSeenInstallPrompt()) {
    setTimeout(() => {
      // Check again, in case `beforeinstallprompt` was handled and PWA was installed quickly
      if (!isInStandaloneMode()) {
         showInstallPromptModal.value = true;
      }
    }, 1500); // Delay to allow `beforeinstallprompt` to potentially fire first
  }
});

const dismissInstallPrompt = () => {
  showInstallPromptModal.value = false;
  setSeenInstallPrompt();
};
</script>

<style scoped>
.align-middle {
  vertical-align: middle;
}
</style>