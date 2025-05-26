import { Hono } from "jsr:@hono/hono";
import getSupabaseClient from "../client.ts";
import { requireAuth } from "../middleware/auth.ts";


const productRouter = new Hono();

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