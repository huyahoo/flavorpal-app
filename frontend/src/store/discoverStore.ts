// src/store/discoverStore.ts
import { defineStore } from 'pinia';
import type { PublicReviewItem } from '../types';
import { fetchPublicReviewsApi, fetchSinglePublicReviewApi, likePublicReviewApi, fetchRelatedPublicReviewsApi } from '../services/discoverService'; 

export interface DiscoverStoreState {
  publicReviews: PublicReviewItem[];
  currentReviewDetail: PublicReviewItem | null;
  relatedPublicReviews: PublicReviewItem[]; // NEW: For related reviews
  isLoading: boolean;
  isLoadingMore: boolean;
  isLoadingDetail: boolean;
  isLoadingRelated: boolean; // NEW: Loading state for related reviews
  error: string | null;
  currentPage: number;
  hasMoreReviews: boolean;
  reviewsPerPage: number;
}

export const useDiscoverStore = defineStore('discover', {
  state: (): DiscoverStoreState => ({
    publicReviews: [],
    currentReviewDetail: null,
    relatedPublicReviews: [], // Initialize
    isLoading: false,
    isLoadingMore: false,
    isLoadingDetail: false,
    isLoadingRelated: false, // Initialize
    error: null,
    currentPage: 1,
    hasMoreReviews: true,
    reviewsPerPage: 5,
  }),

  getters: {
    // Getter to access the list of public reviews
    getPublicReviews: (state): PublicReviewItem[] => state.publicReviews,
    // Getter for the currently viewed review detail
    getCurrentReviewDetail: (state): PublicReviewItem | null => state.currentReviewDetail,
    // Getter for related public reviews
    getRelatedPublicReviews: (state): PublicReviewItem[] => state.relatedPublicReviews,
  },

  actions: {
    /**
     * Fetches public reviews, supports pagination and force refresh.
     * @param forceRefresh - If true, clears existing reviews and fetches page 1.
     */
    async loadPublicReviews(forceRefresh: boolean = false) {
      if (forceRefresh) {
        this.currentPage = 1;
        this.publicReviews = [];
        this.hasMoreReviews = true; // Reset hasMore on refresh
        this.isLoading = true; // Use main loading for full refresh
      } else {
        if (!this.hasMoreReviews || this.isLoadingMore) return; // Don't fetch if no more or already loading more
        this.isLoadingMore = true;
      }
      this.error = null;

      try {
        const { reviews, hasMore, nextPage } = await fetchPublicReviewsApi(this.currentPage, this.reviewsPerPage);

        if (forceRefresh) {
          this.publicReviews = reviews;
        } else {
          this.publicReviews.push(...reviews); // Append new reviews
        }

        this.hasMoreReviews = hasMore;
        if (nextPage) {
          this.currentPage = nextPage;
        } else {
          // If nextPage is null but hasMore was true, it means we fetched the last page.
          // If hasMore is false, we've truly reached the end.
          this.hasMoreReviews = false; 
        }
        console.log('Public reviews loaded/appended. Total:', this.publicReviews.length, 'Has More:', this.hasMoreReviews);

      } catch (err: any) {
        this.error = err.message || 'Failed to load public reviews.';
        console.error('Error loading public reviews:', err);
      } finally {
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    },

    /**
     * Fetches a single public review by its ID for the detail view.
     * @param reviewId - The ID of the review to fetch.
     */
    async loadSingleReviewDetail(reviewId: number) {
        this.isLoadingDetail = true;
        this.error = null;
        this.currentReviewDetail = null;
        try {
            const review = await fetchSinglePublicReviewApi(reviewId);
            if (review) {
                this.currentReviewDetail = review;
            } else {
                this.error = `Review with ID ${reviewId} not found.`;
            }
        } catch (err: any) {
            this.error = err.message || `Failed to load review ${reviewId}.`;
            console.error(`Error loading review ${reviewId}:`, err);
        } finally {
            this.isLoadingDetail = false;
        }
    },

    /**
     * Simulates liking a review and updates the like count locally.
     * @param reviewId - The ID of the review to like.
     */
    async likeReview(reviewId: number) {
      const reviewIndex = this.publicReviews.findIndex(r => r.reviewId === reviewId);
      if (reviewIndex !== -1) {
        // Optimistic update
        this.publicReviews[reviewIndex].likeCount++;
        try {
          const newLikeCount = await likePublicReviewApi(reviewId);
          if (newLikeCount === null) { // API call failed or review not found
            this.publicReviews[reviewIndex].likeCount--; // Revert optimistic update
            console.warn('Failed to persist like for review:', reviewId);
          } else {
            // Optional: update with server's count if different, though usually it's just an increment
            // this.publicReviews[reviewIndex].likeCount = newLikeCount; 
          }
        } catch (err) {
          this.publicReviews[reviewIndex].likeCount--; // Revert on error
          console.error('Error liking review:', err);
        }
      }
      // If on detail view, update that too
      if (this.currentReviewDetail?.reviewId === reviewId) {
          this.currentReviewDetail.likeCount++; // Optimistic update
          // Similar API call and error handling as above could be added here if needed
      }
    },

    /**
     * Fetches related public reviews for a given product ID, excluding the current review.
     * @param productId - The ID of the product.
     * @param currentReviewId - The ID of the review currently being viewed, to exclude it.
     */
    async loadRelatedPublicReviews(productId: number, currentReviewId: number) {
      if (!productId) return;
      this.isLoadingRelated = true;
      this.error = null; // Clear previous errors specific to this action if any
      try {
        const reviews = await fetchRelatedPublicReviewsApi(productId, currentReviewId, 2); // Fetch 2 related items
        this.relatedPublicReviews = reviews;
        console.log('Related public reviews loaded:', this.relatedPublicReviews.length);
      } catch (err: any) {
        this.error = err.message || 'Failed to load related reviews.';
        console.error('Error loading related public reviews:', err);
        this.relatedPublicReviews = []; // Clear on error
      } finally {
        this.isLoadingRelated = false;
      }
    },

    /**
     * Clears all discover page data. Typically called on user logout.
     */
    clearDiscoverData() {
      this.publicReviews = [];
      this.currentReviewDetail = null;
      this.isLoading = false;
      this.isLoadingMore = false;
      this.isLoadingDetail = false;
      this.error = null;
      this.currentPage = 1;
      this.hasMoreReviews = true;
      this.relatedPublicReviews = []; // Clear related reviews too
      this.isLoadingRelated = false;
      console.log('Discover data cleared from store.');
    }
  },
});