// Shared presentation helpers. No credentials or server code belong here.
export const sections = {
  testimonials: { title: "Testimonios", singular: "testimonio", prefix: "testimonial", type: "didaTestimonial" },
  clients: { title: "Clientes", singular: "cliente", prefix: "client", type: "didaClient" },
  news: { title: "Noticias", singular: "noticia", prefix: "news", type: "didaNews" },
};

export const imageUrl = (image) => typeof image === "string" ? image : image?.url || "";
export const recordTitle = (record) => record.person || record.name || record.title || "Sin título";

export function emptyRecord(kind, order = 0) {
  const common = { kind, order, visible: true, revision: null, publishedRevision: null };
  if (kind === "testimonials") return { ...common, person: "", role: "", company: "", portrait: null, logo: null, quoteMuted: "", quoteBright: "" };
  if (kind === "clients") return { ...common, name: "", logo: null };
  return { ...common, title: "", category: "", date: "", image: null, alt: "", content: "", featured: false };
}

export function toHomeContent(records) {
  const ordered = [...records].filter((r) => r.visible !== false).sort((a, b) => a.order - b.order || a._id.localeCompare(b._id));
  return {
    testimonials: ordered.filter((r) => r.kind === "testimonials").map((r) => ({
      id: r._id, person: r.person, role: r.role, company: r.company,
      portrait: imageUrl(r.portrait), logo: imageUrl(r.logo),
      quoteMuted: r.quoteMuted ? `${r.quoteMuted.trim()} ` : "", quoteBright: r.quoteBright,
    })),
    clients: ordered.filter((r) => r.kind === "clients" && imageUrl(r.logo)).map((r) => ({ name: r.name, src: imageUrl(r.logo), width: 320, height: 120 })),
    news: ordered.filter((r) => r.kind === "news").map((r) => ({
      id: r._id, title: r.title, category: r.category, image: imageUrl(r.image),
      alt: r.alt || r.title, content: r.content, featured: r.featured,
      date: formatDate(r.date),
    })),
  };
}

function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "";
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T12:00:00Z`)).replaceAll(" de ", " ").replaceAll(".", "");
}
