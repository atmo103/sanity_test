// Approved demo content, used before initialization and by the reset action.
const testimonials = [
  {
    id: "elena",
    person: "Elena Marsh",
    role: "VP, Infrastructure",
    portrait: "/images/testimonials/elena-marsh.webp",
    company: "Helix DC",
    logo: "/images/testimonials/helix-dc.webp",
    stats: [
      ["Scope", "AI UPS™"],
      ["Deployed", "5 GW"],
      ["Since", "2024"],
    ],
    quoteMuted:
      "Durante la puesta en marcha pudimos revisar el funcionamiento del sistema junto con sus ingenieros y resolver las dudas de nuestro personal. La capacitación nos ayudó a comprender la operación y las variables de control. ",
    quoteBright: "Valoramos especialmente esa disposición para explicar las decisiones y acompañarnos mientras nos familiarizábamos con el equipo.",
  },
  {
    id: "daniel",
    person: "Daniel Okafor",
    role: "Director of Energy",
    portrait: "/images/testimonials/daniel-okafor.webp",
    company: "Sundvik",
    logo: "/images/testimonials/sundvik.webp",
    stats: [
      ["Scope", "Firm capacity"],
      ["Deployed", "1.1 GWh"],
      ["Since", "2026"],
    ],
    quoteMuted:
      "Necesitábamos integrar un equipo nuevo a una línea que ya estaba en operación. DidaControl revisó con nosotros las condiciones del proceso y los requerimientos de instalación y control. ",
    quoteBright: "Pudimos discutir cada decisión técnica y llegar a un diseño que encajara con nuestra operación.",
  },
  {
    id: "priya",
    person: "Priya Raman",
    role: "Chief Operating Officer",
    portrait: "/images/testimonials/priya-raman.webp",
    company: "Texas Grid",
    logo: "/images/testimonials/texas-grid.webp",
    stats: [
      ["Scope", "Grid stability"],
      ["Markets", "12 ISOs"],
      ["Since", "2025"],
    ],
    quoteMuted:
      "La planta piloto debía responder a nuestros objetivos de investigación y permitir ensayos bajo distintas condiciones. El equipo de DidaControl entendió esa necesidad desde el diseño. ",
    quoteBright: "Su experiencia nos ayudó a definir los equipos, la instrumentación y las posibilidades de ajuste que necesitábamos para trabajar en el laboratorio.",
  },
];
const clients = [
  {
    name: "SENA",
    src: "/images/logos/sena.svg",
    width: 986,
    height: 962,
  },
  {
    name: "Coca-Cola",
    src: "/images/logos/coca-cola.svg",
    width: 501,
    height: 160,
  },
  {
    name: "Colombina",
    src: "/images/logos/colombina.svg",
    width: 346,
    height: 177,
  },
  {
    name: "Baxter",
    src: "/images/logos/baxter.svg",
    width: 166,
    height: 28,
  },
  {
    name: "Manuelita",
    src: "/images/logos/manuelita.svg",
    width: 282,
    height: 64,
  },
  {
    name: "Nutrium",
    src: "/images/logos/nutrium.svg",
    width: 374,
    height: 97,
  },
  {
    name: "Riopaila Castilla",
    src: "/images/logos/riopaila-castilla.svg",
    width: 1214,
    height: 246,
  },
  {
    name: "Levapan",
    src: "/images/logos/levapan.svg",
    width: 201,
    height: 124,
  },
  {
    name: "Smurfit Kappa",
    src: "/images/logos/smurfit-kappa.svg",
    width: 245,
    height: 32,
  },
  {
    name: "Universidad Santiago de Cali",
    src: "/images/logos/universidad-santiago-de-cali.svg",
    width: 177,
    height: 177,
  },
  {
    name: "Universidad Icesi",
    src: "/images/logos/universidad-icesi.svg",
    width: 476,
    height: 177,
  },
];
const featuredNews = [
  {
    category: "RECONOCIMIENTO E INNOVACIÓN",
    date: "01 Ene 2027",
    title: "Ganadores de convocatoria de fomento innovación Minciencias 2027.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb7b257ecdddd8cdc782_magnific_dark-industrial-documenta_bxxbQmN5Y2%20(1).avif",
    alt: "Industrial port cranes and electrical infrastructure beside the waterfront",
    href: "https://axiom-power-template.webflow.io/article/port-of-sundvik-contract-signed",
  },
  {
    category: "Finance",
    date: "02 Feb 2027",
    title: "La experiencia de DidaControl ahora se puede explorar. ",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb43379aff3b207b65b1_magnific_closeup-of-a-financial-do_VdTzd6pMMU.avif",
    alt: "Printed engineering and financial documents spread across a desk",
    href: "https://axiom-power-template.webflow.io/article/credit-facility-upsized",
  },
];
const latestNews = [
  {
    category: "Ops",
    date: "30 Jan 2027",
    title: "DidaControl transforma su presencia digital en una ventaja competitiva.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81cb104ee11ce579410136_magnific_documentary-photograph-of_mCtdqsHhJQ.avif",
    href: "https://axiom-power-template.webflow.io/article/nerc-cip-audit-zero-findings",
  },
  {
    category: "Press",
    date: "18 Jul 2027",
    title: "DidaControl diseñará y construirá las plantas piloto de un nuevo centro de investigación industrial.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81c9701aedb0161f90c722_magnific_wide-aerial-view-of-a-hyp_l7sk7argv9.avif",
    href: "https://axiom-power-template.webflow.io/article/helix-dc-5-gw-agreement",
  },
  {
    category: "Grid",
    date: "09 Jun 2027",
    title: "DidaControl proyecta su expansión en Latinoamérica con soluciones de ingeniería a medida.",
    image: "https://cdn.prod.website-files.com/6a7dd42c1dbcf75314cc30cc/6a81c9227ca92ce1cfb4488e_magnific_closeup-of-a-highvoltage-_LUjOAqtswO%20(1).avif",
    href: "https://axiom-power-template.webflow.io/article/texas-approves-grid-standards",
  },
];

const dates = ["2027-01-01", "2027-02-02", "2027-01-30", "2027-07-18", "2027-06-09"];
export function initialDocuments() {
  return [
    ...testimonials.map((item, order) => ({
      _id: `didaDemo-testimonial-${item.id}`, _type: "didaTestimonial", kind: "testimonials",
      person: item.person, role: item.role, company: item.company,
      portrait: { url: item.portrait }, logo: { url: item.logo },
      quoteMuted: item.quoteMuted, quoteBright: item.quoteBright, order, visible: true,
    })),
    ...clients.map((item, order) => ({
      _id: `didaDemo-client-${order}`, _type: "didaClient", kind: "clients",
      name: item.name, logo: { url: item.src }, order, visible: true,
    })),
    ...[...featuredNews, ...latestNews].map((item, order) => ({
      _id: `didaDemo-news-${order}`, _type: "didaNews", kind: "news",
      title: item.title.trim(), category: item.category, date: dates[order],
      image: { url: item.image }, alt: item.alt || item.title,
      content: "", featured: order < 2, order, visible: true,
    })),
  ];
}
