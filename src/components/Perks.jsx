import Icon from './Icon';

const PERKS = [
  { icon: 'layers', title: 'Highest-grade materials', copy: '18/8 stainless steel and BPA-free seals. No shortcuts, no substitutes.' },
  { icon: 'truck', title: 'Small-batch, fast dispatch', copy: 'Made in limited runs, out the door within 48 hours.' },
  { icon: 'shieldCheck', title: 'Third-party tested', copy: 'Every finish and seal is pressure and leak-tested before it ships.' },
  { icon: 'headset', title: 'Real, human support', copy: 'A person answers — not a script, not a bot.' },
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
