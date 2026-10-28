import Icon from "./Icon";

const PERKS = [
  { icon: "truck", title: "Fast delivery", copy: "Free delivery on orders over ₹1499. Most orders ship within 48 hours." },
  { icon: "shieldCheck", title: "Secure checkout", copy: "Your details are protected. Pay online or choose cash on delivery." },
  { icon: "layers", title: "Easy returns", copy: "Not right for you? Return eligible items within 7 days." },
  { icon: "headset", title: "Real support", copy: "Questions about an order? Our team is here to help." },
];

export default function Perks() {
  return (
    <section className="perks" id="perks">
      <div className="wrap">
        {PERKS.map((perk) => (
          <div className="perk" key={perk.title}>
            <span className="pi">
              <Icon name={perk.icon} viewBox="0 0 24 24" />
            </span>
            <h4>{perk.title}</h4>
            <p>{perk.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
