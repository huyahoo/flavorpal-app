// src/services/discoverService.ts
import type { PublicReviewItem } from '../types';

// Mock database of public reviews
const allPublicReviews: PublicReviewItem[] = Array.from({ length: 30 }, (_, i) => {
    const reviewDate = new Date(2025, 4, 20 - i); // Decreasing dates for recency
    const userNum = (i % 5) + 1;
    const productNum = (i % 7) + 1;
    const ratings = [3, 3.5, 4, 4.5, 5];
    const notesSamples = [
        "Absolutely loved this! The flavor was incredible and it was very fresh.",
        "Pretty good, but I've had better. Might buy again if it's on sale.",
        "Not a fan of the texture, but the taste was okay. Worth trying once.",
        "A new favorite! Shared it with friends and they all enjoyed it too.",
        "Decent product for the price. Good for a quick snack.",
        "The packaging was nice, and the product itself was quite unique.",
        "I was expecting more based on the hype, but it's not bad at all."
    ];

    return {
        reviewId: `pub_rev_${1000 + i}`,
        productId: `prod_id_${productNum}`,
        productName: `Product Name ${productNum}`,
        productImageUrl: `https://placehold.co/400x300/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=Product${productNum}&font=roboto`,
        reviewerId: `user_${userNum}`,
        reviewerUsername: `User ${String.fromCharCode(65 + userNum -1)}`, // User A, User B, etc.
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + userNum -1)}&font=roboto`,
        userRating: ratings[i % ratings.length],
        userNotes: notesSamples[i % notesSamples.length] + ` (Review for Product ${productNum})`,
        dateReviewed: reviewDate.toISOString(),
        likeCount: Math.floor(Math.random() * 200) + 5,
    };
});

/**
 * Simulates fetching a paginated list of public reviews from other users.
 * @param page - The page number to fetch (1-indexed).
 * @param limit - The number of items per page.
 * @returns A Promise that resolves to an object containing reviews and pagination info.
 */
export const fetchPublicReviewsApi = async (
  page: number = 1, 
  limit: number = 5
): Promise<{ reviews: PublicReviewItem[], hasMore: boolean, nextPage: number | null }> => {
  console.log(`Mock API Call: Fetching Public Reviews - Page ${page}, Limit ${limit}`);
  await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500)); // Simulate network delay

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = allPublicReviews.slice(startIndex, endIndex);

  const hasMore = endIndex < allPublicReviews.length;
  const nextPage = hasMore ? page + 1 : null;

  return { 
    reviews: paginatedReviews, 
    hasMore,
    nextPage 
  };
};

/**
 * Simulates fetching a single public review by its ID.
 * @param reviewId - The ID of the review to fetch.
 * @returns A Promise resolving to the PublicReviewItem or null if not found.
 */
export const fetchSinglePublicReviewApi = async (reviewId: string): Promise<PublicReviewItem | null> => {
    console.log(`Mock API Call: Fetching Single Public Review - ID ${reviewId}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    const foundReview = allPublicReviews.find(review => review.reviewId === reviewId);
    return foundReview || null;
};

/**
 * Simulates liking a review.
 * @param reviewId - The ID of the review to like.
 * @returns A Promise resolving to the new like count.
 */
export const likePublicReviewApi = async (reviewId: string): Promise<number | null> => {
    console.log(`Mock API Call: Liking Review - ID ${reviewId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    const reviewIndex = allPublicReviews.findIndex(review => review.reviewId === reviewId);
    if (reviewIndex !== -1) {
        allPublicReviews[reviewIndex].likeCount++;
        return allPublicReviews[reviewIndex].likeCount;
    }
    return null;
};

/**
 * Simulates fetching "related" public reviews.
 * For mock, "related" means other reviews for the same product ID.
 * @param productId - The ID of the product for which to find related reviews.
 * @param excludeReviewId - The ID of the current review to exclude from related list.
 * @param limit - The maximum number of related reviews to return.
 * @returns A Promise resolving to an array of PublicReviewItem objects.
 */
export const fetchRelatedPublicReviewsApi = async (
  productId: string,
  excludeReviewId: string,
  limit: number = 2
): Promise<PublicReviewItem[]> => {
  console.log(`Mock API Call: Fetching Related Public Reviews for Product ID ${productId}, excluding ${excludeReviewId}`);
  await new Promise(resolve => setTimeout(resolve, 450)); // Simulate network delay

  const related = allPublicReviews.filter(review => 
    review.productId === productId && review.reviewId !== excludeReviewId
  );

  return related.slice(0, limit);
};