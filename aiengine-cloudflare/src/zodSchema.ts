import { z } from "zod";
import projectConstants from "./constants";

const VALID_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE_MB = projectConstants.directImageUploadSizeLimit / (1024 * 1024);

const dietaryPrefSchema = z.object({
  dietaryPref: z.string()
});

// File validation for direct uploads
const fileSchema = z.instanceof(File, { message: "Expected a File object" })
  .refine(
    file => VALID_IMAGE_TYPES.includes(file.type),
    { message: "Invalid file type. Only PNG, JPEG, and WEBP are allowed." }
  )
  .refine(
    file => file.size <= projectConstants.directImageUploadSizeLimit,
    { message: `File size must be less than or equal to ${MAX_FILE_SIZE_MB}MB.` }
  );

// Base64 validation for encoded images
const base64Schema = z.string().refine(
  value => /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/.test(value),
  { message: "Invalid base64 image format. Must be a valid PNG, JPEG, or WEBP image, with correct base64 encoding format." }
);

export const directImageUploadSchema = z.object({ file: fileSchema });

export const base64ImageUploadSchema = z.object({ image: base64Schema });

export const healthSuggestionSchema = base64ImageUploadSchema.merge(dietaryPrefSchema);

export const directImageUploadHealthSuggestionSchema = directImageUploadSchema.merge(dietaryPrefSchema);