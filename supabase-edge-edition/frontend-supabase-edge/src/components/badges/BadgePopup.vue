<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    @click.self="handleCloseBadgePopup"
  >
    <div
      class="bg-gray-50 px-3 w-80 py-4 rounded-lg flex flex-col items-center h-fit z-60
              -translate-y-12 cursor-default transition-transform duration-150 select-none"
    >
      <div class="w-full flex justify-end">
        <div
          v-if="isNewBadge"
          class="flex w-full justify-center p-1 mb-5"
        >
          <h1 class="text-lg text-flavorpal-green font-bold">New Badge!</h1>
        </div>
        <button
          v-else
          @click="handleCloseBadgePopup"
          class="text-gray-400 hover:text-gray-600 p-1 rounded-full
                  hover:bg-gray-100 duration-200"
        >
          <IconClose />
        </button>
      </div>

      <div class="w-28 h-28 items-center justify-center overflow-hidden mb-8">
        <img
          :src="badge.imageUrl"
          :alt="badge.name"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div class="flex flex-col mx-3 text-center gap-y-2 mb-10">
        <h4
          :id="`badge-${badge.id}`"
          class="font-semibold text-2xl text-flavorpal-gray-dark"
          :title="badge.name"
        >
          {{ badge.name }}
        </h4>
        <p class="text-sm text-gray-500">
          {{ badge.description }}
        </p>
      </div>

      <div class="mb-8">
        <p class="italic text-xs text-gray-500">
          {{ "Achieved on " + badge.createdAt?.slice(0, 10) }}
        </p>
      </div>

      <div class="w-full flex justify-center px-1 mt-4">
        <button
          class="rounded-md bg-flavorpal-green text-white w-full py-2 hover:bg-flavorpal-green-dark
                  duration-200 active:bg-flavorpal-green"
          @click="handleCloseBadgePopup"
        >
          {{ isNewBadge ? "Nice!" : "Close" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DisplayBadge } from '@/types';
import IconClose from '../icons/IconClose.vue';

const {
  badge,
  handleCloseBadgePopup,
  isNewBadge = false
} = defineProps<{
  badge: DisplayBadge
  handleCloseBadgePopup: () => void
  isNewBadge?: boolean
}>();
</script>
