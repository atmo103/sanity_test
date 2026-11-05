import { Suspense } from "react";
import Panel from "./Panel";
import { authConfigured, hasSession } from "../lib/cms/auth";
import { sanityConfigured } from "../lib/cms/sanity";

export const metadata = { title: "DidaControl | Panel de contenido", robots: { index: false, follow: false } };
async function Access() {
  const authenticated = await hasSession();
  return <Panel authenticated={authenticated} configured={authConfigured()} connected={sanityConfigured()} />;
}
export default function PanelPage() {
  return <Suspense fallback={<div className="dida-panel dida-panel--loading"><p>Cargando panel…</p></div>}><Access /></Suspense>;
}
