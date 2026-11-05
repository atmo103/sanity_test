import { Suspense } from "react";
import { redirect } from "next/navigation";
import { hasSession } from "../../lib/cms/auth";
import { readHomeContent } from "../../lib/cms/sanity";
import SiteHeader from "../../components/SiteHeader";
import HomeHero from "../../components/HomeHero";
import HomeTestimonials from "../../components/HomeTestimonials";
import HomeNews from "../../components/HomeNews";
import HomeFooter from "../../components/HomeFooter";

export const metadata = { title: "Vista previa | DidaControl", robots: { index: false, follow: false } };
async function Preview({ searchParams }) {
  if (!await hasSession()) redirect("/panel");
  const params = await searchParams;
  let content;
  try { content = await readHomeContent(true); }
  catch { return <div className="dida-panel dida-panel--loading"><p>No pudimos cargar la vista previa. <a href="/panel">Volver al panel</a></p></div>; }
  return <>
    <aside className="dida-preview-bar"><span>Vista previa · Incluye borradores sin publicar</span><a href="/panel">Volver al panel ↗</a></aside>
    <SiteHeader /><main><HomeHero /><HomeTestimonials testimonials={content.testimonials} trustedClients={content.clients} initialActiveId={params.record} /><HomeNews news={content.news} /></main><HomeFooter />
  </>;
}
export default function PreviewPage({ searchParams }) { return <Suspense fallback={<p className="dida-panel">Cargando vista previa…</p>}><Preview searchParams={searchParams} /></Suspense>; }
