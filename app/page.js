import SiteHeader from "./components/SiteHeader";
import HomeHero from "./components/HomeHero";
import HomeIntro from "./components/HomeIntro";
import HomeWhy from "./components/HomeWhy";
import HomeTestimonials from "./components/HomeTestimonials";
import HomeNews from "./components/HomeNews";
import HomeFooter from "./components/HomeFooter";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HomeHero />
        {/* <HomeIntro />
        <HomeWhy /> */}
        <HomeTestimonials />
        <HomeNews />
      </main>
      <HomeFooter />
    </>
  );
}
