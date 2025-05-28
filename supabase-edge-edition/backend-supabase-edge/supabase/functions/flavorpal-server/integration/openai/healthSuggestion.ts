import OpenAI from "jsr:@openai/openai";
import { z } from "npm:zod";
import { zodTextFormat } from "npm:openai/helpers/zod";

const prompt = `
You are an agent that is responsible for providing health suggestions based on the product in the images being inputted.

Input: The user will provide you with an image of a product's ingredient table, and text about his/her dietary preferences/restrictions.
Output: 
- If there is no product in the image, or it seems that there is no ingredient table, or if the text input is not related to dietary preferences/restrictions,
set "success" to false, opinion to "unknown", and say the reason in the "reason" field.
- Otherwise, fill in according to the schema provided, use your health knowledge to provide the best suggestion. You can use "neutral" if you are not sure about the suggestion.
`;

const model = "gpt-4.1-mini";

const schema = z.object({
  success: z.boolean(),
  opinion: z.enum(["ok", "neutral", "avoid", "unknown"]),
  reason: z.string(),
})

export const getHealthSuggestion = async (dietaryPref: string, imageBase64: string) => {
  const client = new OpenAI();
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
            text: dietaryPref,
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
      format: zodTextFormat(schema, "healthSuggestion"),
    }
  });

  return {
    model,
    response: response.output_parsed,
  };
};
