const DEFAULT_TEXT = 'Precision engineered';

export default function Marquee({ text = DEFAULT_TEXT, repeat = 8 }) {
  const items = Array.from({ length: repeat }, () => text);
  return (
    <div className="marquee">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
