// Axiom Power home news section — visual reference adapted to Sanity Power.
// Images use the original published Webflow asset URLs; no image crops are required.

const featuredNews = [
  {
    category: "RECONOCIMIENTO E INNOVACIÓN",
    date: "01 Ene 2027",
    title: "Ganadores de convocatoria de fomento innovación Minciencias 2027.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb7b257ecdddd8cdc782_magnific_dark-industrial-documenta_bxxbQmN5Y2%20(1).avif",
    alt: "Industrial port cranes and electrical infrastructure beside the waterfront",
    href: "https://axiom-power-template.webflow.io/article/port-of-sundvik-contract-signed",
  },
  {
    category: "Finance",
    date: "02 Feb 2027",
    title: "La experiencia de DidaControl ahora se puede explorar. ",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb43379aff3b207b65b1_magnific_closeup-of-a-financial-do_VdTzd6pMMU.avif",
    alt: "Printed engineering and financial documents spread across a desk",
    href: "https://axiom-power-template.webflow.io/article/credit-facility-upsized",
  },
];

const latestNews = [
  {
    category: "Ops",
    date: "30 Jan 2027",
    title: "DidaControl transforma su presencia digital en una ventaja competitiva.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb104ee11ce579410136_magnific_documentary-photograph-of_mCtdqsHhJQ.avif",
    href: "https://axiom-power-template.webflow.io/article/nerc-cip-audit-zero-findings",
  },
  {
    category: "Press",
    date: "18 Jul 2027",
    title: "DidaControl diseñará y construirá las plantas piloto de un nuevo centro de investigación industrial.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81c9701aedb0161f90c722_magnific_wide-aerial-view-of-a-hyp_l7sk7argv9.avif",
    href: "https://axiom-power-template.webflow.io/article/helix-dc-5-gw-agreement",
  },
  {
    category: "Grid",
    date: "09 Jun 2027",
    title: "DidaControl proyecta su expansión en Latinoamérica con soluciones de ingeniería a medida.",
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
              Eventos
            </p>
            <h2 className="home-news__title" id="home-news-title">
              Últimas Noticias
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
                    {article.category} <span aria-hidden="true">·</span>{" "}
                    <span className="home-news__card-date">{article.date}</span>
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
