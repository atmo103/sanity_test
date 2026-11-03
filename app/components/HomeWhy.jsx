const commitments = [
  {
    metric: "20-yr",
    title: "Bankable hardware, Tier-1 components",
    description: "Built with tier-1 components backed by decade-scale warranties.",
  },
  {
    metric: "gw-scale",
    title: "Gigawatt-scale supply chain, contracted",
    description: "Proven and fully secured for a gigawatt deployment cadence.",
  },
  {
    metric: "100% US",
    title: "U.S. manufacturing, FEOC compliant",
    description: "Proudly engineered and assembled across the Americas.",
  },
  {
    metric: "N+1",
    title: "Fault-tolerant architecture, redundant",
    description: "Designed so no single fault is a customer-facing incident.",
  },
];

export default function HomeWhy() {
  return (
    <section className="home-why" aria-labelledby="home-why-title">
      <div className="home-why__inner">
        <div className="home-why__intro">
          <p className="home-why__eyebrow">why Sanity Power</p>
          <h2 className="home-why__title" id="home-why-title">
            Built to be trusted. Engineered to endure.
          </h2>
          <p className="home-why__description">
            Four commitments we hold to on every deployment, from procurement
            to dispatch.
          </p>
        </div>

        <div className="home-why__commitments" aria-label="Our four commitments">
          {commitments.map((item) => (
            <article className="home-why__commitment" key={item.metric}>
              <p className="home-why__metric">{item.metric}</p>
              <div className="home-why__commitment-text">
                <h3 className="home-why__commitment-title">{item.title}</h3>
                <p className="home-why__commitment-description">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
