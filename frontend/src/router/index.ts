// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw, type RouteLocationNormalized } from 'vue-router';
// Static imports for views
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/Auth/LoginView.vue';
import RegisterView from '../views/Auth/RegisterView.vue';
import AddReviewView from '../views/AddReviewView.vue';
import HistoryView from '../views/HistoryView.vue';
import ScanView from '../views/ScanView.vue';
import DiscoverView from '../views/DiscoverView.vue';
import AccountView from '../views/AccountView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import PublicReviewDetailView from '../views/PublicReviewDetailView.vue';
import BadgesView from '@/views/BadgesView.vue';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    title?: string;
    showBottomNav?: boolean;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true, title: 'FlavorPal - Home', showBottomNav: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true, title: 'FlavorPal - Login', showBottomNav: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true, title: 'FlavorPal - Register', showBottomNav: false }
  },
  {
    path: '/add-review',
    name: 'AddReview',
    component: AddReviewView,
    meta: { requiresAuth: true, title: 'FlavorPal - Add Review', showBottomNav: false }
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
    meta: { requiresAuth: true, title: 'FlavorPal - History', showBottomNav: true }
  },
  {
    path: '/scan',
    name: 'Scan',
    component: ScanView,
    meta: { requiresAuth: true, title: 'FlavorPal - Scan', showBottomNav: false }
  },
  {
    path: '/discover',
    name: 'Discover',
    component: DiscoverView,
    meta: { requiresAuth: true, title: 'FlavorPal - Discover', showBottomNav: true }
  },
  { // New Route for Public Review Detail
    path: '/discover/review/:reviewId',
    name: 'PublicReviewDetail',
    component: PublicReviewDetailView,
    props: true, // Pass route.params.reviewId as prop
    meta: { requiresAuth: true, title: 'FlavorPal - Review', showBottomNav: true } // Or false if it's a focused view
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountView,
    meta: { requiresAuth: true, title: 'FlavorPal - Account', showBottomNav: true }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetailView,
    props: true,
    meta: { requiresAuth: true, title: 'FlavorPal - Product Details', showBottomNav: true }
  },
  {
    path: '/badges/',
    name: 'Badges',
    component: BadgesView,
    props: true,
    meta: { requiresAuth: true, title: 'FlavorPal - Badges', showBottomNav: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: {
      template: '<div>Redirecting...</div>'
    },
    beforeEnter: async (to, from, next) => {
      // Dynamically import the auth store
      const { useAuthStore } = await import('../store/auth');
      const authStore = useAuthStore();

      // If necessary, initialize the auth state
      if (!authStore.user && localStorage.getItem('flavorpal_current_user_v4')) {
        await authStore.initializeAuth();
      }

      // Redirect based on auth status
      if (authStore.isAuthenticated) {
        next({ name: 'Home' });
      } else {
        next({ name: 'Login' });
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('../store/auth');
  const authStore = useAuthStore();

  if (authStore.user === null && !authStore.loading && localStorage.getItem('flavorpal_current_user_v4')) {
      await authStore.initializeAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.title) {
    document.title = to.meta.title as string;
  } else {
    document.title = 'FlavorPal';
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
