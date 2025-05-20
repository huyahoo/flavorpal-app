import { Hono } from "hono";
import { getImageEmbedding } from "./imageEncode";
import { z } from "zod";
import OpenAI from "openai";
import { directImageUploadSchema, base64ImageUploadSchema } from "./zodSchema";
import { image2Base64 } from "./utils";

type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("AI engine online");
});

// This endpoint will accept base64 encoded image data
app.post("/image-encode", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch (error) {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  try {
    base64ImageUploadSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: error.errors }, 400);
    }
  }
  const base64Image = body.image;
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const encodeResult = await getImageEmbedding(base64Image, openaiClient);
  // Return the result as JSON
  return c.json(encodeResult);
})


app.post("/image-encode/direct", async (c) => {
  const requestBody = await c.req.parseBody();
  const fileInput = requestBody["file"];
  if (!fileInput) {
    return c.json({ error: "No file provided" }, 400);
  }
  try {
    directImageUploadSchema.parse(fileInput);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: error.errors }, 400);
    }
  }
  const file = fileInput as File;
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const imageBase64 = await image2Base64(file);
  const encodeResult = await getImageEmbedding(imageBase64, openaiClient);
  // Return the result as JSON
  return c.json(encodeResult);
});

export default app;
