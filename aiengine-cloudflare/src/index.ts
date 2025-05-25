import { Hono } from "hono";
import { getImageEmbedding } from "./imageEncode";
import OpenAI from "openai";
import { directImageUploadSchema, base64ImageUploadSchema, healthSuggestionSchema, directImageUploadHealthSuggestionSchema } from "./zodSchema";
import { image2Base64 } from "./utils";
import { zValidator } from "@hono/zod-validator";
import { getProductInformation } from "./productInformation";
import { getHealthSuggestion } from "./healthSuggestion";

type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("AI engine online");
});


// Image encoding related endpoints
app.post("/image-encode", zValidator('json', base64ImageUploadSchema), async (c) => {
  const data = c.req.valid("json");

  const base64Image = data.image;
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const encodeResult = await getImageEmbedding(base64Image, openaiClient);
  // Return the result as JSON
  return c.json(encodeResult);
})


app.post("/image-encode/direct", zValidator('form', directImageUploadSchema), async (c) => {
  const data = c.req.valid("form");
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const imageBase64 = await image2Base64(data.file);
  const encodeResult = await getImageEmbedding(imageBase64, openaiClient);
  // Return the result as JSON
  return c.json(encodeResult);
});


// Image text recognition related endpoints
app.post("/product-info", zValidator('json', base64ImageUploadSchema), async (c) => {
  const data = c.req.valid("json");

  const base64Image = data.image;
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const textRecognitionResult = await getProductInformation(base64Image, openaiClient);
  // Return the result as JSON
  return c.json(textRecognitionResult);
})

app.post("/product-info/direct", zValidator('form', directImageUploadSchema), async (c) => {
  const data = c.req.valid("form");
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const imageBase64 = await image2Base64(data.file);
  const textRecognitionResult = await getProductInformation(imageBase64, openaiClient);
  // Return the result as JSON
  return c.json(textRecognitionResult);
});


// Health suggestion related endpoints
app.post("/health-suggestion", zValidator('json', healthSuggestionSchema), async (c) => {
  const data = c.req.valid("json");

  const base64Image = data.image;
  const dietaryPref = data.dietaryPref;
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const healthSuggestionResult = await getHealthSuggestion(dietaryPref, base64Image, openaiClient);
  // Return the result as JSON
  return c.json(healthSuggestionResult);
})


app.post("/health-suggestion/direct", zValidator('form', directImageUploadHealthSuggestionSchema), async (c) => {
  const data = c.req.valid("form");
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const imageBase64 = await image2Base64(data.file);
  const healthSuggestionResult = await getHealthSuggestion(data.dietaryPref, imageBase64, openaiClient);
  // Return the result as JSON
  return c.json(healthSuggestionResult);
});


export default app;
