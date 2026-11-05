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

export default function HomeNews({ news = [] }) {
  if (!news.length) return null;
  const featuredNews = news.filter((article) => article.featured);
  const latestNews = news.filter((article) => !article.featured);
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

        </div>

        <div className="home-news__featured" aria-label="Featured news">
          {featuredNews.map((article) => (
            <article className="home-news__card" key={article.id}>
              <div className="home-news__card-image-frame">
                {article.image && <img
                  className="home-news__card-image"
                  src={article.image}
                  alt={article.alt}
                  loading="lazy"
                  decoding="async"
                />}
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
                  <span>Destacada</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="home-news__feed" aria-label="More news">
          {latestNews.map((article) => (
            <div className="home-news__feed-link" key={article.id}>
              <span className="home-news__feed-category">{article.category}</span>
              <span className="home-news__feed-title">{article.title}</span>
              <span className="home-news__feed-date">{article.date}</span>
              <span className="home-news__feed-arrow" aria-hidden="true">
                <ArrowIcon />
              </span>
              {article.image && <img
                className="home-news__feed-image"
                src={article.image}
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

