<template>
  <div class="bg-white mx-4 my-2 rounded-lg shadow-sm">
    <!-- Section Title -->
    <div class="px-4 py-3 border-b border-gray-100">
      <h2 class="text-lg font-medium text-flavorpal-gray-dark">{{ title }}</h2>
    </div>
    
    <!-- Gift Items -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="gift in giftList"
        :key="gift.id"
        class="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
        @click="props.onGiftRedeem(gift)"
      >
        <!-- Left side: Icon and Name -->
        <div class="flex items-center space-x-3">
          <!-- Icon -->
          <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <Coins 
              v-if="gift.icon === 'coin'" 
              class="w-5 h-5 text-orange-600" 
            />
            <Coffee 
              v-else-if="gift.icon === 'drink'" 
              class="w-5 h-5 text-amber-700" 
            />
            <ShoppingCart 
              v-else-if="gift.icon === 'shopping-cart'" 
              class="w-5 h-5 text-green-600" 
            />
            <Gift 
              v-else 
              class="w-5 h-5 text-gray-600" 
            />
          </div>
          
          <!-- Gift Name -->
          <div class="flex-1 min-w-0">
            <p class="text-base font-medium text-flavorpal-gray-dark truncate">
              {{ gift.name }}
            </p>
          </div>
        </div>
        
        <!-- Right side: Required Points -->
        <div class="flex-shrink-0">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
            {{ gift.requiredPoints }} TP
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Coins, Coffee, ShoppingCart, Gift } from 'lucide-vue-next'
import type { PointConversionGift } from '@/types'

// Props
interface Props {
  title: string
  giftList: PointConversionGift[]
  onGiftRedeem: (gift: PointConversionGift) => void
}

const props = defineProps<Props>()
</script>