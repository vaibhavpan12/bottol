/**
 * In-browser backup for the AI assistant.
 * If the backend AI endpoint can't be reached, the chat still answers by
 * searching the product list the store has already loaded.
 */
import { CATEGORIES } from "../data/categories";

const SYNONYMS = {
  Electronics: ["electronic", "phone", "mobile", "smartphone", "iphone", "android", "laptop", "macbook", "computer", "tablet", "ipad", "gadget", "headphone", "earbud", "earphone", "speaker", "charger", "echo"],
  Fashion: ["fashion", "clothes", "clothing", "shirt", "tshirt", "top", "dress", "gown", "frock", "jeans", "shoe", "sneaker", "footwear", "slipper", "sandal", "jacket", "jordan", "nike"],
  "Home & Kitchen": ["home", "kitchen", "furniture", "sofa", "bed", "table", "chair", "decor", "decoration", "frame", "spatula", "cookware", "utensil", "pan", "mug", "bottle", "tumbler", "flask"],
  "Beauty & Personal Care": ["beauty", "makeup", "mascara", "eyeshadow", "lipstick", "cosmetic", "perfume", "fragrance", "scent", "skincare", "skin", "soap", "lotion", "cream", "serum"],
  "Sports & Fitness": ["sport", "fitness", "gym", "workout", "exercise", "ball", "football", "basketball", "baseball", "cricket", "glove", "racket", "yoga"],
  "Watches & Accessories": ["watch", "accessory", "accessories", "sunglass", "glasses", "bag", "handbag", "purse", "wallet", "jewellery", "jewelry", "earring", "necklace", "ring", "bracelet", "belt"],
};

const STOP = new Set("i me my a an the and or for to of in on with want need looking look find show get buy give some any please can you is are do have good best nice under below less than upto up within above over more between rs inr price cheap budget something items item product products suggest recommend which what there around about like that this it new latest".split(" "));

const FAQ = [
  [/\b(deliver|delivery|shipping|ship|courier)\b/, "We deliver across India. Delivery is free on orders over ₹1499 (₹79 below that). Most orders arrive in 3–7 working days."],
  [/\b(return|refund|exchange|replace)\b/, "You can return eligible items within 7 days of delivery. Refunds are processed in 5–7 working days."],
  [/\b(payment|pay|cod|upi|card)\b/, "You can pay with UPI, cards, net banking or cash on delivery."],
  [/\b(track|order status|my order)\b/, "Sign in and open My Orders to see the status of every order."],
];

const singular = (w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w);

function parseNumber(value, k) {
  const n = parseFloat(String(value).replace(/,/g, ""));
  return k ? n * 1000 : n;
}

export function localAssistant(message, products) {
  const text = message.toLowerCase().trim();
  const inStock = products.filter((p) => p.quantity > 0);
  const popular = [...inStock].sort((a, b) => Number(b.trending) - Number(a.trending)).slice(0, 4);
  const toChat = (list) => list.map((p) => ({ ...p, id: p._id }));

  if (/^(hi|hello|hey|hii|namaste)[!. ]*$/.test(text)) {
    return {
      message: 'Hi! Tell me what you\'re looking for — e.g. "phone under 20000" or "running shoes".',
      products: toChat(popular),
    };
  }

  for (const [rx, answer] of FAQ) {
    if (rx.test(text) && !/\d/.test(text)) return { message: answer, products: [] };
  }

  const num = "(?:₹|rs\\.?|inr)?\\s*(\\d[\\d,]*(?:\\.\\d+)?)\\s*(k)?";
  let min = null;
  let max = null;
  const between = text.match(new RegExp(`between\\s*${num}\\s*(?:and|to|-)\\s*${num}`));
  if (between) {
    min = parseNumber(between[1], between[2]);
    max = parseNumber(between[3], between[4]);
  } else {
    const under = text.match(new RegExp(`(?:under|below|less than|upto|up to|within|budget)\\s*${num}`));
    if (under) max = parseNumber(under[1], under[2]);
    const over = text.match(new RegExp(`(?:above|over|more than|starting)\\s*${num}`));
    if (over) min = parseNumber(over[1], over[2]);
  }

  const words = (text.replace(/(?:₹|rs\.?|inr)?\s*\d[\d,]*(?:\.\d+)?\s*k?/g, " ").match(/[a-z][a-z-]+/g) || [])
    .filter((w) => !STOP.has(w))
    .map(singular);

  let category = "";
  for (const w of words) {
    const found = Object.entries(SYNONYMS).find(([, list]) => list.includes(w));
    if (found) {
      category = found[0];
      break;
    }
  }
  const generic = new Set(["electronic", "fashion", "beauty", "sport", "accessory", "accessorie", "home", "kitchen", "fitnes"]);
  const keywords = words.filter((w) => !generic.has(w)).slice(0, 3);

  const inBudget = (p) => (max == null || p.price <= max) && (min == null || p.price >= min);
  const haystack = (p) =>
    [p.name, p.brand, p.description, ...(Array.isArray(p.features) ? p.features : [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  const what = keywords.join(" ") || category || "products";
  const budget =
    min && max ? ` between ₹${min} and ₹${max}` : max ? ` under ₹${max}` : min ? ` above ₹${min}` : "";

  if (!keywords.length && !category && min == null && max == null) {
    return {
      message: 'Tell me what you\'d like to buy and your budget, e.g. "headphones under 3000". Here are some popular picks:',
      products: toChat(popular),
    };
  }

  // exact: all keywords match
  let list = inStock.filter(
    (p) => inBudget(p) && (!keywords.length || keywords.every((k) => haystack(p).includes(k)))
  );
  if (category && list.length && !keywords.length) list = list.filter((p) => p.category === category);
  if (list.length) {
    return { message: `Here ${list.length === 1 ? "is" : "are"} ${Math.min(list.length, 6)} ${what}${budget} you might like:`, products: toChat(list.slice(0, 6)) };
  }

  // similar: same category, any keyword, same budget
  list = inStock.filter(
    (p) => inBudget(p) && ((category && p.category === category) || keywords.some((k) => haystack(p).includes(k)))
  );
  if (list.length) {
    const where = category && CATEGORIES.some((c) => c.name === category) ? ` in ${category}` : "";
    return { message: `I couldn't find an exact match for ${what}${budget}. Here are similar products${where}:`, products: toChat(list.slice(0, 6)) };
  }

  return {
    message: `I couldn't find ${what}${budget} right now. Here are some popular picks instead:`,
    products: toChat(popular),
  };
}
