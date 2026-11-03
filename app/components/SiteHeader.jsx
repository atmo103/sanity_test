"use client";

import { useEffect, useState } from "react";

const companyPages = [
  {
    title: "Company",
    description: "Leadership and market snapshot.",
    href: "/company",
  },
  {
    title: "Careers",
    description: "The hard layer behind modern computing.",
    href: "/careers",
  },
  {
    title: "News & Investors",
    description: "Press releases, filings, and fleet reporting.",
    href: "/newsroom",
  },
  {
    title: "Contact",
    description: "Talk to engineers, not a form queue.",
    href: "/contact",
  },
];

const caseStudies = [
  {
    title: "Shore power on a constrained feeder",
    href: "/case-studies/shore-power",
    number: "01",
  },
  {
    title: "Firm capacity through scarcity events",
    href: "/case-studies/firm-capacity",
    number: "02",
  },
];

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <a
          className="site-header__brand"
          href="/"
          aria-label="Sanity Power home"
          onClick={() => setIsOpen(false)}
        >
          <span className="site-header__brand-mark" aria-hidden="true">
            S.
          </span>
          <span className="site-header__brand-name">Sanity</span>
        </a>

        <nav className="site-header__desktop-nav" aria-label="Main navigation">
          <a href="/platform">Platform</a>
          <a href="/technology">Technology</a>
          <a href="/case-studies">Case Studies</a>
          <button
            className="site-header__nav-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="sanity-site-menu"
            onClick={() => setIsOpen((previous) => !previous)}
          >
            Company
            <span className={`site-header__chevron${isOpen ? " is-open" : ""}`} aria-hidden="true" />
          </button>
        </nav>

        <div className="site-header__actions">
          <a className="site-header__contact" href="/contact">
            <span>Get in touch</span>
            <span className="site-header__contact-arrow" aria-hidden="true">↗</span>
          </a>
          <button
            className="site-header__mobile-toggle"
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="sanity-site-menu"
            onClick={() => setIsOpen((previous) => !previous)}
          >
            <span className="site-header__mobile-toggle-label">{isOpen ? "Close" : "Menu"}</span>
            <span className={`site-header__hamburger${isOpen ? " is-open" : ""}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <button
            className="site-header__dismiss-layer"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
          />
          <div id="sanity-site-menu" className="site-menu">
            <div className="site-menu__primary-mobile" aria-label="Main pages">
              <a href="/platform" onClick={() => setIsOpen(false)}>Platform <span aria-hidden="true">↗</span></a>
              <a href="/technology" onClick={() => setIsOpen(false)}>Technology <span aria-hidden="true">↗</span></a>
              <a href="/case-studies" onClick={() => setIsOpen(false)}>Case Studies <span aria-hidden="true">↗</span></a>
            </div>

            <section className="site-menu__pages" aria-labelledby="site-menu-pages-label">
              <span id="site-menu-pages-label" className="site-menu__eyebrow">Pages</span>
              <div className="site-menu__page-grid">
                {companyPages.map((page) => (
                  <a key={page.title} href={page.href} onClick={() => setIsOpen(false)} className="site-menu__page">
                    <span className="site-menu__page-title">{page.title}</span>
                    <span className="site-menu__page-description">{page.description}</span>
                    <span className="site-menu__page-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="site-menu__studies" aria-labelledby="site-menu-studies-label">
              <span id="site-menu-studies-label" className="site-menu__eyebrow">Case studies</span>
              <div className="site-menu__study-grid">
                {caseStudies.map((study) => (
                  <a key={study.number} className="site-menu__study" href={study.href} onClick={() => setIsOpen(false)}>
                    <span className="site-menu__study-number">{study.number} / 02</span>
                    <span className="site-menu__study-title">{study.title}</span>
                    <span className="site-menu__study-read">Read more <span aria-hidden="true">↗</span></span>
                  </a>
                ))}
              </div>
            </section>

            <div className="site-menu__bottom">
              <span>Sanity Power <span aria-hidden="true">©</span> 2026</span>
              <a href="/contact" onClick={() => setIsOpen(false)}>Get in touch <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
