/**
 * Upload the 30 demo products to your backend.
 *
 *   node demo-data/seed-products.mjs                 -> uses the live backend
 *   node demo-data/seed-products.mjs http://127.0.0.1:8000
 *
 * Optional: set ADMIN_TOKEN if your AddProduct endpoint needs admin login
 *   (copy "adminToken" from the browser's localStorage after logging into /admin).
 *   PowerShell:  $env:ADMIN_TOKEN="..."; node demo-data/seed-products.mjs
 *
 * Needs Node 18 or newer.
 */
import { readFile } from "node:fs/promises";

const BASE_URL = process.argv[2] || "https://bottol-backend-3.onrender.com";
const TOKEN = process.env.ADMIN_TOKEN || "";

const products = JSON.parse(
  await readFile(new URL("./products.json", import.meta.url), "utf8")
);

let ok = 0;
for (const p of products) {
  const form = new FormData();
  form.append("name", p.name);
  form.append("category", p.category);
  form.append("price", String(p.price));
  form.append("quantity", String(p.quantity));
  form.append("trending", String(p.trending));
  form.append("description", p.description);
  form.append("brand", p.brand || "");
  form.append("material", p.material || "");
  form.append("capacity", p.capacity || "");
  form.append("weight", p.weight || "");
  form.append("use_cases", JSON.stringify(p.use_cases || []));
  form.append("features", JSON.stringify(p.features || []));
  form.append("image_url", p.image);

  const res = await fetch(`${BASE_URL}/api/products/AddProduct`, {
    method: "POST",
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    body: form,
  });

  if (res.ok) {
    ok++;
    console.log(`✓ ${p.category} — ${p.name}`);
  } else {
    console.log(`✗ ${p.name}: ${res.status} ${await res.text()}`);
  }
}
console.log(`\nDone: ${ok}/${products.length} products added.`);
