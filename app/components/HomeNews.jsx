// Axiom Power home news section — visual reference adapted to Sanity Power.
// Images use the original published Webflow asset URLs; no image crops are required.

const featuredNews = [
  {
    category: "Deal",
    date: "30 Apr 2026",
    title: "Port of Sundvik signs a twenty-year firm capacity contract for shore power.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb7b257ecdddd8cdc782_magnific_dark-industrial-documenta_bxxbQmN5Y2%20(1).avif",
    alt: "Industrial port cranes and electrical infrastructure beside the waterfront",
    href: "https://axiom-power-template.webflow.io/article/port-of-sundvik-contract-signed",
  },
  {
    category: "Finance",
    date: "21 Mar 2026",
    title: "Sanity Power closes $640M facility to fund 1.1 GWh of storage.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb43379aff3b207b65b1_magnific_closeup-of-a-financial-do_VdTzd6pMMU.avif",
    alt: "Printed engineering and financial documents spread across a desk",
    href: "https://axiom-power-template.webflow.io/article/credit-facility-upsized",
  },
];

const latestNews = [
  {
    category: "Ops",
    date: "30 Jan 2026",
    title: "NERC CIP audit closed with zero findings",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb104ee11ce579410136_magnific_documentary-photograph-of_mCtdqsHhJQ.avif",
    href: "https://axiom-power-template.webflow.io/article/nerc-cip-audit-zero-findings",
  },
  {
    category: "Press",
    date: "18 Jul 2026",
    title: "Helix DC and Sanity Power to deploy 5 GW",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81c9701aedb0161f90c722_magnific_wide-aerial-view-of-a-hyp_l7sk7argv9.avif",
    href: "https://axiom-power-template.webflow.io/article/helix-dc-5-gw-agreement",
  },
  {
    category: "Grid",
    date: "09 Jun 2026",
    title: "Texas approves grid standards for flexible load",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81c9227ca92ce1cfb4488e_magnific_closeup-of-a-highvoltage-_LUjOAqtswO%20(1).avif",
    href: "https://axiom-power-template.webflow.io/article/texas-approves-grid-standards",
  },
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h17.4m-5.2-5.2 5.2 5.2-5.2 5.2" />
    </svg>
  );
}

export default function HomeNews() {
  return (
    <section className="home-news" aria-labelledby="home-news-title">
      <div className="home-news__container">
        <div className="home-news__header">
          <div className="home-news__header-copy">
            <p className="home-news__eyebrow">
              <span className="home-news__eyebrow-mark" aria-hidden="true" />
              News
            </p>
            <h2 className="home-news__title" id="home-news-title">
              Latest news.
            </h2>
            <p className="home-news__description">
              Sanity Power builds and operates the hard layer behind modern
              computing. A record of what we&apos;ve shipped, signed, and
              switched on.
            </p>
          </div>

          <a
            className="home-news__all-link"
            href="https://axiom-power-template.webflow.io/newsroom"
          >
            View all news
          </a>
        </div>

        <div className="home-news__featured" aria-label="Featured news">
          {featuredNews.map((article) => (
            <a className="home-news__card" href={article.href} key={article.title}>
              <div className="home-news__card-image-frame">
                <img
                  className="home-news__card-image"
                  src={article.image}
                  alt={article.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="home-news__card-content">
                <div className="home-news__card-top">
                  <p className="home-news__card-meta">
                    {article.category} <span aria-hidden="true">·</span> {article.date}
                  </p>
                  <h3 className="home-news__card-title">{article.title}</h3>
                </div>
                <div className="home-news__card-action" aria-hidden="true">
                  <span>Read more</span>
                  <ArrowIcon />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="home-news__feed" aria-label="More news">
          {latestNews.map((article) => (
            <a className="home-news__feed-link" href={article.href} key={article.title}>
              <span className="home-news__feed-category">{article.category}</span>
              <span className="home-news__feed-title">{article.title}</span>
              <span className="home-news__feed-date">{article.date}</span>
              <span className="home-news__feed-arrow" aria-hidden="true">
                <ArrowIcon />
              </span>
              <img
                className="home-news__feed-image"
                src={article.image}
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
