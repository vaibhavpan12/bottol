/**
 * Icon.jsx
 * Central monoline "blueprint style" icon set used across product cards,
 * the cart, and the perks strip. Rendered as inline SVG (not strings) so
 * it stays tree-shakeable and accessible.
 */

const PATHS = {
  tumbler: (
    <>
      <rect x="14" y="8" width="20" height="34" rx="6" />
      <ellipse cx="24" cy="8" rx="10" ry="2.6" />
      <rect x="19" y="2" width="10" height="6" rx="2" />
    </>
  ),
  phone: (
    <>
      <rect x="14" y="6" width="20" height="36" rx="4" />
      <circle cx="24" cy="35" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="24" cy="12" r="3" />
    </>
  ),
  blend: (
    <>
      <path d="M14 8h20l-4 22a4 4 0 0 1-4 3.4h-4a4 4 0 0 1-4-3.4L14 8Z" />
      <path d="M17 8l3 12M31 8l-3 12" />
      <rect x="18" y="36" width="12" height="6" rx="2" />
    </>
  ),
  strip: (
    <>
      <path d="M6 30 16 16l6 8 8-14 12 20" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="22" cy="24" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="30" cy="10" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  ring: (
    <>
      <circle cx="24" cy="20" r="14" />
      <circle cx="24" cy="20" r="8" />
      <path d="M24 34v8M18 44h12" />
    </>
  ),
  sleeve: (
    <>
      <rect x="12" y="10" width="24" height="28" rx="5" />
      <path d="M12 18h24M12 26h24M12 34h24" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.4 7H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </>
  ),
  truck: (
    <>
      <path d="M3 16V6a1 1 0 0 1 1-1h9v11" />
      <path d="M13 9h4l4 4v3h-8" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </>
  ),
  shield: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  headset: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.55L3 20l1.1-4.35A8.5 8.5 0 1 1 21 11.5Z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M5 5l14 14M19 5 5 19" />,
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  drop: (
    <>
      <path d="M12 2C8 8 4 12.5 4 16.5A8 8 0 0 0 20 16.5C20 12.5 16 8 12 2Z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="24" cy="24" r="20" />
      <path d="m15 24 6 6 12-13" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: (
    <>
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3-3.46" />
      <path d="M14 4c.6 2.2 2.2 3.6 4.3 3.8" />
    </>
  ),
};

/**
 * @param {{ name: keyof typeof PATHS, viewBox?: string, stroke?: string }} props
 */
export default function Icon({ name, viewBox = '0 0 48 48', stroke }) {
  const content = PATHS[name];
  if (!content) return null;
  return (
    <svg className="icon" viewBox={viewBox} stroke={stroke}>
      {content}
    </svg>
  );
}
