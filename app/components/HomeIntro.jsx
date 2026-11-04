"use client";

import { useEffect, useRef } from "react";

export default function HomeIntro() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let isVisible = false;

    function reset() {
      section.style.setProperty("--intro-scroll", "0");
    }

    function update() {
      frameId = 0;

      if (motionPreference.matches) {
        reset();
        return;
      }

      // Measure the untransformed section so the animation cannot affect its trigger.
      const bounds = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)),
      );

      // One continuous pulse: square at entry, gently rounded near the top, square at exit.
      const amount = Math.sin(Math.PI * progress) ** 4;
      section.style.setProperty("--intro-scroll", amount.toFixed(5));
    }

    function scheduleUpdate() {
      if (isVisible && !frameId) {
        frameId = window.requestAnimationFrame(update);
      }
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;

      if (isVisible) {
        scheduleUpdate();
      } else {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
        reset();
      }
    });

    const sizeObserver = new ResizeObserver(scheduleUpdate);

    visibilityObserver.observe(section);
    sizeObserver.observe(section);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    motionPreference.addEventListener("change", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      motionPreference.removeEventListener("change", scheduleUpdate);
      section.style.removeProperty("--intro-scroll");
    };
  }, []);

  return (
    <section ref={sectionRef} className="home-intro" aria-labelledby="home-intro-heading">
      <div className="home-intro__surface">
        <div className="home-intro__inner">
        <h2 id="home-intro-heading" className="home-intro__heading">
      Didacontrol es una empresa dedicada al desarrollo de procesos basados en
nuevas tecnologı́as y su implementación en la industria. Nos encargamos de la
ingenierı́a conceptual y de detalle, además del diseño, construcción y operación
de plantas de procesos quı́micos.
        </h2>
        </div>
      </div>
    </section>
  );
}

