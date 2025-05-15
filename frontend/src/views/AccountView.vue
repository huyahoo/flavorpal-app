<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="sticky top-0 z-30 bg-flavorpal-gray-light pt-6 pb-3 px-4 sm:px-6 text-center">
      <h1 class="text-xl sm:text-2xl font-bold text-flavorpal-gray-dark">My Account</h1>
    </header>

    <main class="flex-grow p-4 sm:p-6 space-y-6">
      <section class="bg-white p-5 rounded-xl shadow-lg flex items-center space-x-4">
        <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-flavorpal-green-light rounded-full flex items-center justify-center text-flavorpal-green-dark">
          <svg class="w-10 h-10 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
          </div>
        <div class="flex-grow">
          <div class="flex items-center space-x-2">
            <h2 class="text-xl sm:text-2xl font-bold text-flavorpal-gray-dark truncate">{{ username }}</h2>
            <button @click="editProfile" class="text-flavorpal-green hover:text-flavorpal-green-dark" aria-label="Edit profile name">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
          </div>
          <p class="text-sm text-flavorpal-orange font-semibold">{{ tastePoints }} TastePoints</p>
        </div>
      </section>

      <section class="bg-white p-5 rounded-xl shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-semibold text-flavorpal-gray-dark">My Badges</h3>
          <router-link to="/all-badges" class="text-sm text-flavorpal-green hover:text-flavorpal-green-dark font-medium">
            All Badges
          </router-link>
        </div>
        <div v-if="userBadges.length > 0" class="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
          <div 
            v-for="badge in userBadges.slice(0, 4)" 
            :key="badge.id" 
            class="flex-shrink-0 flex flex-col items-center w-16 sm:w-20 text-center"
            :title="badge.name"
          >
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl sm:text-4xl mb-1 shadow-md" :style="{ backgroundColor: badge.bgColor, color: badge.iconColor }">
              {{ badge.icon }} </div>
            </div>
        </div>
        <p v-else class="text-sm text-flavorpal-gray">No badges earned yet. Keep exploring!</p>
      </section>

      <section class="bg-white p-5 rounded-xl shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-semibold text-flavorpal-gray-dark">Health Keywords</h3>
          <button @click="editKeywords" class="text-sm text-flavorpal-green hover:text-flavorpal-green-dark font-medium flex items-center">
             <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Edit Keywords
          </button>
        </div>
        <div v-if="authStore.healthFlags.length > 0" class="flex flex-wrap gap-2">
          <span 
            v-for="(flag, index) in authStore.healthFlags" 
            :key="index"
            class="px-3 py-1.5 bg-flavorpal-green-light text-flavorpal-green-dark text-sm font-medium rounded-full shadow-sm"
          >
            {{ flag }}
          </span>
        </div>
        <p v-else class="text-sm text-flavorpal-gray">No health keywords set. Add some to personalize your experience!</p>
      </section>

      <section class="bg-white rounded-xl shadow-lg overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li>
            <router-link to="/history" class="flex items-center p-4 hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 text-flavorpal-gray-dark mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span class="text-base text-flavorpal-gray-dark font-medium">Review History</span>
              <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </router-link>
          </li>
          <li>
            <button @click="changePassword" class="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <svg class="w-5 h-5 text-flavorpal-gray-dark mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.628 5.857L12 20.857l-2.372-2.372A6 6 0 0115 7zm0 0v-.5A2.5 2.5 0 0012.5 4h-5A2.5 2.5 0 005 6.5V7m6-3h-1a2 2 0 00-2 2v1a2 2 0 002 2h1m-3 4V14a1 1 0 011-1h1m0 3h-1a1 1 0 01-1-1v-2a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1z"></path></svg>
              <span class="text-base text-flavorpal-gray-dark font-medium">Change Password</span>
               <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </li>
        </ul>
      </section>

      <section class="mt-8">
        <button
          @click="handleLogout"
          class="w-full bg-flavorpal-orange hover:bg-flavorpal-orange-dark text-white font-semibold py-3 px-4 rounded-xl text-base transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg active:scale-95"
        >
          Logout
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth'; // Import the authentication store
import { useRouter } from 'vue-router'; // Import Vue Router

const authStore = useAuthStore();
const router = useRouter();

// --- Mock Data & Computed Properties ---
// User's name (derived from email for mock purposes)
const username = computed(() => {
  if (authStore.user?.email) {
    const emailNamePart = authStore.user.email.split('@')[0];
    // Capitalize first letter
    return emailNamePart.charAt(0).toUpperCase() + emailNamePart.slice(1);
  }
  return 'FlavorPal User'; // Fallback username
});

// Mock TastePoints
const tastePoints = ref(157); // Example static value

// Interface for Badge data
interface Badge {
  id: string;
  name: string;
  icon: string; // Using emoji for simplicity
  bgColor?: string; // Optional background color for the badge icon
  iconColor?: string; // Optional color for the emoji/icon itself
}

// Mock user badges
const userBadges = ref<Badge[]>([
  { id: 'b001', name: 'Donut Devotee', icon: '🍩', bgColor: '#FFD1DC', iconColor: '#D946EF' }, // Light Pink, Fuchsia
  { id: 'b002', name: 'Pizza Pro', icon: '🍕', bgColor: '#FFE9BF', iconColor: '#F59E0B' },     // Light Orange, Amber
  { id: 'b003', name: 'Veggie Virtuoso', icon: '🥗', bgColor: '#D1FAE5', iconColor: '#10B981' }, // Light Green, Emerald
  { id: 'b004', name: 'Sushi Samurai', icon: '🍣', bgColor: '#FEE2E2', iconColor: '#EF4444' },  // Light Red, Red
  // Add more badges as needed
]);

// --- Event Handlers ---
const handleLogout = async () => {
  await authStore.logout();
  // Navigation to Login page is handled by the store's logout action or router guards
};

const editProfile = () => {
  console.log('Edit profile clicked');
  // Placeholder: Navigate to an edit profile screen or open a modal
  alert('Edit profile functionality to be implemented!');
};

const editKeywords = () => {
  console.log('Edit keywords clicked');
  // Placeholder: Navigate to a screen to edit health keywords or open a modal
  // This could potentially reuse/trigger the health flags input from HomeView or a dedicated component
  alert('Edit health keywords functionality to be implemented!');
};

const changePassword = () => {
  console.log('Change password clicked');
  // Placeholder: Navigate to a change password screen
  // router.push({ name: 'ChangePassword' }); // Assuming a route named 'ChangePassword'
  alert('Change password functionality to be implemented!');
};

// Lifecycle hook: Fetch any necessary account data when component is mounted
onMounted(() => {
  // Example: if tastePoints or badges were dynamic, fetch them here
  // For now, they are static or derived from authStore
  if (!authStore.user) {
    // If somehow user is not loaded, attempt to initialize (though router guard should handle this)
    authStore.initializeAuth();
  }
});
</script>

<style scoped>
/* Add any component-specific styles here if needed */
/* Ensure smooth scrolling for horizontal badge list if it overflows */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch; /* Enables smooth scrolling on iOS Safari */
}
.overflow-x-auto::-webkit-scrollbar {
  display: none; /* Hide scrollbar for a cleaner look, but still scrollable */
}
</style>
