import { z } from "npm:zod";

const openFoodFactSchema = z.object({
  data: z.object({
    name: z.string(),
    barcode: z.string().optional(),
    brands: z.string().optional(),
    imageUrl: z.string().url().optional(),
    imageNutritionUrl: z.string().url().optional(),
    imageIngredientsUrl: z.string().url().optional(),
    categories: z.string().optional(),
  })
})