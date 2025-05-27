import { Hono } from "jsr:@hono/hono";
import getSupabaseClient from "../client.ts";
import { requireAuth } from "../middleware/auth.ts";
import { registerProductByBarcode, registerProductByImgBase64 } from "./productRegister.ts";
import { User } from "npm:@supabase/auth-js@2.69.1";
import { getHealthSuggestion } from "../integration/openai/healthSuggestion.ts";
import { getCommonError, getCommonSuccess } from "../utils/commonResponse.ts";

type Variables = {
  user: User
}

const productRouter = new Hono<{ Variables: Variables }>()

productRouter.use(requireAuth);

productRouter.get("/", async (c) => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("product_interactions_view")
    .select("*");
  if (error) {
    return c.json({
      code: 500,
      data: null,
      msg: error.message,
    });
  }

  const productsInfo = data.map((item) => {
    return {
      id: item.product_id,
      name: item.name,
      barcode: item.barcode,
      brands: item.brands,
      imageUrl: item.image_url,
      categories: item.categories,
      isReviewed: item.is_reviewed,
      userRating: item.user_rating,
      userNotes: item.user_note,
      dateReviewed: item.date_reviewed,
      dateScanned: item.date_scanned,
      likeCounts: item.likes_count,
      aiHealthConclusion: item.ai_opinion,
      aiHealthSummary: item.ai_opinion,
    };
  });

  return c.json({
    code: 200,
    data: { products: productsInfo },
    msg: "",
  });
});


productRouter.get("/:id", async (c) => {
  const productId = c.req.param("id");
  // Parse to a number
  const parsedProductId = parseInt(productId, 10);
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("product_interactions_view")
    .select("*")
    .eq("product_id", parsedProductId)
    .limit(1)
    .single();
  
  if (error) {
    return c.json({
      code: 500,
      data: null,
      msg: error.message,
    });
  }

  if (!data) {
    return c.json({
      code: 404,
      data: null,
      msg: "Product not found",
    });
  }

  const productInfo = {
    id: data.product_id,
    name: data.name,
    barcode: data.barcode,
    brands: data.brands,
    imageUrl: data.image_url,
    categories: data.categories,
    isReviewed: data.is_reviewed,
    userRating: data.user_rating,
    userNotes: data.user_note,
    dateReviewed: data.date_reviewed,
    dateScanned: data.date_scanned,
    likeCounts: data.likes_count,
    aiHealthConclusion: data.ai_opinion,
    aiHealthSummary: data.ai_opinion,
  };

  return c.json({
    code: 200,
    data: productInfo,
    msg: "",
  });
});


productRouter.post("register/barcode", async (c) => {
  const { barcode } = await c.req.json();
  if (!barcode) {
    return c.json({
      code: 400,
      data: null,
      msg: "Barcode is required",
    });
  }
  const client = getSupabaseClient();
  // Check if the barcode already exists
  const viewResponsePrecheck = await client
    .from("product_interactions_view")
    .select("*")
    .eq("barcode", barcode)
    .limit(1);
  if (viewResponsePrecheck.error) {
    return c.json({
      code: 500,
      data: null,
      msg: "Error in retrieving interaction view" + viewResponsePrecheck.error.message,
    });
  }
  if (viewResponsePrecheck.data.length > 0) {
    // The product for this barcode already exists, return
    const data = viewResponsePrecheck.data[0];
    const productInfo = {
      id: data.product_id,
      name: data.name,
      barcode: data.barcode,
      brands: data.brands,
      imageUrl: data.image_url,
      categories: data.categories,
      isReviewed: data.is_reviewed,
      userRating: data.user_rating,
      userNotes: data.user_note,
      dateReviewed: data.date_reviewed,
      dateScanned: data.date_scanned,
      likeCounts: data.likes_count,
      aiHealthConclusion: data.ai_opinion,
      aiHealthSummary: data.ai_opinion,
    };
    return c.json({
      code: 200,
      data: productInfo,
      msg: "Product already exists",
    });
  }

  // Otherwise product does not exist. Call insertion.
  const result = await registerProductByBarcode(barcode, c.get("user").id);
  if (!result.success) {
    return c.json({
      code: 500,
      data: null,
      msg: result.msg,
    }, 500);
  }

  const { data: newData, error: newError } = await client
    .from("product_interactions_view")
    .select("*")
    .eq("barcode", barcode)
    .limit(1)
    .single();
  if (newError) {
    return c.json({
      code: 500,
      data: null,
      msg: newError.message,
    });
  }
  const productInfo = {
    id: newData.product_id,
    name: newData.name,
    barcode: newData.barcode,
    brands: newData.brands,
    imageUrl: newData.image_url,
    categories: newData.categories,
    isReviewed: newData.is_reviewed,
    userRating: newData.user_rating,
    userNotes: newData.user_note,
    dateReviewed: newData.date_reviewed,
    dateScanned: newData.date_scanned,
    likeCounts: newData.likes_count,
    aiHealthConclusion: newData.ai_opinion,
    aiHealthSummary: newData.ai_opinion,
  };
  return c.json({
    code: 200,
    data: productInfo,
    msg: "Product registered successfully",
  });
})


productRouter.post("register/photo", async (c) => {
  const { imageBase64 } = await c.req.json();
  if (!imageBase64) {
    return c.json({
      code: 400,
      data: null,
      msg: "Image base64 is required",
    });
  }
  const userId = c.get("user").id;
  const result = await registerProductByImgBase64(imageBase64, userId);
  if (!result.success) {
    return c.json({
      code: 500,
      data: null,
      msg: result.msg,
    }, 500);
  }
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("product_interactions_view")
    .select("*")
    .eq("product_id", result!.data!.id)
    .limit(1)
    .single();
  if (error) {
    return c.json({
      code: 500,
      data: null,
      msg: error.message,
    });
  }
  const productInfo = {
    id: data.product_id,
    name: data.name,
    barcode: data.barcode,
    brands: data.brands,
    imageUrl: data.image_url,
    categories: data.categories,
    isReviewed: data.is_reviewed,
    userRating: data.user_rating,
    userNotes: data.user_note,
    dateReviewed: data.date_reviewed,
    dateScanned: data.date_scanned,
    likeCounts: data.likes_count,
    aiHealthConclusion: data.ai_opinion,
    aiHealthSummary: data.ai_opinion,
  };
  return c.json({
    code: 200,
    data: productInfo,
    msg: "Product registered successfully",
  });
});


productRouter.patch("ai-suggestions", async (c) => {
  const { productId, imageBase64 } = await c.req.json();
  if (!imageBase64 || !productId) {
    return c.json({
      code: 400,
      data: null,
      msg: "Image base64 and product ID are required",
    })
  }
  const userId = c.get("user").id;
  // Get the user health flags
  const client = getSupabaseClient();
  const { data: userData, error: userError } = await client.auth.admin.getUserById(userId);
  if (userError) {
    return c.json({
      code: 500,
      data: null,
      msg: "Error retrieving user data: " + userError.message,
    });
  }
  const userHealthFlags = userData.user.user_metadata?.healthFlags || [];
  console.log("User health flags:", userHealthFlags);
  // Call OpenAI for analytics
  const result = await getHealthSuggestion(
    userHealthFlags.join(","),
    imageBase64,
  )
  if (!result.response?.success) {
    return c.json({
      code: 500,
      data: null,
      msg: "Error retrieving health suggestions from OpenAI",
    });
  }
  // Update the AI suggestions in the database
  const aiSuggestionResponse = await client
    .from("ai_suggestions")
    .update({
      opinion: result.response.opinion,
      reason: result.response.reason,
    })
    .eq("product_id", productId)
    .eq("user_id", userId)
    .select()
    .single();
  if (aiSuggestionResponse.error) {
    return c.json({
      code: 500,
      data: null,
      msg: "Error updating AI suggestions in the database: " + aiSuggestionResponse.error.message,
    });
  }
  // Return the full product interaction
  const { data, error } = await client
    .from("product_interactions_view")
    .select("*")
    .eq("product_id", productId)
    .limit(1)
    .single();
  if (error) {
    return c.json({
      code: 500,
      data: null,
      msg: error.message,
    });
  }
  const productInfo = {
    id: data.product_id,
    name: data.name,
    barcode: data.barcode,
    brands: data.brands,
    imageUrl: data.image_url,
    categories: data.categories,
    isReviewed: data.is_reviewed,
    userRating: data.user_rating,
    userNotes: data.user_note,
    dateReviewed: data.date_reviewed,
    dateScanned: data.date_scanned,
    likeCounts: data.likes_count,
    aiHealthConclusion: data.ai_opinion,
    aiHealthSummary: data.ai_reason,
  };
  return c.json({
    code: 200,
    data: productInfo,
    msg: "Product registered successfully",
  });
});


productRouter.delete("/:id", async (c) => {
  // Actually is delete the history. The product will be persisted in the database because of RLS.
  const productId = parseInt(c.req.param("id"));
  const userId = c.get("user").id;
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("history")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userId)
    .select()
  if (error) {
    return c.json(getCommonError(error.message, 500))
  }
  if (data.length === 0) {
    return c.json(getCommonError("No history found for this product", 404))
  }
  return c.json(getCommonSuccess(data[0], "History deleted successfully"))
})

export default productRouter;