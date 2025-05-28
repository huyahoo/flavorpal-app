<template>
  <div class="relative flex h-full flex-col overflow-hidden bg-gray-800 text-white">
    <Header :goBack="goBack" v-if="['idle_choice', 'inputting_barcode'].includes(state)" />

    <div class="flex flex-grow flex-col">
      <IdleChoicePanel
        v-if="state === 'idle_choice'"
        :activateBarcodeScanner="
          () => {
            state = 'barcode_scanning'
          }
        "
        :activateDirectBarcodeInput="
          () => {
            state = 'inputting_barcode'
          }
        "
        :activatePhotoTaker="
          () => {
            state = 'photo_capture'
          }
        "
      />

      <BarcodeScanner
        v-if="state === 'barcode_scanning'"
        :barcode-detected-callback="handleBarcodeSubmission"
        :stop-scan-callback="handleResetView"
      />

      <BarcodeInput
        v-if="state === 'inputting_barcode'"
        :submit-barcode="handleBarcodeSubmission"
        :exit-barcode-input-callback="handleResetView"
      />

      <PhotoCapturer v-if="state === 'photo_capture'" :on-capture="handlePhotoCapture" :cancel-capture-callback="handleResetView" />

      <Analyzing v-if="state === 'analyzing'" :cancel-analysis-callback="handleResetView" />

      <ResultPanel
        v-if="state === 'result_display' && productForDisplay"
        :product-for-display="productForDisplay"
        :scan-another-callback="handleResetView"
        :navigate-to-product-detail-callback="handleNavigateToProductDetail"
      />

      <ErrorDisplay v-if="state === 'error'" :error-message :reset-callback="handleResetView" />
    </div>
  </div>
</template>

<script setup lang="ts">
// ... (script setup remains the same as flavorpal_scan_view_v4_zxing)
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { AiHealthConclusion, ProductInteraction } from '../../types'
import PhotoCapturer, { type CapturedPhoto } from './components/PhotoCapturer.vue'
import Header from './components/Header.vue'
import BarcodeScanner from './components/BarcodeScanner.vue'
import IdleChoicePanel from './components/IdleChoicePanel.vue'
import BarcodeInput from './components/BarcodeInput.vue'
import Analyzing from './components/Analyzing.vue'
import ResultPanel from './components/ResultPanel.vue'
import ErrorDisplay from './components/ErrorDisplay.vue'

import { getProductByBarcodeApi, getProductByImageApi } from '@/services/productService'

// DELETE AFTER BACKEND INTEGRATION
import { useHistoryStore } from '../../store/historyStore'
const historyStore = useHistoryStore()
//////////////////////////////////////

const router = useRouter()

const state = ref<ScanViewStage>('idle_choice')
const errorMessage = ref<string | null>(null)
const productForDisplay = ref<ProductInteraction | null>(null)

export type ScanViewStage =
  | 'idle_choice'
  | 'inputting_barcode'
  | 'analyzing'
  | 'result_display'
  | 'photo_capture'
  | 'barcode_scanning'
  | 'error'

const goBack = () => {
  handleResetView()
  if (window.history.state.back) {
    router.go(-1)
  } else {
    router.push({ name: 'Home' })
  }
}

const handleResetView = () => {
  state.value = 'idle_choice'
  productForDisplay.value = null
  errorMessage.value = null
}

const handleBarcodeSubmission = async (barcodeValue: string) => {
  console.log('Processing submitted barcode:', barcodeValue)
  state.value = 'analyzing'
  const productInteraction = await getProductByBarcodeApi(barcodeValue)
  if (productInteraction) {
    productForDisplay.value = productInteraction.data as ProductInteraction
  }
  // DELETE AFTER BACKEND INTEGRATION
  historyStore.addOrUpdateInteraction(productForDisplay.value as ProductInteraction)
  //////////////////////////////////////
  state.value = 'result_display'
}

const handleNavigateToProductDetail = () => {
  const productId = productForDisplay.value?.id
  handleResetView()
  if (productId) {
    router.push({ name: 'ProductDetail', params: { id: productId } })
  }
}

const handlePhotoCapture = async (photo: CapturedPhoto) => {
  console.log('Processing captured photo:', photo)
  state.value = 'analyzing'
  const result = await getProductByImageApi(photo)
  console.log('Photo analysis result:', result)
  if (result?.data) {
    productForDisplay.value = result.data as ProductInteraction
  }
  state.value = 'result_display'
}


onUnmounted(() => {
  handleResetView()
})

</script>

<style scoped>
.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0.6;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.line-clamp-2,
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.line-clamp-2 {
  -webkit-line-clamp: 2;
}
.line-clamp-3 {
  -webkit-line-clamp: 3;
}
/* Using min-h-screen on the root div of this component */
.min-h-screen {
  min-height: 100vh;
}
.aspect-\[16\/9\] {
  aspect-ratio: 16 / 9;
}
/* Ensure video element in camera view attempts to fill its container */
.flex-grow.relative.flex.items-center.justify-center.bg-black video {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
}
</style>
