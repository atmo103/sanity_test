import "server-only";
import { initialDocuments } from "./initial-content";
import { sections, toHomeContent } from "./model";

export const CONFIG_ID = "didaDemo-config";
export class CmsError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export function sanityConfigured() { return Boolean(process.env.SANITY_API_WRITE_TOKEN); }
export function sanityBase() {
  const project = process.env.SANITY_PROJECT_ID || "1yuaf3m5";
  const dataset = process.env.SANITY_DATASET || "production";
  if (!/^[a-z0-9]+$/.test(project) || !/^[a-z0-9_-]+$/.test(dataset)) throw new CmsError("Revisa la configuración del proyecto Sanity.", 503);
  return { project, dataset, base: `https://${project}.api.sanity.io/v2025-02-19` };
}

async function sanityRequest(path, options = {}, authenticated = true) {
  const { base } = sanityBase();
  if (authenticated && !sanityConfigured()) throw new CmsError("Falta configurar el token de Sanity en el servidor.", 503);
  let response;
  try {
    response = await fetch(`${base}${path}`, {
      ...options, cache: "no-store", signal: AbortSignal.timeout(20000),
      headers: { ...(authenticated ? { Authorization: `Bearer ${process.env.SANITY_API_WRITE_TOKEN}` } : {}), ...options.headers },
    });
  } catch { throw new CmsError("No pudimos conectar con Sanity. Intenta de nuevo.", 502); }
  if (!response.ok) {
    // Upstream bodies may contain project details; never relay them to the browser.
    if (response.status === 409) throw new CmsError("Este registro cambió en otra sesión. Recarga los datos antes de guardar.", 409);
    if ([401, 403].includes(response.status)) throw new CmsError("Sanity rechazó el acceso. Revisa que el token tenga permiso de edición.", 503);
    throw new CmsError("Sanity no pudo completar la operación. Tus cambios siguen en el formulario.", 502);
  }
  return response.json();
}
export async function readDocuments(authenticated = true) {
  const { dataset } = sanityBase();
  const query = '*[(_id == "didaDemo-config") || ((_type in ["didaTestimonial", "didaClient", "didaNews"]) && (_id match "didaDemo-*" || _id match "drafts.didaDemo-*"))]';
  const search = new URLSearchParams({ query, perspective: authenticated ? "raw" : "published" });
  const result = await sanityRequest(`/data/query/${dataset}?${search}`, {}, authenticated);
  return (result.result || []).filter((d) => d._id === CONFIG_ID || validDocumentId(d._id.replace(/^drafts\./, ""), d.kind));
}
export async function mutate(mutations) {
  const { dataset } = sanityBase();
  return sanityRequest(`/data/mutate/${dataset}?visibility=sync&returnIds=true`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mutations }),
  });
}
export function validDocumentId(id, kind) {
  const section = sections[kind];
  return section && typeof id === "string" && new RegExp(`^didaDemo-${section.prefix}-[a-zA-Z0-9_-]{1,80}$`).test(id);
}
export function editorRecords(documents) {
  const map = new Map();
  for (const doc of documents) {
    if (doc._id === CONFIG_ID) continue;
    const id = doc._id.replace(/^drafts\./, "");
    const pair = map.get(id) || {};
    pair[doc._id.startsWith("drafts.") ? "draft" : "published"] = doc;
    map.set(id, pair);
  }
  return [...map].map(([id, { draft, published }]) => ({
    ...(draft || published), _id: id, revision: draft?._rev || null,
    publishedRevision: published?._rev || null, hasDraft: Boolean(draft), published: Boolean(published),
  })).sort((a, b) => a.order - b.order || a._id.localeCompare(b._id));
}
export async function readHomeContent(preview = false) {
  if (!sanityConfigured() && !preview) return toHomeContent(initialDocuments());
  try {
    const documents = await readDocuments(preview);
    if (!documents.some((d) => d._id === CONFIG_ID)) return toHomeContent(initialDocuments());
    return toHomeContent(preview ? editorRecords(documents) : documents.filter((d) => d._id !== CONFIG_ID));
  } catch (error) {
    if (preview) throw error;
    console.error("[Dida CMS] Published content unavailable:", error.message);
    return toHomeContent(initialDocuments());
  }
}
export async function uploadImage(file) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
  if (!allowed.includes(file.type) || file.size < 1 || file.size > 4 * 1024 * 1024) throw new CmsError("Usa JPG, PNG, WebP, AVIF o SVG de hasta 4 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const text = buffer.toString("utf8");
  const signatures = {
    "image/jpeg": buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255,
    "image/png": buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
    "image/webp": buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP",
    "image/avif": buffer.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(buffer.toString("ascii", 8, 32)),
    "image/svg+xml": /<svg[\s>]/i.test(text) && !/<\s*(script|foreignObject|iframe|object|embed)|\bon\w+\s*=|<!ENTITY|javascript:|<\?xml-stylesheet|(?:href|src)\s*=\s*["']\s*https?:/i.test(text),
  };
  if (!signatures[file.type]) throw new CmsError("El contenido del archivo no corresponde a una imagen válida.");
  const { dataset } = sanityBase();
  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  const response = await sanityRequest(`/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`, {
    method: "POST", headers: { "Content-Type": file.type }, body: buffer,
  });
  return { _type: "image", asset: { _type: "reference", _ref: response.document._id }, url: response.document.url };
}
