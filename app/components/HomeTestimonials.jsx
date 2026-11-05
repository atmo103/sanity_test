"use client";

import { useState } from "react";

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

export default function HomeTestimonials({ testimonials = [], trustedClients = [], initialActiveId }) {
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, testimonials.findIndex((item) => item.id === initialActiveId)));
  const index = Math.min(activeIndex, Math.max(0, testimonials.length - 1));
  const current = testimonials[index];

  const change = (direction) => {
    setActiveIndex((previous) =>
      testimonials.length ? (Math.min(previous, testimonials.length - 1) + direction + testimonials.length) % testimonials.length : 0
    );
  };

  if (!testimonials.length && !trustedClients.length) return null;

  return (
    <section
      id="testimonios"
      className="home-testimonials"
      aria-label="Client testimonials"
      aria-roledescription="carousel"
    >
      {current && <div className="home-testimonials__shell">
        <p className="home-testimonials__eyebrow">
          <span className="home-testimonials__accent" aria-hidden="true" />
          Testimonios
        </p>

        <div className="home-testimonials__layout">
          <div className="home-testimonials__profile" key={`${current.id}-profile`}>
            <span className="home-testimonials__counter" aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}>
              {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>

            {current.portrait && <img
              className="home-testimonials__portrait"
              src={current.portrait}
              alt={current.person}
              width="82"
              height="82"
              decoding="async"
            />}

            <div className="home-testimonials__identity">
              <h3 className="home-testimonials__name">{current.person}</h3>
              <p className="home-testimonials__role">{current.role}</p>
            </div>

            {current.logo && <img
              className="home-testimonials__company-logo"
              src={current.logo}
              alt={current.company}
              decoding="async"
            />}

            {/* <dl className="home-testimonials__stats">
              {current.stats.map(([label, value]) => (
                <div className="home-testimonials__stat" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl> */}
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

        {testimonials.length > 1 && <div className="home-testimonials__controls" aria-label="Testimonial navigation">
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
        </div>}
      </div>}

      {trustedClients.length > 0 && <div id="clientes" className="home-testimonials__trusted" aria-label="Trusted by">
        <p className="home-testimonials__trusted-label">
          <span className="home-testimonials__trusted-accent" aria-hidden="true" />
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
                {trustedClients.map(({ name, src, width, height }) => (
                  <img
                    key={name}
                    className="home-testimonials__trusted-logo"
                    src={src}
                    alt={repeat === 0 ? name : ""}
                    width={width}
                    height={height}
                    loading="eager"
                    decoding="async"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>}
    </section>
  );
}


