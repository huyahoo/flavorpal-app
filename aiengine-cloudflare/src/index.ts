import { Hono } from "hono";
import { getImageEmbedding } from "./image-encode";
import OpenAI from "openai";

type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("AI engine online");
});

app.post("/image-encode", async (c) => {
  const requestBody = await c.req.parseBody();
  const file = requestBody["file"] as File;
  if (!file) {
    return c.json({ error: "No file provided" }, 400);
  }
  c.env;
  const openaiClient = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });
  const encodeResult = await getImageEmbedding(file, openaiClient);
  // Return the result as JSON
  return c.json(encodeResult);
});

export default app;
