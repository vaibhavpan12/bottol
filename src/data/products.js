/**
 * Product catalog for the Pivora storefront.
 * In production this would come from a CMS or commerce API —
 * kept as static data here so the app runs standalone.
 */
export const PRODUCTS = [
  { id: 1, name: 'Aurora 24oz Tumbler', cat: 'Tumblers', price: 899, badge: 'Bestseller', spec: '710ml · Stainless steel', icon: 'tumbler' },
  { id: 2, name: 'Neon Pulse Tumbler', cat: 'Tumblers', price: 949, badge: 'New', spec: '680ml · Double-wall', icon: 'tumbler' },
  { id: 3, name: 'Holo Wave Tumbler', cat: 'Tumblers', price: 1099, badge: 'New', spec: '710ml · Colour-shift finish', icon: 'tumbler' },
  { id: 4, name: 'Mini Sip 12oz', cat: 'Tumblers', price: 599, badge: '', spec: '354ml · Compact carry', icon: 'tumbler' },
  { id: 5, name: 'Blackout Steel Tumbler', cat: 'Tumblers', price: 1199, badge: 'Trending', spec: '770ml · Matte black', icon: 'tumbler' },
  { id: 6, name: 'Sunset Gradient Tumbler', cat: 'Tumblers', price: 999, badge: '', spec: '710ml · Powder coat', icon: 'tumbler' },
  { id: 7, name: 'LED Cube Light', cat: 'Trending', price: 449, badge: 'Trending', spec: 'USB-C · 3 brightness modes', icon: 'strip' },
  { id: 8, name: 'Magnetic Phone Grip', cat: 'Trending', price: 299, badge: '', spec: 'Universal mount', icon: 'phone' },
  { id: 9, name: 'Portable Mini Blender', cat: 'Trending', price: 1299, badge: 'Trending', spec: '400ml · USB rechargeable', icon: 'blend' },
  { id: 10, name: 'RGB Desk Strip Lights', cat: 'New', price: 699, badge: 'New', spec: '2m · App controlled', icon: 'strip' },
  { id: 11, name: 'Clip-On Ring Light', cat: 'New', price: 549, badge: 'New', spec: '3 tone settings', icon: 'ring' },
  { id: 12, name: 'Tumbler Boot Sleeve', cat: 'Trending', price: 249, badge: '', spec: 'Neoprene · Non-slip base', icon: 'sleeve' },
];

export const FILTERS = ['all', 'Tumblers', 'Trending', 'New'];

export const FREE_SHIPPING_THRESHOLD = 1499;
export const STANDARD_SHIPPING_FEE = 79;
