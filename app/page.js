import SiteHeader from "./components/SiteHeader";
import HomeHero from "./components/HomeHero";
import HomeIntro from "./components/HomeIntro";
import HomeWhy from "./components/HomeWhy";
import HomeTestimonials from "./components/HomeTestimonials";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HomeHero />
        <HomeIntro />
        <HomeWhy />
        <HomeTestimonials />
      </main>
    </>
  );
}
