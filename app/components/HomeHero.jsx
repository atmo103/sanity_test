export default function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__media" aria-hidden="true">
        <video
          className="home-hero__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-poster.webp"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="home-hero__content">
        <h1 id="home-hero-title" className="home-hero__title">
          <span>Ingeniería que </span>
          <span className="home-hero__title-muted">transforma un país.</span>
        </h1>

        <div className="home-hero__bottom">
          <p className="home-hero__description">
            Somos fabricantes directos de plantas de procesos y módulos didácticos a escala piloto, desarrollados con estándares y componentes industriales. Diseñamos, construimos y ponemos en marcha soluciones hechas a la medida de sus necesidades.
          </p>

          <a className="home-hero__press" href="/newsroom" aria-label="Read the latest press release">
            <span className="home-hero__press-content">
              <span className="home-hero__press-meta">
                <span className="home-hero__press-indicator" aria-hidden="true" />
                Press
              </span>
              <span className="home-hero__press-title">
                Helix DC and Sanity Power to deploy 5 GW of AI UPS™ at multiple hyperscale campuses.
              </span>
            </span>
            <span className="home-hero__press-image" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
