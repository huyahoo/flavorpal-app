import { z } from "npm:zod";

const openFoodFactSchema = z.object({
  product: z.object({
    product_name_en: z.string().optional(),
    product_name: z.string().optional(),
    generic_name_en: z.string().optional(),
    generic_name: z.string().optional(),
    image_url: z.string().url().optional(),
    image_front_url: z.string().url().optional(),
    image_nutrition_url: z.string().url().optional(),
    image_ingredients_url: z.string().url().optional(),
    categories: z.string().optional(),
    brands: z.string().optional(),
  })
})

export type OpenFoodFactResponse = z.infer<typeof openFoodFactSchema>["product"] & {
  barcode: string;
}

const openFoodFactEndpoint = "https://world.openfoodfacts.org/api/v2/product"

export const getOpenFoodFactProduct = async (barcode: string) => {
  console.log(`Fetching product data for barcode: ${barcode} from Open Food Facts`);
  const response = await fetch(`${openFoodFactEndpoint}/${barcode}.json`, {
    method: "GET",
  });

  if (!response.ok) {
    return {
      success: false,
      data: null,
      msg: `Error fetching product data: ${response.statusText}`,
    }
  }

  const data = await response.json();
  const parsedData = openFoodFactSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(`Invalid data format from Open Food Facts ${parsedData.error}`);
  }

  return {
    success: true,
    data: { ...parsedData.data.product, barcode },
    msg: "Product data fetched successfully",
  }
}