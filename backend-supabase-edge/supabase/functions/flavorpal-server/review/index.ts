import { Hono } from "jsr:@hono/hono";
import getSupabaseClient from "../client.ts";
import { requireAuth } from "../middleware/auth.ts";
import { User } from "npm:@supabase/auth-js@2.69.1";
import { getCommonError, getCommonSuccess } from "../utils/commonResponse.ts";
import { Json } from "../database.types.ts";
import { z } from "npm:zod";

type Variables = {
  user: User
}

const reviewRouter = new Hono<{ Variables: Variables }>()

reviewRouter.use("*", requireAuth);

// Gets all reviews
reviewRouter.get("/", async (c) => {
  const client = getSupabaseClient();
  const { data: reviewData, error: reviewError } = await client
    .from("reviews_view")
    .select()
    .order("date_reviewed", { ascending: false });
  if (reviewError) {
    return c.json(getCommonError(reviewError.message));
  }
  const getUsername = (reviewerMetadata: Json) => {
    // Parse as json
    try {
      const metadata = JSON.parse(reviewerMetadata as string);
      return metadata.username || "Unknown";
    } catch (error) {
      console.error("Error parsing reviewer metadata:", error);
      return "Unknown";
    }
  }
  const dtos = reviewData.map((review) => {
    return {
      reviewId: review.review_id,
      productId: review.product_id,
      productBarcode: review.product_barcode,
      productName: review.product_name,
      productBrands: review.product_brands,
      productImageUrl: review.product_image_url,
      productRating: review.review_rating,
      productNote: review.review_note,
      reviewerId: review.reviewer_id,
      reviewerUsername: getUsername(review.reviewer_metadata),
      dateReviewed: review.date_reviewed,
      likeCount: review.likes_count,
      aiHealthConclusion: review.ai_health_opinion,
      aiHealthSummary: review.ai_health_reason
    };
  })
  return c.json(getCommonSuccess(dtos, "Reviews fetched successfully"));
})

// Gets a review by ID
reviewRouter.get("/:id", async (c) => {
  const reviewId = parseInt(c.req.param("id"), 10);
  if (!reviewId) {
    return c.json(getCommonError("Review ID is required", 400));
  }
  const client = getSupabaseClient();
  const { data: reviewData, error: reviewError } = await client
    .from("reviews_view")
    .select()
    .eq("review_id", reviewId)
    .single();
  if (reviewError) {
    return c.json(getCommonError(reviewError.message));
  }
  if (!reviewData) {
    return c.json(getCommonError("Review not found", 404));
  }
  const getUsername = (reviewerMetadata: Json) => {
    try {
      const metadata = JSON.parse(reviewerMetadata as string);
      return metadata.username || "Unknown";
    } catch (error) {
      console.error("Error parsing reviewer metadata:", error);
      return "Unknown";
    }
  }
  const dto = {
    reviewId: reviewData.review_id,
    productId: reviewData.product_id,
    productBarcode: reviewData.product_barcode,
    productName: reviewData.product_name,
    productBrands: reviewData.product_brands,
    productImageUrl: reviewData.product_image_url,
    productRating: reviewData.review_rating,
    productNote: reviewData.review_note,
    reviewerId: reviewData.reviewer_id,
    reviewerUsername: getUsername(reviewData.reviewer_metadata),
    dateReviewed: reviewData.date_reviewed,
    likeCount: reviewData.likes_count,
    aiHealthConclusion: reviewData.ai_health_opinion,
    aiHealthSummary: reviewData.ai_health_reason
  };
  return c.json(getCommonSuccess(dto, "Review fetched successfully"));
}
)

// Add a review
const postReviewSchema = z.object({
  productId: z.number().int(),
  userRating: z.number().int(),
  userNote: z.string().optional(),
})
reviewRouter.post("/", async (c) => {
  const body = await c.req.json();
  const parsedBody = postReviewSchema.safeParse(body);
  if (!parsedBody.success) {
    return c.json(getCommonError("Invalid request body", 400));
  }
  const { productId, userRating, userNote } = parsedBody.data;
  const userId = c.get("user").id; // Get user ID from auth middleware
  const client = getSupabaseClient();
  const { data: _reviewData, error: reviewError } = await client
    .from("reviews")
    .insert(
      {
        likes_count: 0,
        product_id: productId,
        user_id: userId,
        rating: userRating,
        note: userNote || null,
      }
    )
    .select()
    .single();
  if (reviewError) {
    return c.json(getCommonError(reviewError.message));
  }
  return c.json(getCommonSuccess({}, "Successfully", 201));
})

// Update a review
const updateReviewSchema = z.object({
  reviewId: z.number().int(),
  userRating: z.number().int(),
  userNote: z.string().optional(),
})
reviewRouter.put("/", async (c) => {
  const body = await c.req.json();
  const parsedBody = updateReviewSchema.safeParse(body);
  if (!parsedBody.success) {
    return c.json(getCommonError("Invalid request body", 400));
  }
  const { reviewId, userRating, userNote } = parsedBody.data;
  const userId = c.get("user").id; // Get user ID from auth middleware
  const client = getSupabaseClient();
  const { data: _reviewData, error: reviewError } = await client
    .from("reviews")
    .update({
      rating: userRating,
      note: userNote || null,
    })
    .eq("review_id", reviewId)
    .eq("user_id", userId)
    .select()
    .single();
  if (reviewError) {
    return c.json(getCommonError(reviewError.message));
  }
  return c.json(getCommonSuccess({}, "Successfully"));
})


// Add like to a review
const likeReviewSchema = z.object({
  reviewId: z.number().int(),
})
reviewRouter.post("like", async (c) => {
  const body = await c.req.json();
  const parsedBody = likeReviewSchema.safeParse(body);
  if (!parsedBody.success) {
    return c.json(getCommonError("Invalid request body", 400));
  }
  const { reviewId } = parsedBody.data;
  // Just add one like to the review
  const client = getSupabaseClient();
  // Get the review
  const { data: reviewData, error: reviewError } = await client
    .from("reviews")
    .select()
    .eq("id", reviewId)
    .single();
  if (reviewError) {
    return c.json(getCommonError(reviewError.message));
  }
  reviewData.likes_count = (reviewData.likes_count || 0) + 1;
  const { data: _reviewData, error: updateError } = await client
    .from("reviews")
    .update({
      likes_count: reviewData.likes_count,
    })
    .eq("id", reviewId)
    .select()
    .single();
  if (updateError) {
    return c.json(getCommonError(updateError.message));
  }
  return c.json(getCommonSuccess({}, "Successfully liked the review"));
})

export default reviewRouter;