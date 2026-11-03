"use client";

import { useState } from "react";

const testimonials = [
  {
    id: "elena",
    person: "Elena Marsh",
    role: "VP, Infrastructure",
    portrait: "/images/testimonials/elena-marsh.webp",
    company: "Helix DC",
    logo: "/images/testimonials/helix-dc.webp",
    stats: [
      ["Scope", "AI UPS™"],
      ["Deployed", "5 GW"],
      ["Since", "2024"],
    ],
    quoteMuted:
      "“We reviewed every credible solution on the market. Sanity Power's architecture was the only one that met our interconnection and resilience requirements at once, and their team stayed on past the hard part. This is poised to become the new ",
    quoteBright: "standard for compute in America.”",
  },
  {
    id: "daniel",
    person: "Daniel Okafor",
    role: "Director of Energy",
    portrait: "/images/testimonials/daniel-okafor.webp",
    company: "Sundvik",
    logo: "/images/testimonials/sundvik.webp",
    stats: [
      ["Scope", "Firm capacity"],
      ["Deployed", "1.1 GWh"],
      ["Since", "2026"],
    ],
    quoteMuted:
      "Their dispatch numbers held up under audit. Sub-380 milliseconds is not a marketing claim. ",
    quoteBright: "We measured it on our own bus, not in a model.",
  },
  {
    id: "priya",
    person: "Priya Raman",
    role: "Chief Operating Officer",
    portrait: "/images/testimonials/priya-raman.webp",
    company: "Texas Grid",
    logo: "/images/testimonials/texas-grid.webp",
    stats: [
      ["Scope", "Grid stability"],
      ["Markets", "12 ISOs"],
      ["Since", "2025"],
    ],
    quoteMuted:
      "The first vendor whose commissioning schedule survived contact with reality. ",
    quoteBright: "Two campuses, on time, no derating.",
  },
];

// Original client marks from the published Axiom Power template.
const trustedClients = [
  { name: "Sundvik", src: "https://cdn.prod.website-files.com/6a6f262be15ed44701a53fe8/6a7471e7a58387b53a9602d2_logoipsum-custom-logo%20%286%29.svg" },
  { name: "Helix DC", src: "https://cdn.prod.website-files.com/6a6f262be15ed44701a53fe8/6a76d9446a155020f1a2343c_logoipsum-custom-logo%20%2811%29.svg" },
  { name: "Texas Grid", src: "https://cdn.prod.website-files.com/6a6f262be15ed44701a53fe8/6a74726fb3163cd43a8efa71_logoipsum-custom-logo%20%288%29.svg" },
  { name: "Northbank", src: "https://cdn.prod.website-files.com/6a6f262be15ed44701a53fe8/6a7472d8fc28e421fdf4d756_logoipsum-custom-logo%20%289%29.svg" },
  { name: "Meridian", src: "https://cdn.prod.website-files.com/6a6f262be15ed44701a53fe8/6a74731589d0ed3b5e3417ac_logoipsum-custom-logo%20%2810%29.svg" },
];

function Arrow({ direction }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={direction === "previous" ? "M19 12H5m0 0 6-6m-6 6 6 6" : "M5 12h14m0 0-6-6m6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = testimonials[activeIndex];

  const change = (direction) => {
    setActiveIndex((previous) =>
      (previous + direction + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      className="home-testimonials"
      aria-label="Client testimonials"
      aria-roledescription="carousel"
    >
      <div className="home-testimonials__shell">
        <p className="home-testimonials__eyebrow">
          <span className="home-testimonials__accent" aria-hidden="true" />
          Testimonial
        </p>

        <div className="home-testimonials__layout">
          <div className="home-testimonials__profile" key={`${current.id}-profile`}>
            <span className="home-testimonials__counter" aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}>
              {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>

            <img
              className="home-testimonials__portrait"
              src={current.portrait}
              alt={current.person}
              width="82"
              height="82"
              decoding="async"
            />

            <div className="home-testimonials__identity">
              <h3 className="home-testimonials__name">{current.person}</h3>
              <p className="home-testimonials__role">{current.role}</p>
            </div>

            <img
              className="home-testimonials__company-logo"
              src={current.logo}
              alt={current.company}
              decoding="async"
            />

            <dl className="home-testimonials__stats">
              {current.stats.map(([label, value]) => (
                <div className="home-testimonials__stat" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="home-testimonials__statement"
            key={`${current.id}-statement`}
          >
            <span className="home-testimonials__quote-symbol" aria-hidden="true">
              “
            </span>
            <blockquote className="home-testimonials__quote">
              <span className="home-testimonials__quote-muted">
                {current.quoteMuted}
              </span>
              <span className="home-testimonials__quote-bright">
                {current.quoteBright}
              </span>
            </blockquote>
          </div>
        </div>

        <div className="home-testimonials__controls" aria-label="Testimonial navigation">
          <button
            type="button"
            className="home-testimonials__arrow"
            onClick={() => change(-1)}
            aria-label="Previous testimonial"
          >
            <Arrow direction="previous" />
          </button>
          <button
            type="button"
            className="home-testimonials__arrow"
            onClick={() => change(1)}
            aria-label="Next testimonial"
          >
            <Arrow direction="next" />
          </button>
        </div>
      </div>

      <div className="home-testimonials__trusted" aria-label="Trusted by">
        <p className="home-testimonials__trusted-label">
          <span className="home-testimonials__accent" aria-hidden="true" />
          Trusted by
        </p>
        <div className="home-testimonials__trusted-viewport">
          <div className="home-testimonials__trusted-track">
            {[0, 1].map((repeat) => (
              <div
                className="home-testimonials__trusted-sequence"
                key={repeat}
                aria-hidden={repeat === 1 ? "true" : undefined}
              >
                {trustedClients.map(({ name, src }) => (
                  <img
                    key={name}
                    className="home-testimonials__trusted-logo"
                    src={src}
                    alt={repeat === 0 ? name : ""}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
