import { z } from "zod";
import projectConstants from "./constants";

// Zod validation schemas
export const directImageUploadSchema = z.object({
  file: z.instanceof(File, {
    message: "Expected a File object",
  }).refine(
    // File must be PNG, JPEG, WEBP
    (file) => {
      const validTypes = ["image/png", "image/jpeg", "image/webp"];
      return validTypes.includes(file.type);
    },
    {
      message: "Invalid file type. Only PNG, JPEG, and WEBP are allowed.",
    })
    .refine(
    // File size must be less than or equal to 1MB
    (file) => file.size <= projectConstants.directImageUploadSizeLimit,
    {
      message: `File size must be less than or equal to ${projectConstants.directImageUploadSizeLimit / (1024 * 1024)}MB.`,
    }),
});


export const base64ImageUploadSchema = z.object({
  image: z.string().refine((value) => {
    // Check if the string is a valid base64 image
    const base64Pattern = /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/;
    return base64Pattern.test(value);
  },
  {
    message: "Invalid base64 image format. Must be a valid PNG, JPEG, or WEBP image.",
  }),
})