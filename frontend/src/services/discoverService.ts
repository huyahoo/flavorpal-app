// src/services/discoverService.ts
import type { PublicReviewItem } from '../types';

const allReviewsProducts: PublicReviewItem[] = [
    {
        reviewId: 1,
        productId: 1,
        productName: "Authentic Greek Yogurt",
        productBrands: "Brooklea",
        productCategories: "Dairies,Fermented foods,Desserts,Yogurts",
        productImageUrl: "https://images.openfoodfacts.org/images/products/408/860/006/0880/front_en.49.400.jpg",
        reviewerId: 1,
        reviewerUsername: "Louis",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 5,
        userNotes: "Absolutely loved this! The flavor was incredible and it was very fresh.",
        dateReviewed: "2025-05-20, 10:45:21",
        likeCount: 52
    },
    {
        reviewId: 2,
        productId: 1,
        productName: "Authentic Greek Yogurt",
        productBrands: "Brooklea",
        productCategories: "Dairies,Fermented foods,Desserts,Yogurts",
        productImageUrl: "https://images.openfoodfacts.org/images/products/408/860/006/0880/front_en.49.400.jpg",
        reviewerId: 2,
        reviewerUsername: "Alex",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 4,
        userNotes: "Pretty good, but I've had better. Might buy again if it's on sale.",
        dateReviewed: "2025-04-20, 10:00:00",
        likeCount: 76
    },
    {
        reviewId: 3,
        productId: 2,
        productName: "Activia Céréales",
        productBrands: "Danone",
        productCategories: "Dairies,Fermented foods,Desserts,Yogurts",
        productImageUrl: "https://images.openfoodfacts.org/images/products/611/103/200/2208/front_fr.26.400.jpg",
        reviewerId: 3,
        reviewerUsername: "liyah198",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 4,
        userNotes: "Not a fan of the texture, but the taste was okay. Worth trying once.",
        dateReviewed: "2025-05-23, 14:46:23",
        likeCount: 123
    },
    {
        reviewId: 4,
        productId: 2,
        productName: "Activia Céréales",
        productBrands: "Danone",
        productCategories: "Dairies,Fermented foods,Desserts,Yogurts",
        productImageUrl: "https://images.openfoodfacts.org/images/products/611/103/200/2208/front_fr.26.400.jpg",
        reviewerId: 2,
        reviewerUsername: "takasugi205",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 3,
        userNotes: "Decent product for the price. Good for a quick snack.",
        dateReviewed: "2025-03-20, 12:11:10",
        likeCount: 123
    },
    {
        reviewId: 5,
        productId: 1,
        productName: "Authentic Greek Yogurt",
        productBrands: "Brooklea",
        productCategories: "Dairies,Fermented foods,Desserts,Yogurts",
        productImageUrl: "https://images.openfoodfacts.org/images/products/408/860/006/0880/front_en.49.400.jpg",
        reviewerId: 2,
        reviewerUsername: "lushy997",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 4,
        userNotes: "Pretty good, but I've had better. Might buy again if it's on sale.",
        dateReviewed: "2025-05-01, 10:00:00",
        likeCount: 76
    },
    {
        reviewId: 6,
        productId: 2,
        productName: "Activia Céréales",
        productBrands: "Danone",
        productCategories: "Dairies,Fermented foods,Desserts,Yogurts",
        productImageUrl: "https://images.openfoodfacts.org/images/products/611/103/200/2208/front_fr.26.400.jpg",
        reviewerId: 3,
        reviewerUsername: "HolaHollow",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 5,
        userNotes: "Not a fan of the texture, but the taste was okay. Worth trying once.",
        dateReviewed: "2025-05-01, 01:12:43",
        likeCount: 123
    },
    {
        reviewId: 7,
        productId: 3,
        productName: "Albeni Bar Cake",
        productBrands: "Ülker",
        productCategories: "Candy chocolate bars",
        productImageUrl: "https://images.openfoodfacts.org/images/products/869/050/406/3803/front_en.12.400.jpg",
        reviewerId: 2,
        reviewerUsername: "moshua712",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 2,
        userNotes: "Too sweet, but the taste was okay. Not for gluten-free people.",
        dateReviewed: "2025-05-16, 18:23:15",
        likeCount: 12
    },
    {
        reviewId: 8,
        productId: 4,
        productName: "Twix glacé x6",
        productBrands: "Twix",
        productCategories: "Snacks,Desserts,Snacks sucrés",
        productImageUrl: "https://images.openfoodfacts.org/images/products/500/015/948/4695/front_fr.85.400.jpg",
        reviewerId: 3,
        reviewerUsername: "khalil331",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 2,
        userNotes: "Slighly sweet, high calories. Don't eat if you're trying to lose weight.",
        dateReviewed: "2025-05-18, 11:24:34",
        likeCount: 2
    },
    {
        reviewId: 9,
        productId: 5,
        productName: "Orange juice",
        productBrands: "Coca cola",
        productCategories: "Cibi e bevande a base vegetale,Bevande,Bevande a base di piante,Succo e nettare",
        productImageUrl: "https://images.openfoodfacts.org/images/products/544/900/014/7417/front_en.73.400.jpg",
        reviewerId: 2,
        reviewerUsername: "moshua712",
        reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
        userRating: 2,
        userNotes: "I'm not a fan of orange juice, but this one is okay. taste like orange juice lol.",
        dateReviewed: "2025-05-17, 01:41:00",
        likeCount: 76
    },
    {
      reviewId: 10,
      productId: 4,
      productName: "Twix glacé x6",
      productBrands: "Twix",
      productCategories: "Snacks,Desserts,Snacks sucrés",
      productImageUrl: "https://images.openfoodfacts.org/images/products/500/015/948/4695/front_fr.85.400.jpg",
      reviewerId: 124,
      reviewerUsername: "aosdijf102",
      reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
      userRating: 2,
      userNotes: "Too sweet for me. Not my type of snack. But texture was good. For the price, it's not bad. Alsolutely for sweet lovers",
      dateReviewed: "2025-03-1, 11:24:34",
      likeCount: 2
  },
  {
      reviewId: 11,
      productId: 5,
      productName: "Orange juice",
      productBrands: "Coca cola",
      productCategories: "Cibi e bevande a base vegetale,Bevande,Bevande a base di piante,Succo e nettare",
      productImageUrl: "https://images.openfoodfacts.org/images/products/544/900/014/7417/front_en.73.400.jpg",
      reviewerId: 2,
      reviewerUsername: "jania2002",
      reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
      userRating: 2,
      userNotes: "I was expecting more based on the hype, but it's not bad at all.",
      dateReviewed: "2025-03-11, 01:41:00",
      likeCount: 1
  },
  {
      reviewId: 12,
      productId: 3,
      productName: "Albeni Bar Cake",
      productBrands: "Ülker",
      productCategories: "Candy chocolate bars",
      productImageUrl: "https://images.openfoodfacts.org/images/products/869/050/406/3803/front_en.12.400.jpg",
      reviewerId: 2,
      reviewerUsername: "Jenni Pham",
      reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
      userRating: 5,
      userNotes: "A new favorite! Shared it with friends and they all enjoyed it too.",
      dateReviewed: "2025-04-16, 18:23:15",
      likeCount: 12
  },
  {
      reviewId: 13,
      productId: 3,
      productName: "Albeni Bar Cake",
      productBrands: "Ülker",
      productCategories: "Candy chocolate bars",
      productImageUrl: "https://images.openfoodfacts.org/images/products/869/050/406/3803/front_en.12.400.jpg",
      reviewerId: 2,
      reviewerUsername: "Pamella",
      reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + Math.floor(Math.random()*26))}`,
      userRating: 4,
      userNotes: "The packaging was nice, and the product itself was quite unique.",
      dateReviewed: "2025-04-16, 18:23:15",
      likeCount: 12
  },
]

// sort by dateReviewed for allReviewsProducts
allReviewsProducts.sort((a, b) => new Date(b.dateReviewed).getTime() - new Date(a.dateReviewed).getTime());

// Mock database of public reviews
// const allPublicReviews: PublicReviewItem[] = Array.from({ length: 30 }, (_, i) => {
//     const reviewDate = new Date(2025, 4, 20 - i); // Decreasing dates for recency
//     const userNum = (i % 5) + 1;
//     const productNum = (i % 7) + 1;
//     const ratings = [3, 3.5, 4, 4.5, 5];
//     const notesSamples = [
//         "Absolutely loved this! The flavor was incredible and it was very fresh.",
//         "Pretty good, but I've had better. Might buy again if it's on sale.",
//         "Not a fan of the texture, but the taste was okay. Worth trying once.",
//         "A new favorite! Shared it with friends and they all enjoyed it too.",
//         "Decent product for the price. Good for a quick snack.",
//         "The packaging was nice, and the product itself was quite unique.",
//         "I was expecting more based on the hype, but it's not bad at all."
//     ];

//     return {
//         reviewId: `pub_rev_${1000 + i}`,
//         productId: `prod_id_${productNum}`,
//         productName: `Product Name ${productNum}`,
//         productImageUrl: `https://placehold.co/400x300/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=Product${productNum}&font=roboto`,
//         reviewerId: `user_${userNum}`,
//         reviewerUsername: `User ${String.fromCharCode(65 + userNum -1)}`, // User A, User B, etc.
//         reviewerAvatarUrl: `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${String.fromCharCode(65 + userNum -1)}&font=roboto`,
//         userRating: ratings[i % ratings.length],
//         userNotes: notesSamples[i % notesSamples.length] + ` (Review for Product ${productNum})`,
//         dateReviewed: reviewDate.toISOString(),
//         likeCount: Math.floor(Math.random() * 200) + 5,
//     };
// });

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
  const paginatedReviews = allReviewsProducts.slice(startIndex, endIndex);

  const hasMore = endIndex < allReviewsProducts.length;
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
export const fetchSinglePublicReviewApi = async (reviewId: number): Promise<PublicReviewItem | null> => {
    console.log(`Mock API Call: Fetching Single Public Review - ID ${reviewId}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    const foundReview = allReviewsProducts.find(review => review.reviewId == reviewId);
    return foundReview || null;
};

/**
 * Simulates liking a review.
 * @param reviewId - The ID of the review to like.
 * @returns A Promise resolving to the new like count.
 */
export const likePublicReviewApi = async (reviewId: number): Promise<number | null> => {
    console.log(`Mock API Call: Liking Review - ID ${reviewId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    const reviewIndex = allReviewsProducts.findIndex(review => review.reviewId == reviewId);
    if (reviewIndex !== -1) {
        allReviewsProducts[reviewIndex].likeCount++;
        return allReviewsProducts[reviewIndex].likeCount;
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
  productId: number,
  excludeReviewId: number,
  limit: number = 2
): Promise<PublicReviewItem[]> => {
  console.log(`Mock API Call: Fetching Related Public Reviews for Product ID ${productId}, excluding ${excludeReviewId}`);
  await new Promise(resolve => setTimeout(resolve, 450)); // Simulate network delay

  const related = allReviewsProducts.filter(review => 
    review.productId === productId && review.reviewId !== excludeReviewId
  );

  return related.slice(0, limit);
};