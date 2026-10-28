import { BASE_URL } from "../config/api";

/** Turn a product image path from the API into a usable URL. */
export function productImage(image) {
  if (!image) return "";
  return image.startsWith("/uploads/") ? `${BASE_URL}${image}` : image;
}
