<template>
  <Transition name="modal-fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      @click.self="handleOverlayClick" 
      aria-modal="true" 
      role="dialog"
      :aria-labelledby="modalTitleId"
      :aria-describedby="modalMessageId"
    >
      <div 
        class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 sm:p-8 transform transition-all"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div class="flex items-center mb-4">
          <div v-if="type === 'success'" class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-flavorpal-green-light flex items-center justify-center mr-3">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-flavorpal-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div v-else-if="type === 'error'" class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 :id="modalTitleId" class="text-xl font-semibold text-flavorpal-gray-dark">{{ title }}</h3>
        </div>

        <p :id="modalMessageId" class="text-sm text-flavorpal-gray mb-6">{{ message }}</p>

        <div class="flex" :class="actionAlignmentClass">
          <button
            @click="handleConfirm"
            type="button"
            ref="confirmButtonRef"
            class="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="confirmButtonClass"
          >
            {{ confirmText }}
          </button>
           <button
            v-if="showCancelButton"
            @click="handleCancel"
            type="button"
            class="ml-3 px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: NotificationType;
  showCancelButton?: boolean;
  closeOnOverlayClick?: boolean;
  actionAlignment?: 'left' | 'center' | 'right';
}>(), {
  confirmText: 'OK',
  cancelText: 'Cancel',
  type: 'info', // Default type
  showCancelButton: false,
  closeOnOverlayClick: true,
  actionAlignment: 'right',
});

const emit = defineEmits(['confirm', 'cancel']);
const confirmButtonRef = ref<HTMLButtonElement | null>(null);

const modalTitleId = computed(() => `modal-title-${Math.random().toString(36).substring(2,9)}`);
const modalMessageId = computed(() => `modal-message-${Math.random().toString(36).substring(2,9)}`);


watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        nextTick(() => {
            confirmButtonRef.value?.focus();
        });
    }
});

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    emit('cancel');
  }
};

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-flavorpal-green hover:bg-flavorpal-green-dark focus:ring-flavorpal-green';
    case 'error':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    case 'warning':
      return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400';
    case 'info':
    default:
      return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400';
  }
});

const actionAlignmentClass = computed(() => {
    switch (props.actionAlignment) {
        case 'left': return 'justify-start';
        case 'center': return 'justify-center';
        case 'right':
        default: return 'justify-end';
    }
});
</script>

<style scoped>
/* Transition styles for the modal fade and scale effect */
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