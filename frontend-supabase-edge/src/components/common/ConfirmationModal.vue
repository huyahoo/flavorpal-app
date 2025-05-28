<template>
  <Transition name="modal-fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      @click.self="$emit('cancel')"  aria-modal="true" role="dialog"
    >
      <div 
        class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-xl font-semibold text-flavorpal-gray-dark" id="modal-title">{{ title }}</h3>
          <button 
            @click="$emit('cancel')" 
            class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <p class="text-sm text-flavorpal-gray mb-6" id="modal-description">{{ message }}</p>

        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('cancel')"
            type="button"
            class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            type="button"
            class="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Define component props
// - isOpen: Controls the visibility of the modal.
// - title: The title text for the modal header.
// - message: The confirmation message displayed in the modal body.
const props = defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
}>();

// Define component emits
// - confirm: Emitted when the user clicks the confirm action button.
// - cancel: Emitted when the user clicks the cancel button or the backdrop.
const emit = defineEmits(['confirm', 'cancel']);

// Optional: Add keyboard listener to close modal on Escape key
// import { onMounted, onUnmounted } from 'vue';
// const handleEscape = (e: KeyboardEvent) => {
//   if (e.key === 'Escape' && props.isOpen) {
//     emit('cancel');
//   }
// };
// onMounted(() => window.addEventListener('keydown', handleEscape));
// onUnmounted(() => window.removeEventListener('keydown', handleEscape));
</script>

<style scoped>
/* Transition styles for the modal fade and scale effect */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .transform,
.modal-fade-leave-active .transform {
  transition: all 0.3s ease-in-out;
}
.modal-fade-enter-from .transform,
.modal-fade-leave-to .transform {
  transform: scale(0.95);
  opacity: 0;
}
</style>
