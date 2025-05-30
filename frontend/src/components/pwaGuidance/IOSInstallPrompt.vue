<template>
  <div v-if="showInstallPromptModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300 ease-in-out"
    aria-labelledby="install-modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-6 space-y-5 transform transition-all duration-300 ease-in-out scale-100">
      <div class="flex justify-between items-start">
        <h2 id="install-modal-title" class="text-xl font-semibold text-flavorpal-gray-dark">
          Add to Your Home Screen
        </h2>
        <button @click="dismissInstallPrompt" class="text-gray-400 hover:text-gray-600 p-1 -mr-2 -mt-1 rounded-full focus:outline-none focus:ring-2 focus:ring-flavorpal-green-light" aria-label="Close instructions">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <p class="text-sm text-flavorpal-gray">
        For the best experience and quick access, add this app to your home screen.
      </p>

      <ol class="space-y-4 text-sm text-flavorpal-gray-dark">
        <li class="flex items-start space-x-3">
          <span class="flex-shrink-0 bg-flavorpal-green text-white h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ring-2 ring-flavorpal-green-light">1</span>
          <span class="leading-relaxed">
            Tap the <strong>Share</strong> icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="inline-block w-5 h-5 mx-0.5 text-blue-500 align-middle relative -top-px">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            in your Safari toolbar.
          </span>
        </li>
        <li class="flex items-start space-x-3">
          <span class="flex-shrink-0 bg-flavorpal-green text-white h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ring-2 ring-flavorpal-green-light">2</span>
          <span class="leading-relaxed">
            Scroll down the list and tap <strong>Add to Home Screen</strong>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="inline-block w-5 h-5 mx-0.5 text-blue-500 align-middle relative -top-px">
              <rect x="3" y="3" width="18" height="18" rx="2.5" ry="2.5"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>.
          </span>
        </li>
        <li class="flex items-start space-x-3">
          <span class="flex-shrink-0 bg-flavorpal-green text-white h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ring-2 ring-flavorpal-green-light">3</span>
          <span class="leading-relaxed">
            Review the name for the app shortcut, then tap <strong>Add</strong> in the top-right corner.
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

// Helper function to detect iOS
const isIOS = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform) ||
  // iPad on iOS 13 detection
  (navigator.userAgent.includes("Mac") && "ontouchend" in document);
};

// Helper function to detect if the PWA is in standalone mode
const isInStandaloneMode = () => {
  return (window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
};

// Check if the user has already seen/dismissed the prompt
const hasSeenInstallPrompt = () => {
  try {
    return localStorage.getItem('flavorpal_hasSeenIOSInstallPrompt') === 'true';
  } catch (e) {
    // LocalStorage might be disabled (e.g. private Browse)
    console.warn('Could not access localStorage for install prompt status.');
    return false;
  }
};

// Mark that the user has seen/dismissed the prompt
const setSeenInstallPrompt = () => {
  try {
    localStorage.setItem('flavorpal_hasSeenIOSInstallPrompt', 'true');
  } catch (e) {
    console.warn('Could not set localStorage for install prompt status.');
  }
};

onMounted(() => {
  if (isIOS() && !isInStandaloneMode() && !hasSeenInstallPrompt()) {
    setTimeout(() => {
      showInstallPromptModal.value = true;
    }, 1500);
  }
});

const dismissInstallPrompt = () => {
  showInstallPromptModal.value = false;
  setSeenInstallPrompt(); // Don't show again this session or until localStorage is cleared
};
</script>

<style scoped>
/* You can add additional scoped styles here if needed */
.align-middle { /* Tailwind's align-middle might not be enough for SVGs inside text */
  vertical-align: middle;
}
</style>