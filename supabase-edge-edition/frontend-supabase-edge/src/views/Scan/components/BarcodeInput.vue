<template>
    <div class="flex flex-col flex-grow items-center justify-center p-6 bg-gray-700" :style="{ paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 1.5rem)` }">
          <h2 class="text-xl font-semibold mb-4 text-white">Enter Barcode Manually</h2>
          <form @submit.prevent="handleSubmit" class="w-full max-w-sm">
              <input 
                  type="text"
                  v-model="barcodeValue"
                  placeholder="Type or paste barcode"
                  class="w-full px-4 py-3 mb-4 border border-gray-500 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green"
                  ref="barcodeInputRef"
                  required
              />
              <div class="flex space-x-3">
                  <button type="button" @click="exitBarcodeInputCallback" class="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
                      Cancel
                  </button>
                  <button type="button" @click="handleSubmit" class="flex-1 bg-flavorpal-green hover:bg-flavorpal-green-dark text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50">
                      Submit
                  </button>
              </div>
          </form>
      </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    submitBarcode: (barcode: string) => void;
    exitBarcodeInputCallback: () => void;
}
const props = defineProps<Props>();

const barcodeValue = ref<string>('');

const handleSubmit = () => {
    if (barcodeValue.value.trim() !== '') {
        props.submitBarcode(barcodeValue.value.trim());
    }
    else {
        alert('Please enter a valid barcode.');
    }
};

</script>