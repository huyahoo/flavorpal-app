<template>
  <article
    class="bg-gray-50 px-3 py-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200
            ease-in-out cursor-pointer flex flex-col items-center"
    role="article"
    v-if="badge.achievedAt"
    :aria-labelledby="`badge-${badge.id}`"
  >
    <slot></slot>
  </article>
  <article
    class="opacity-40 cursor-default bg-gray-50 px-3 py-8 rounded-lg flex flex-col items-center"
    role="article"
    v-else
    :aria-labelledby="`badge-${badge.id}`"
  >
    <slot></slot>
  </article>
</template>

<script setup lang="ts">
import type { Badge } from '@/types';

const { badge } = defineProps<{ badge: Badge }>();
</script>
