import OpenAI from "jsr:@openai/openai";
import { z } from "npm:zod";
import { zodTextFormat } from "npm:openai/helpers/zod";

const prompt = `
You are a visual agent
that is responsible for describing the product in the images being inputted.
The description you provided will be used as text embeddings to be searched in the database.
Make sure your description is clear.

Your description should be done IN ENGLISH, EXCEPT for the product name, which should be in its native language.

Follow those aspects when describing the products:
- The name of the product, AS IN ITS DESCRIBED NATIVE LANGUAGE, DO NOT TRANSLATE ITS NAME
- The type of the product.
- The manufacturer of the product, IF IN SIGHT

Describe clear yet concisely.
Remember that your words will be served as DISCRIMINATIVE EMBEDDINGS to tell different products apart in the database
so remove unrelated information, such as background, who is holding it, etc.

If there are multiple products in the scene, describe the ones that are:
* Have the largest portion in the screen
* Being handheld, if the photo taker is holding the object
* If none above, the one with the most semantic meaning
`;

const descriptionModel = "gpt-4.1-mini";
const textEmbeddingModel = "text-embedding-3-small";

const schema = z.object({
  productName: z.string(),
  productType: z.string(),
  productManufacturer: z.string(),
})

export const getImageEmbedding = async (imageBase64OrLink: string) => {
  const client = new OpenAI();
  // Retrieve the text description of the image
  const textDescriptionResponse = await client.responses.parse({
    model: descriptionModel,
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
            image_url: imageBase64OrLink,
            detail: "auto",
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(schema, "imageDescription"),
    },
  });

  const textDescription = JSON.stringify(textDescriptionResponse.output_parsed, null, 2);

  // Retrieve text embedding of the description
  const textDescriptionEmbeddingResponse = await client.embeddings.create({
    model: textEmbeddingModel,
    input: textDescription,
    encoding_format: "float",
  });

  const textDescriptionEmbedding =
    textDescriptionEmbeddingResponse.data[0].embedding;

  return {
    descriptionModel,
    textEmbeddingModel,
    textDescriptionEmbeddingDimensions: textDescriptionEmbedding.length,
    textDesciription: textDescription,
    textDescriptionEmbedding: textDescriptionEmbedding,
  };
};
