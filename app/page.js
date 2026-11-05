import { Suspense } from "react";
import { connection } from "next/server";
import { readHomeContent } from "./lib/cms/sanity";
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
        <Suspense fallback={null}><EditableHomeContent /></Suspense>
      </main>
      <HomeFooter />
    </>
  );
}


// The public page always reads published content; drafts require a panel session.
async function EditableHomeContent() {
  await connection();
  const content = await readHomeContent();
  return <><HomeTestimonials testimonials={content.testimonials} trustedClients={content.clients} /><HomeNews news={content.news} /></>;
}
