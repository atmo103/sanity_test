import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { COOKIE, SESSION_SECONDS, authConfigured, createSession, hasSession, passwordMatches } from "../../../lib/cms/auth";
import { CmsError, CONFIG_ID, editorRecords, mutate, readDocuments, sanityConfigured, uploadImage, validDocumentId } from "../../../lib/cms/sanity";
import { initialDocuments } from "../../../lib/cms/initial-content";
import { sections } from "../../../lib/cms/model";
import { cleanRecord } from "../../../lib/cms/validation";

const attempts = new Map();
const privateHeaders = { "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff" };
const json = (data, status = 200) => NextResponse.json(data, { status, headers: privateHeaders });

async function readBytes(request, limit) {
  const reader = request.body?.getReader();
  if (!reader) throw new CmsError("Solicitud vacía.");
  let bytes = 0; const chunks = [];
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    bytes += value.length;
    if (bytes > limit) { await reader.cancel(); throw new CmsError("La solicitud es demasiado grande.", 413); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
async function body(request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new CmsError("Formato de solicitud no válido.", 415);
  const buffer = await readBytes(request, 100000);
  try { return JSON.parse(buffer.toString()); } catch { throw new CmsError("Solicitud no válida."); }
}
function sameOrigin(request) {
  const origin = request.headers.get("origin");
  let accepted = false;
  try {
    const parsed = new URL(origin);
    accepted = process.env.PANEL_ORIGIN ? origin === process.env.PANEL_ORIGIN :
      ["http:", "https:"].includes(parsed.protocol) && parsed.host === request.headers.get("host");
  } catch { /* Missing or malformed origins are rejected. */ }
  if (!accepted || request.headers.get("sec-fetch-site") === "cross-site") throw new CmsError("Solicitud de origen no permitido.", 403);
}
function assertVersions(record, current) {
  if ((record.revision || null) !== (current?.revision || null) || (record.publishedRevision || null) !== (current?.publishedRevision || null)) throw new CmsError("Este registro cambió en otra sesión. Recarga los datos antes de guardar.", 409);
}
async function contentResponse() {
  const documents = await readDocuments();
  return { initialized: documents.some((d) => d._id === CONFIG_ID), records: editorRecords(documents) };
}
async function handle(request, context) {
  try {
    const { path = [] } = await context.params;
    const route = path.join("/");
    if (request.method !== "GET") sameOrigin(request);
    if (route === "session") {
      if (request.method === "GET") return json({ authenticated: await hasSession() });
      if (request.method === "DELETE") {
        (await cookies()).set(COOKIE, "", { httpOnly: true, secure: new URL(request.headers.get("origin") || request.url).protocol === "https:", sameSite: "strict", path: "/", maxAge: 0 });
        return json({ ok: true });
      }
      if (request.method !== "POST") return json({ error: "Método no permitido." }, 405);
      if (!authConfigured()) throw new CmsError("Configura la clave y el secreto de sesión en el servidor.", 503);
      const now = Date.now();
      // Best-effort per-instance throttling, in addition to a long shared password.
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
      const attempt = attempts.get(ip);
      if (attempt?.count >= 8) return json({ error: "Demasiados intentos. Espera diez minutos." }, 429);
      const { password } = await body(request);
      if (!passwordMatches(password)) {
        if (attempts.size > 10000) attempts.clear();
        attempts.set(ip, { count: (attempt?.count || 0) + 1, until: attempt?.until || now + 600000 });
        return json({ error: "La clave no es correcta." }, 401);
      }
      attempts.delete(ip);
      (await cookies()).set(COOKIE, createSession(), { httpOnly: true, secure: new URL(request.headers.get("origin") || request.url).protocol === "https:", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
      return json({ ok: true });
    }
    if (!await hasSession()) return json({ error: "Tu sesión terminó. Vuelve a entrar al panel." }, 401);
    if (!sanityConfigured()) throw new CmsError("Falta configurar el token de Sanity en el servidor.", 503);
    if (route === "content" && request.method === "GET") return json(await contentResponse());
    if ((route === "initialize" || route === "reset") && request.method === "POST") {
      const input = await body(request);
      const documents = await readDocuments();
      if (route === "reset" && input.confirmation !== "RESTABLECER") throw new CmsError("Confirma el restablecimiento.");
      if (route === "initialize" && documents.some((d) => d._id === CONFIG_ID)) return json(await contentResponse());
      const initial = initialDocuments(); const ids = new Set(initial.map((d) => d._id));
      const mutations = route === "reset"
        ? documents.filter((d) => d._id !== CONFIG_ID && (d._id.startsWith("drafts.") || !ids.has(d._id))).map((d) => ({ delete: { id: d._id, ifRevisionID: d._rev } }))
        : [];
      mutations.push(...initial.map((d) => ({ [route === "reset" ? "createOrReplace" : "createIfNotExists"]: d })));
      mutations.push({ createIfNotExists: { _id: CONFIG_ID, _type: "didaDemoConfig", version: 1 } });
      await mutate(mutations);
      return json(await contentResponse());
    }
    if (route === "upload" && request.method === "POST") {
      const type = request.headers.get("content-type") || "";
      if (!type.startsWith("multipart/form-data;")) throw new CmsError("Sube la imagen como archivo.", 415);
      const buffer = await readBytes(request, 4.2 * 1024 * 1024);
      const form = await new Response(buffer, { headers: { "Content-Type": type } }).formData();
      const file = form.get("file");
      if (!(file instanceof File)) throw new CmsError("Selecciona una imagen.");
      return json({ image: await uploadImage(file) });
    }
    if (route === "record" && request.method === "POST") {
      const input = await body(request);
      const { action, record } = input;
      if (!["save", "publish", "delete"].includes(action) || !record || !sections[record.kind]) throw new CmsError("Operación no válida.");
      const id = record._id || `didaDemo-${sections[record.kind].prefix}-${randomUUID()}`;
      if (!validDocumentId(id, record.kind)) throw new CmsError("Registro no válido.");
      const documents = await readDocuments();
      if (!documents.some((d) => d._id === CONFIG_ID)) throw new CmsError("Carga primero el contenido inicial.", 409);
      const current = editorRecords(documents).find((d) => d._id === id);
      assertVersions(record, current);
      const published = documents.find((d) => d._id === id);
      const draft = documents.find((d) => d._id === `drafts.${id}`);
      const mutations = [];
      if (action === "delete") {
        if (!current) throw new CmsError("El registro ya no existe.", 404);
        for (const doc of [published, draft].filter(Boolean)) mutations.push({ delete: { id: doc._id, ifRevisionID: doc._rev } });
      } else if (action === "save") {
        const data = cleanRecord(record);
        mutations.push(draft ? { patch: { id: draft._id, ifRevisionID: draft._rev, set: data } } : { create: { ...data, _id: `drafts.${id}` } });
      } else {
        if (!draft) throw new CmsError("Guarda el borrador antes de publicar.", 409);
        const data = cleanRecord(draft, true);
        mutations.push(published ? { patch: { id, ifRevisionID: published._rev, set: data } } : { create: { ...data, _id: id } });
        mutations.push({ delete: { id: draft._id, ifRevisionID: draft._rev } });
      }
      await mutate(mutations);
      const result = await contentResponse();
      return json({ ...result, selectedId: action === "delete" ? null : id });
    }
    return json({ error: "Ruta no disponible." }, 404);
  } catch (error) {
    if (!(error instanceof CmsError)) console.error("[Dida panel]", error.message);
    return json({ error: error instanceof CmsError ? error.message : "No pudimos completar la operación. Intenta de nuevo." }, error.status || 500);
  }
}
export const GET = handle;
export const POST = handle;
export const DELETE = handle;
