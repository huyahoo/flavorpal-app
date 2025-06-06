<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="sticky top-0 z-30 bg-flavorpal-gray-light pt-6 pb-3 px-4 sm:px-6 text-center">
      <h1 class="text-xl sm:text-2xl font-bold text-flavorpal-gray-dark">My Account</h1>
    </header>

    <main class="flex-grow p-4 sm:p-6 space-y-6">
      <div v-if="authStore.loading && !authStore.user" class="text-center py-10">
         <svg class="animate-spin h-8 w-8 text-flavorpal-green mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-flavorpal-gray">Loading account details...</p>
      </div>

      <section v-if="authStore.user" class="bg-white p-5 rounded-xl shadow-lg flex items-center space-x-4">
        <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-flavorpal-green-light rounded-full flex items-center justify-center text-flavorpal-green-dark">
          <svg class="w-10 h-10 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        </div>
        <div class="flex-grow min-w-0">
          <div v-if="!isEditingUsername" class="flex items-center space-x-2">
            <h2
              class="text-xl sm:text-2xl font-bold text-flavorpal-gray-dark truncate"
              :title="authStore.user?.name || 'Username'"
            >
              {{ authStore.user?.name || 'Username' }}
            </h2>
            <button
              @click="startEditUsername"
              class="text-flavorpal-green hover:text-flavorpal-green-dark p-1 rounded-md hover:bg-flavorpal-green-light transition-colors flex-shrink-0"
              aria-label="Edit username"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
          </div>
          <form v-else @submit.prevent="saveUsername" class="space-y-2">
            <div>
              <label for="usernameEditInputAccView" class="sr-only">New Username</label>
              <input
                type="text"
                id="usernameEditInputAccView"
                v-model="newUsernameInput"
                class="block w-full px-3 py-2 border border-flavorpal-green rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flavorpal-green-dark sm:text-lg"
                placeholder="Enter new username"
                ref="usernameInputRef"
                aria-describedby="username-edit-error-acc-view"
              />
            </div>
            <div class="flex items-center space-x-2">
              <button
                type="submit"
                :disabled="authStore.loading || !newUsernameInput.trim() || newUsernameInput.trim().length < 3"
                class="px-3 py-1.5 text-sm font-medium text-white bg-flavorpal-green hover:bg-flavorpal-green-dark rounded-md disabled:opacity-60 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                @click="cancelEditUsername"
                class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
            <p v-if="usernameEditError" id="username-edit-error-acc-view" class="text-xs text-red-600 mt-1">{{ usernameEditError }}</p>
          </form>
          <p v-if="userProfileStore.loading && authStore.user" class="text-xs text-flavorpal-gray animate-pulse mt-1">Loading points...</p>
          <router-link to="/point-conversion" v-else-if="!userProfileStore.loading && authStore.user" class="text-sm text-flavorpal-orange font-semibold mt-1">{{ userProfileStore.tastePoints }} TastePoints</router-link>
        </div>
      </section>

      <section v-if="authStore.user" class="bg-white p-5 rounded-xl shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-semibold text-flavorpal-gray-dark">My Badges</h3>
          <router-link to="/badges" class="text-sm text-flavorpal-green hover:text-flavorpal-green-dark font-medium flex items-center p-1 rounded hover:bg-flavorpal-green-light transition-colors">
            All Badges
          </router-link>
        </div>
        <div v-if="userProfileStore.loading" class="text-center py-3">
            <p class="text-xs text-flavorpal-gray animate-pulse">Loading badges...</p>
        </div>
        <div v-else-if="badgeStore.badges.length > 0" class="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
          <BadgeItem
            v-for="badge in badgeStore.getProfileSummaryBadges(4)"
            :key="badge.ref"
            :badge="badge"
          />
        </div>
        <p v-else-if="!userProfileStore.loading && badgeStore.badges.length === 0" class="text-sm text-flavorpal-gray">No badges earned yet. Keep exploring!</p>
        <p v-if="userProfileStore.error && !userProfileStore.loading" class="text-xs text-red-500 mt-1">Could not load badges: {{ userProfileStore.error }}</p>
      </section>

      <section v-if="authStore.user" class="bg-white p-5 rounded-xl shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-semibold text-flavorpal-gray-dark">Health Keywords</h3>
          <button v-if="!isEditingKeywords" @click="startEditKeywords" class="text-sm text-flavorpal-green hover:text-flavorpal-green-dark font-medium flex items-center p-1 rounded hover:bg-flavorpal-green-light transition-colors">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Edit Keywords
          </button>
        </div>
        <div v-if="!isEditingKeywords">
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
        </div>
        <form v-else @submit.prevent="saveKeywords" class="space-y-3">
            <div>
                <label for="keywordsInput" class="block text-sm font-medium text-gray-700 mb-1">Edit your keywords (comma-separated):</label>
                <input
                    type="text"
                    id="keywordsInput"
                    v-model="newKeywordsInput"
                    class="block w-full px-3 py-2 border border-flavorpal-green rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-flavorpal-green-dark sm:text-sm"
                    placeholder="e.g., nuts, gluten-free, low sugar"
                    ref="keywordsInputRef"
                    aria-describedby="keywords-edit-error"
                />
            </div>
            <div class="flex items-center space-x-2">
                <button
                    type="submit"
                    :disabled="authStore.loading"
                    class="px-3 py-1.5 text-sm font-medium text-white bg-flavorpal-green hover:bg-flavorpal-green-dark rounded-md disabled:opacity-60 transition-colors"
                >
                    Save Keywords
                </button>
                <button
                    type="button"
                    @click="cancelEditKeywords"
                    class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                    Cancel
                </button>
            </div>
            <p v-if="keywordsEditError" id="keywords-edit-error" class="text-xs text-red-500 mt-1">{{ keywordsEditError }}</p>
        </form>
      </section>

      <section v-if="authStore.user" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li>
            <button @click="navigateToMyReviews" class="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <svg class="w-5 h-5 text-flavorpal-gray-dark mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span class="text-base text-flavorpal-gray-dark font-medium">My Reviews</span>
              <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </li>

          <li>
            <button @click="navigateToConvertTastePoints" class="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <svg
                class="w-5 h-5 text-flavorpal-gray-dark mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18m-7 4l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
              <span class="text-base text-flavorpal-gray-dark font-medium">Convert TastePoints</span>
              <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </li>

          <li>
            <button @click="changePassword" class="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <svg
                class="w-5 h-5 text-flavorpal-gray-dark mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              <span class="text-base text-flavorpal-gray-dark font-medium">Change Password</span>
              <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </li>
        </ul>
      </section>

      <section v-if="authStore.user" class="mt-8">
        <button
          @click="handleLogout"
          class="w-full bg-flavorpal-orange hover:bg-flavorpal-orange-dark text-white font-semibold py-3 px-4 rounded-xl text-base transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg active:scale-95"
        >
          Logout
        </button>
      </section>

       <div v-if="!authStore.loading && !authStore.user" class="text-center py-10">
        <p class="text-flavorpal-gray">Could not load user account. Please try logging in again.</p>
        <router-link to="/login" class="text-flavorpal-green hover:underline">Go to Login</router-link>
      </div>
    </main>
    <UpcomingFeatureModal
      :is-open="isUpcomingModalOpen"
      :feature-name="upcomingFeatureName"
      @close="isUpcomingModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useAuthStore } from '../store/auth';
import { useUserProfileStore } from '../store/userProfileStore';
import { useHistoryStore } from '../store/historyStore';
import { useRouter } from 'vue-router';
import BadgeItem from '@/components/account/BadgeItem.vue';
import { useBadgeStore } from '@/store/badgeStore';
import UpcomingFeatureModal from '@/components/common/UpcomingFeatureModal.vue';

const authStore = useAuthStore();
const userProfileStore = useUserProfileStore();
const badgeStore = useBadgeStore()
const historyStore = useHistoryStore();
const router = useRouter();

const isUpcomingModalOpen = ref(false);
const upcomingFeatureName = ref('');

// --- State for Username Editing ---
const isEditingUsername = ref(false);
const newUsernameInput = ref('');
const usernameInputRef = ref<HTMLInputElement | null>(null);
const usernameEditError = ref<string | null>(null);

// --- State for Keywords Editing ---
const isEditingKeywords = ref(false);
const newKeywordsInput = ref(''); // Comma-separated string
const keywordsInputRef = ref<HTMLInputElement | null>(null); // For focusing the input
const keywordsEditError = ref<string | null>(null);


// Interface for Badge data 
interface Badge {
  id: string;
  name: string;
  icon: string;
  bgColor?: string;
  iconColor?: string;
}


const showUpcomingFeatureModal = (feature: string) => {
  upcomingFeatureName.value = feature;
  isUpcomingModalOpen.value = true;
};

// --- Username Editing Functions ---
const startEditUsername = () => {
  isEditingUsername.value = true;
  newUsernameInput.value = authStore.user?.name || '';
  usernameEditError.value = null;
  nextTick(() => {
    usernameInputRef.value?.focus();
  });
};

const saveUsername = async () => {
  const trimmedUsername = newUsernameInput.value.trim();
  if (!trimmedUsername) {
    usernameEditError.value = "Username cannot be empty.";
    return;
  }
  if (trimmedUsername.length < 3) {
    usernameEditError.value = "Username must be at least 3 characters long.";
    return;
  }
  usernameEditError.value = null;

  const success = await authStore.updateUsername(trimmedUsername);
  if (success) {
    isEditingUsername.value = false;
  } else {
    usernameEditError.value = authStore.error || "Failed to update username.";
  }
};

const cancelEditUsername = () => {
  isEditingUsername.value = false;
  usernameEditError.value = null;
  newUsernameInput.value = authStore.user?.name || '';
};

// --- Keywords Editing Functions ---
const startEditKeywords = () => {
  isEditingKeywords.value = true;
  // Join the array of flags into a comma-separated string for the input field
  newKeywordsInput.value = authStore.healthFlags.join(', ');
  keywordsEditError.value = null; // Clear previous errors
  nextTick(() => {
    keywordsInputRef.value?.focus(); // Focus the input field
  });
};

const saveKeywords = async () => {
  keywordsEditError.value = null; // Clear previous errors
  // Split the comma-separated string into an array, trimming whitespace and filtering out empty strings
  const flagsArray = newKeywordsInput.value
    .split(',')
    .map(flag => flag.trim())
    .filter(flag => flag !== '');

  // Call the authStore action to update health flags
  const success = await authStore.updateHealthFlags(flagsArray);
  if (success) {
    isEditingKeywords.value = false; // Exit editing mode on success
  } else {
    // If authStore.updateHealthFlags sets an error, display it. Otherwise, show a generic message.
    keywordsEditError.value = authStore.error || "Failed to update health keywords.";
  }
};

const cancelEditKeywords = () => {
  isEditingKeywords.value = false;
  keywordsEditError.value = null; // Clear errors
  // Optionally reset newKeywordsInput to current flags if needed, or just let it be
  // newKeywordsInput.value = authStore.healthFlags.join(', ');
};


// --- Navigation Handler for "My Reviews" ---
const navigateToMyReviews = () => {
  historyStore.setInitialHistoryFilters('reviewed_only');
  router.push({ name: 'History' });
};

// --- Navigation Handler for "Convert TastePoints" ---
const navigateToConvertTastePoints = () => {
  router.push({ name: 'PointConversion' });
};

// Other event handlers
const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'Login' });
};

// --- Change Password Functionality ---
const changePassword = () => {
  showUpcomingFeatureModal('Change Password');
};

// Lifecycle hook
onMounted(async () => {
  if (!authStore.user && localStorage.getItem('flavorpal_current_user_v4')) {
    await authStore.initializeAuth();
  }

  if (authStore.isAuthenticated) {
    userProfileStore.loadUserProfile();
    badgeStore.loadAllUserBadges();
  }
});
</script>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>
