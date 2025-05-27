import getSupabaseClient from "../client.ts";
import { getImageEmbedding } from "../integration/openai/imageEncode.ts";
import { getProductInformation } from "../integration/openai/productInformation.ts";
import { getOpenFoodFactProduct } from "./openFoodFact.ts";

export const registerProductByBarcode = async (barcode: string, userId: string) => {
  // 1. Get the information from Open Food Facts
  const { success, data: openFoodFactData, msg } = await getOpenFoodFactProduct(barcode);
  if (!success) {
    return {
      success: false,
      data: null,
      msg: `Failed to fetch product data from Open Food Facts - ${msg}`,
    }
  }
  // 2. Call OpenAI for image embedding analytics and ai health suggestions
  const mergedImageUrl = openFoodFactData?.image_url || openFoodFactData?.image_front_url;
  const imageEmbeddingResponse = mergedImageUrl ? await getImageEmbedding(mergedImageUrl) : null;
  const imageEmbeddingString = imageEmbeddingResponse ? `[${imageEmbeddingResponse.textDescriptionEmbedding.join(',')}]` : null;
  // 3. Initiate supabase client and save to database
  // Save to product table
  const client = getSupabaseClient();
  const productInsertionData = {
    barcode: openFoodFactData!.barcode,
    image_url: mergedImageUrl,
    generic_name: openFoodFactData?.generic_name_en || openFoodFactData?.generic_name,
    ingredients: openFoodFactData?.image_ingredients_url,
    categories: openFoodFactData?.categories,
    brands: openFoodFactData?.brands,
    name: openFoodFactData?.product_name_en || openFoodFactData?.product_name || openFoodFactData?.generic_name_en || openFoodFactData?.generic_name || "Unknown Product Name",
    image_embedding: imageEmbeddingString,
  }
  const productInsertionResult = await client
    .from("products")
    .insert(productInsertionData)
    .select()
  if (productInsertionResult.error) {
    return {
      success: false,
      data: null,
      msg: `Failed to insert product into database: ${productInsertionResult.error.message}`,
    }
  }
  // Save to history table
  const historyInsertionResult = await client
    .from("history")
    .insert({
      user_id: userId,
      product_id: productInsertionResult.data[0].id,
    })
  if (historyInsertionResult.error) {
    return {
      success: false,
      data: null,
      msg: `Failed to insert history into database: ${historyInsertionResult.error.message}`,
    }
  }
  // Save to ai suggestions table, with empty suggestions
  const aiSuggestionsInsertionResult = await client
    .from("ai_suggestions")
    .insert({
      user_id: userId,
      product_id: productInsertionResult.data[0].id,
      opinion: null,
      reason: null,
    })
  if (aiSuggestionsInsertionResult.error) {
    return {
      success: false,
      data: null,
      msg: `Failed to insert AI suggestions into database: ${aiSuggestionsInsertionResult.error.message}`,
    }
  }
  return {
    success: true,
    data: productInsertionResult.data[0],
    msg: "Product registered successfully",
  }
}

export const registerProductByImgBase64 = async (imageBase64: string, userId: string) => {
  // 1. Call OpenAI for OCR
  const productInformation = await getProductInformation(imageBase64);
  if (!productInformation) {
    return {
      success: false,
      data: null,
      msg: "Failed to extract product information from image",
    }
  }
  // 2. Get the image embedding
  const imageEmbeddingResponse = await getImageEmbedding(imageBase64);
  const imageEmbeddingString = `[${imageEmbeddingResponse.textDescriptionEmbedding.join(',')}]`;
  // 3. Initiate supabase client and save to database
  const client = getSupabaseClient();
  const productInsertionData = {
    barcode: null,
    image_url: imageBase64,
    generic_name: productInformation.response?.productName || null,
    ingredients: null,
    categories: null,
    brands: productInformation.response?.productManufacturer || null,
    name: productInformation.response?.productName || "Unknown Product Name",
    image_embedding: imageEmbeddingString,
  }
  const productInsertionResult = await client
    .from("products")
    .insert(productInsertionData)
    .select()
  if (productInsertionResult.error) {
    return {
      success: false,
      data: null,
      msg: `Failed to insert product into database: ${productInsertionResult.error.message}`,
    }
  }
  // Save to history table
  const historyInsertionResult = await client
    .from("history")
    .insert({
      user_id: userId,
      product_id: productInsertionResult.data[0].id,
    })
  if (historyInsertionResult.error) {
    return {
      success: false,
      data: null,
      msg: `Failed to insert history into database: ${historyInsertionResult.error.message}`,
    }
  }
  // Save to ai suggestions table, with empty suggestions
  const aiSuggestionsInsertionResult = await client
    .from("ai_suggestions")
    .insert({
      user_id: userId,
      product_id: productInsertionResult.data[0].id,
      opinion: null,
      reason: null,
    })
  if (aiSuggestionsInsertionResult.error) {
    return {
      success: false,
      data: null,
      msg: `Failed to insert AI suggestions into database: ${aiSuggestionsInsertionResult.error.message}`,
    }
  }
  return {
    success: true,
    data: productInsertionResult.data[0],
    msg: "Product registered successfully", 
  }
}