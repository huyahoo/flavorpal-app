// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/Auth/LoginView.vue';
import RegisterView from '../views/Auth/RegisterView.vue';
import AccountView from '../views/AccountView.vue';
import DiscoverView from '../views/DiscoverView.vue';
import HistoryView from '../views/HistoryView.vue';
import ScanView from '../views/ScanView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';

// Import the store type for use in guards, but get instance dynamically
// import { useAuthStore } from '../store/auth'; // Avoid direct top-level import if store uses router

// Define custom properties for route meta for better type safety and clarity
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;    // True if the route requires user to be authenticated
    requiresGuest?: boolean;   // True if the route is only for unauthenticated (guest) users
    title?: string;            // Optional page title for the browser tab
    showBottomNav?: boolean; // Optional flag to show/hide the bottom navigation bar
  }
}

// Define the application's routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true, title: 'FlavorPal - Home', showBottomNav: true  } // This route needs authentication
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true, title: 'FlavorPal - Login', showBottomNav: false } // Guest-only route
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true, title: 'FlavorPal - Register', showBottomNav: false } // Guest-only route
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountView,
    meta: { requiresAuth: true, title: 'FlavorPal - Account', showBottomNav: true  }
  },
  {
    path: '/discover',
    name: 'Discover',
    component: DiscoverView,
    meta: { requiresAuth: true, title: 'FlavorPal - Discover', showBottomNav: true  }
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
    meta: { requiresAuth: true, title: 'FlavorPal - History', showBottomNav: true  }
  },
  {
    path: '/scan',
    name: 'Scan',
    component: ScanView,
    meta: { requiresAuth: true, title: 'FlavorPal - Scan', showBottomNav: false  }
  },
  {
    path: '/add-review',
    name: 'AddReview',
    // Lazy load this component for better initial load time
    component: () => import('../views/AddReviewView.vue'),
    meta: { requiresAuth: true, title: 'FlavorPal - Add Review', showBottomNav: false  }
  },
  {
    path: '/product/:id', // Dynamic segment for product ID
    name: 'ProductDetail',
    component: ProductDetailView,
    props: true, // Pass route params as props to the component
    meta: { requiresAuth: true, title: 'FlavorPal - Product Details', showBottomNav: true } // Or false if it should be full screen
  },
  // Catch-all route for 404 Not Found pages
  {
    path: '/:pathMatch(.*)*', // Matches any path not explicitly defined
    name: 'NotFound',
    // Redirect to Home if logged in, otherwise to Login
    redirect: async () => {
      // Dynamically import store here to avoid circular dependency issues at app startup
      const { useAuthStore } = await import('../store/auth');
      const authStore = useAuthStore();
      // Ensure auth is initialized before checking isAuthenticated
      if (!authStore.user && localStorage.getItem('flavorpal_current_user_v4')) { // Check localStorage as a hint
        authStore.initializeAuth(); // This might be too late if not awaited, but better than nothing
      }
      return authStore.isAuthenticated ? { name: 'Home' } : { name: 'Login' };
    }
  }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use HTML5 history mode for cleaner URLs
  routes, // Pass the defined routes
  scrollBehavior(to, from, savedPosition) {
    // Control scroll position when navigating between routes
    if (savedPosition) {
      return savedPosition; // If user is navigating back/forward, restore previous scroll position
    } else {
      return { top: 0, behavior: 'smooth' }; // Otherwise, scroll to the top of the new page smoothly
    }
  }
});

// Global Navigation Guard: This function runs before each navigation occurs
router.beforeEach(async (to, from, next) => {
  // Dynamically import the auth store to ensure it's available and avoid circular dependencies
  const { useAuthStore } = await import('../store/auth');
  const authStore = useAuthStore();

  // Critical: Ensure auth state is initialized from localStorage before making routing decisions.
  // This is especially important on a page refresh or direct navigation.
  // The `initializeAuth` action in the store handles loading the user.
  // We check if the user state is null AND there's a user in localStorage,
  // implying `initializeAuth` might not have completed for this navigation cycle.
  if (authStore.user === null && !authStore.loading && localStorage.getItem('flavorpal_current_user_v4')) {
      authStore.initializeAuth(); // Attempt to initialize/restore session
      // Note: This call is synchronous in its effect on the store's immediate state for 'user' if data is in localStorage.
      // For truly async init, a loading state or promise would be needed here.
  }

  const isAuthenticated = authStore.isAuthenticated; // Get current authentication status

  // Set document title from route meta, or use a default title
  if (to.meta.title) {
    document.title = to.meta.title as string;
  } else {
    document.title = 'FlavorPal'; // Default application title
  }

  // --- Route Protection Logic ---
  if (to.meta.requiresAuth && !isAuthenticated) {
    // If the route requires authentication and the user is NOT logged in,
    // redirect them to the Login page.
    // Pass the original intended path as a query parameter for redirection after login.
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // If the route is for guests (e.g., Login, Register) and the user IS already logged in,
    // redirect them to the Home page.
    next({ name: 'Home' });
  } else {
    // If none of the above conditions are met, allow navigation to the requested route.
    next();
  }
});

export default router;
