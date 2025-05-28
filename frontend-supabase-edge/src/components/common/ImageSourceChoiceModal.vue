<template>
  <Transition name="modal-fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      @click.self="$emit('close')" 
      aria-modal="true" 
      role="dialog"
      aria-labelledby="image-source-modal-title"
    >
      <div 
        class="bg-white rounded-xl shadow-2xl w-full max-w-xs p-6 sm:p-8 transform transition-all"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <h3 id="image-source-modal-title" class="text-lg font-semibold text-flavorpal-gray-dark mb-6 text-center">
          Update Ingredient Photo<br> for Better Insights 
        </h3>
        <div class="space-y-3">
          <button
            @click="$emit('selectSource', 'camera')"
            type="button"
            class="w-full flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-flavorpal-green hover:bg-flavorpal-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flavorpal-green"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Take a Photo
          </button>
          <button
            @click="$emit('selectSource', 'upload')"
            type="button"
            class="w-full flex items-center justify-center px-5 py-3 text-sm font-medium text-flavorpal-gray-dark bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Upload from Library
          </button>
        </div>
        <button
          @click="$emit('close')"
          type="button"
          class="w-full mt-6 px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close', 'selectSource']);
</script>

<style scoped>
/* Using same modal fade from ConfirmationModal */
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
