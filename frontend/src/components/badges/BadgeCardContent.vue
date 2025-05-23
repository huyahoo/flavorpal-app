<template>
  <div class="w-20 h-20 items-center justify-center overflow-hidden mb-5">
    <img
      :src="badge.imageUrl"
      :alt="badge.title"
      class="w-full h-full object-cover"
      loading="lazy"
    />
  </div>

  <div class="flex flex-col mx-3 text-center gap-y-1 select-none">
    <h4
      :id="`badge-${badge.id}`"
      class="font-semibold text-md text-flavorpal-gray-dark"
      :title="badge.title"
    >
      {{ badge.title }}
    </h4>
    <p class="text-xs text-gray-500">
      {{ badge.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Badge } from '@/types';

const { badge } = defineProps<{ badge: Badge }>();
</script>
