import OpenAI from "openai";

const prompt = `
You are a visual agent
that is responsible for describing the product in the images being inputted.
The description you provided will be used as text embeddings to be searched in the database.
Make sure your description is clear.

Your description should be done IN ENGLISH, EXCEPT for the product name, which should be in its native language.

Follow those aspects when describing the products:
1. The name of the product, AS IN ITS DESCRIBED NATIVE LANGUAGE, DO NOT TRANSLATE ITS NAME
2. The type of the product.
3. The manufacturer of the product, IF IN SIGHT
4. The appearance of the product, including color
5. Other important aspects that can help discriminate a product from others

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

export const getImageEmbedding = async (imageBase64: string, client: OpenAI) => {
  // Retrieve the text description of the image
  const textDescriptionResponse = await client.responses.create({
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
            image_url: imageBase64,
            detail: "auto",
          },
        ],
      },
    ],
  });

  const textDescription = textDescriptionResponse.output_text;

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
    textDesciription: textDescription,
    textDescriptionEmbedding: textDescriptionEmbedding,
  };
};
