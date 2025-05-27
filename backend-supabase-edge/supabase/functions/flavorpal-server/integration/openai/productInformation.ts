import OpenAI from "jsr:@openai/openai";
import { z } from "npm:zod";
import { zodTextFormat } from "npm:openai/helpers/zod";

const prompt = `
You are a visual agent that is responsible for extracting the key information of a product in the images being inputted.

DO NOT TRANSLATE THE PRODUCT NAME AND MANUFACTURER, KEEP IT IN ITS NATIVE LANGUAGE. GIVE FULL NAME.
However, product description should be in English.
If there is no product in the image, set the "detected" field to "false" and keep other fields empty.
If the manufacturer is not in sight, set the "productManufacturer" field to "unknown".
Also, give a brief description of the product, including its appearance and other reasonable inferred aspects.
`;

const model = "gpt-4.1-mini";

const schema = z.object({
  detected: z.boolean(),
  productName: z.string(),
  productManufacturer: z.string(),
  productDescription: z.string(),
})

export const getProductInformation = async (imageBase64: string, client: OpenAI) => {
  // Retrieve the text description of the image
  const response = await client.responses.parse({
    model,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: prompt }],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "",
          },
          {
            type: "input_image",
            image_url: imageBase64,
            detail: "auto",
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(schema, "productDescription"),
    }
  });

  return {
    model,
    response: response.output_parsed,
  };
};
