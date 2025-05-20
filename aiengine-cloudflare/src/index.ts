import { Hono } from "hono";
import { getImageEmbedding } from "./imageEncode";
import OpenAI from "openai";
import { directImageUploadSchema, base64ImageUploadSchema } from "./zodSchema";
import { image2Base64 } from "./utils";
import { zValidator } from "@hono/zod-validator";

type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("AI engine online");
});


// This endpoint will accept base64 encoded image data
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


export default app;
