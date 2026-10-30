/**
 * The store's categories, in the order they appear in the header,
 * the "Shop by category" tiles and the shop sidebar.
 * Product "category" values in the database must match these names exactly.
 */
export const CATEGORIES = [
  { name: "Electronics", emoji: "📱", blurb: "Phones, laptops & gadgets" },
  { name: "Fashion", emoji: "👕", blurb: "Clothing & footwear" },
  { name: "Home & Kitchen", emoji: "🛋️", blurb: "Furniture, decor & cookware" },
  { name: "Beauty & Personal Care", emoji: "💄", blurb: "Makeup, fragrance & skincare" },
  { name: "Sports & Fitness", emoji: "🏀", blurb: "Gear for every game" },
  { name: "Watches & Accessories", emoji: "⌚", blurb: "Watches, bags & jewellery" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);
