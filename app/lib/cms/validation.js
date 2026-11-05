import { sections } from "./model";
import { CmsError, sanityBase } from "./sanity";

const limits = { person: 100, role: 160, company: 120, name: 160, title: 240, category: 80, date: 10, alt: 240, quoteMuted: 2000, quoteBright: 1200, content: 16000 };
const labels = { person: "Nombre", role: "Cargo", company: "Empresa", name: "Nombre del cliente", title: "Titular", category: "Categoría", date: "Fecha", alt: "Descripción de la imagen", quoteMuted: "Testimonio", quoteBright: "Frase destacada", content: "Contenido" };
const fields = {
  testimonials: ["person", "role", "company", "quoteMuted", "quoteBright"],
  clients: ["name"], news: ["title", "category", "date", "alt", "content"],
};
function image(value) {
  if (!value) return null;
  if (typeof value !== "object" || typeof value.url !== "string" || value.url.length > 2048) throw new CmsError("Imagen no válida.");
  const { project, dataset } = sanityBase();
  const local = /^\/images\/[a-zA-Z0-9/_-]+\.(webp|svg|avif|png|jpe?g)$/.test(value.url);
  const sanity = value.url.startsWith(`https://cdn.sanity.io/images/${project}/${dataset}/`);
  const original = value.url.startsWith("https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/");
  if (!local && !sanity && !original) throw new CmsError("Sube la imagen desde el panel.");
  if (value.asset) {
    if (!sanity || !/^image-[a-zA-Z0-9]+-\d+x\d+-[a-zA-Z0-9]+$/.test(value.asset._ref || "")) throw new CmsError("Referencia de imagen no válida.");
    return { _type: "image", url: value.url, asset: { _type: "reference", _ref: value.asset._ref } };
  }
  return { url: value.url };
}
export function cleanRecord(input, publishing = false) {
  if (!input || !sections[input.kind]) throw new CmsError("Sección no válida.");
  const kind = input.kind;
  const output = { kind, _type: sections[kind].type, visible: input.visible !== false };
  for (const field of fields[kind]) {
    if (typeof input[field] !== "string" || input[field].length > limits[field]) throw new CmsError(`Revisa el campo «${labels[field]}».`);
    output[field] = input[field].trim();
  }
  output.order = Number(input.order);
  if (!Number.isInteger(output.order) || output.order < 0 || output.order > 9999) throw new CmsError("El orden debe ser un número entre 0 y 9999.");
  for (const field of kind === "testimonials" ? ["portrait", "logo"] : kind === "clients" ? ["logo"] : ["image"]) output[field] = image(input[field]);
  if (kind === "news") {
    output.featured = input.featured === true;
    if (output.date && (!/^\d{4}-\d{2}-\d{2}$/.test(output.date) || !Number.isFinite(Date.parse(`${output.date}T12:00:00Z`)) || new Date(`${output.date}T12:00:00Z`).toISOString().slice(0, 10) !== output.date)) throw new CmsError("La fecha no es válida.");
  }
  if (publishing) {
    const required = kind === "testimonials" ? ["person", "role", "company", "portrait", "logo"] : kind === "clients" ? ["name", "logo"] : ["title", "category", "date", "image"];
    if (required.some((field) => !output[field])) throw new CmsError("Completa los campos obligatorios antes de publicar.");
    if (kind === "testimonials" && !output.quoteMuted && !output.quoteBright) throw new CmsError("Escribe el testimonio antes de publicar.");
  }
  return output;
}
