const footerGroups = [
  {
    heading: "Site",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Technology", href: "/technology" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Company", href: "/company" },
      { label: "Careers", href: "/careers" },
      { label: "Newsroom & Investors", href: "/newsroom" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Template",
    links: [
      { label: "Style Guide", href: "/style-guide" },
      { label: "Licenses", href: "/licenses" },
      { label: "Change Log", href: "/change-log" },
      { label: "Custom 404", href: "/404" },
      { label: "Custom 401", href: "/401" },
    ],
  },
];

function FooterLinkGroup({ heading, links }) {
  return (
    <div className="home-footer__nav-column">
      <h3 className="home-footer__eyebrow">{heading}</h3>
      <ul className="home-footer__nav-links">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomeFooter() {
  return (
    <footer className="home-footer" aria-label="Sanity Power footer">
      <div className="home-footer__surface">
        <div className="home-footer__container">
          <div className="home-footer__top">
            <div className="home-footer__intro">
              <h2 className="home-footer__headline">
                 Construimos de la mano con nuestros clientes proyectos de implementación, automatización y control de procesos industriales.
                {/* <span>Power keeps us on.</span> */}
              </h2>
              {/* <p className="home-footer__description">
                Tell us what you&apos;re building. Our engineering team will take it
                from there.
              </p> */}
            </div>

            <div className="home-footer__top-right">
              {/* <dl className="home-footer__metrics">
                <div className="home-footer__metric">
                  <dt>Fleet uptime</dt>
                  <dd>99.98%</dd>
                </div>
                <div className="home-footer__metric">
                  <dt>Capacity in build</dt>
                  <dd>3GW</dd>
                </div>
              </dl> */}
              <a className="home-footer__cta" href="/contact">
                <span>Contacto</span>
                <span className="home-footer__cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" focusable="false">
                    <path d="M3 12h17.4m-5.2-5.2 5.2 5.2-5.2 5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* <nav className="home-footer__navigation" aria-label="Footer navigation">
            <div className="home-footer__nav-column home-footer__nav-column--contact">
              <h3 className="home-footer__eyebrow">NOC · 24/7</h3>
              <div className="home-footer__contact-list">
                <span>+1 (312) 555-0184</span>
                <span>noc@sanity.energy</span>
                <span className="home-footer__operational">
                  <span className="home-footer__status-dot" aria-hidden="true" />
                  All systems operational
                </span>
              </div>
            </div>
            {footerGroups.map((group) => (
              <FooterLinkGroup key={group.heading} {...group} />
            ))}
          </nav> */}

          <div className="home-footer__bottom">
            <div className="home-footer__signature">
              <small>© 2026 1MGauss</small>
 
            </div>
            <div className="home-footer__wordmark" aria-label="Sanity Power">
              Sanity + Next.js
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
