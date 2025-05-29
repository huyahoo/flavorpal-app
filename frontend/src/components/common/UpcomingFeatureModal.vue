<template>
  <Transition name="modal-fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      @click.self="closeModal" 
      aria-modal="true" 
      role="dialog"
      aria-labelledby="upcoming-feature-modal-title"
    >
      <div 
        class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 sm:p-8 text-center transform transition-all"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div class="mx-auto mb-5 flex items-center justify-center h-16 w-16 rounded-full bg-flavorpal-green-light">
          <svg class="h-10 w-10 text-flavorpal-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg>
        </div>

        <h3 id="upcoming-feature-modal-title" class="text-xl sm:text-2xl font-semibold text-flavorpal-gray-dark mb-3">
          Coming Soon!
        </h3>

        <p class="text-sm text-flavorpal-gray mb-6">
          The "{{ featureName || 'this exciting new' }}" feature is currently under development.
          <br />
          Stay tuned for updates!
        </p>

        <div class="flex justify-center">
          <button
            @click="closeModal"
            type="button"
            ref="confirmButtonRef"
            class="px-8 py-2.5 text-sm font-medium text-white bg-flavorpal-green hover:bg-flavorpal-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flavorpal-green"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  featureName?: string;
  closeOnOverlayClick?: boolean;
}>(), {
  featureName: 'New', // Default if no specific feature name is provided
  closeOnOverlayClick: true,
});

const emit = defineEmits(['close']);
const confirmButtonRef = ref<HTMLButtonElement | null>(null);

watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        nextTick(() => {
            confirmButtonRef.value?.focus();
        });
    }
});

const closeModal = () => {
  emit('close');
};

// const handleOverlayClick = () => { // Already handled by @click.self
//   if (props.closeOnOverlayClick) {
//     closeModal();
//   }
// };
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .transform,
.modal-fade-leave-active .transform {
  transition: all 0.25s ease-in-out;
}
.modal-fade-enter-from .transform,
.modal-fade-leave-to .transform {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
