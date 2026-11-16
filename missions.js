/**
 * InterfaceLab — Datos pedagógicos, plantillas HTML/CSS, validadores y mini-experimentos
 * Asignatura: Diseño de Interfaces Web (2.º DAW) · Proyecto Cultura360
 */

export const DESIGN_TOKENS = [
  { name: "Azul Cultura360", hex: "#153b64", role: "Fondo principal del hero y texto CTA" },
  { name: "Azul Profundo", hex: "#0f2744", role: "Hover de enlaces y bordes oscuros" },
  { name: "Tinta Principal", hex: "#0f172a", role: "Titulares y texto de alto contraste" },
  { name: "Texto Secundario", hex: "#475569", role: "Descripciones, etiquetas y subtítulos" },
  { name: "Superficie Clara", hex: "#eef3f8", role: "Tarjetas culturales y fondos suaves" },
  { name: "Esmeralda Acción", hex: "#10b981", role: "Estados activos, feedback y validación" }
];

export const CSS_CHEATSHEET = [
  {
    category: "Flexbox",
    prop: "display: flex; justify-content; align-items",
    desc: "Distribuye elementos en una fila o columna con alineación precisa.",
    example: ".site-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}"
  },
  {
    category: "Tipografía",
    prop: "font-size & font-weight & line-height",
    desc: "Controla la jerarquía visual diferenciando título, eyebrow y párrafo.",
    example: ".hero h1 {\n  font-size: 34px;\n  line-height: 1.12;\n  font-weight: 800;\n}"
  },
  {
    category: "Modelo de Caja",
    prop: "padding & gap & border-radius",
    desc: "Aporta aire interior, separa hermanos sin márgenes colapsados y suaviza esquinas.",
    example: ".hero-link {\n  padding: 11px 20px;\n  border-radius: 10px;\n}"
  },
  {
    category: "CSS Grid",
    prop: "grid-template-columns: repeat(auto-fit, minmax(...))",
    desc: "Crea rejillas adaptables sin necesidad de múltiples media queries.",
    example: ".events-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 16px;\n}"
  },
  {
    category: "Estados e Interacción",
    prop: ":hover & :focus-visible & transition",
    desc: "Mejora la retroalimentación con ratón y garantiza accesibilidad por teclado.",
    example: ".search-input:focus-visible {\n  outline: 2px solid #2563eb;\n  outline-offset: 2px;\n}"
  },
  {
    category: "Responsive",
    prop: "@media (max-width: 640px)",
    desc: "Adapta rejillas de dos columnas a una sola columna en pantallas móviles.",
    example: "@media (max-width: 640px) {\n  .hero {\n    grid-template-columns: 1fr;\n  }\n}"
  }
];

export const HERO_ARTWORK_SVG = `
<svg viewBox="0 0 360 270" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="360" height="270" fill="#0d1321"/>
  <circle cx="52" cy="58" r="56" fill="#f97316" fill-opacity="0.88"/>
  <circle cx="132" cy="48" r="46" fill="#facc15" fill-opacity="0.85"/>
  <circle cx="212" cy="70" r="54" fill="#06b6d4" fill-opacity="0.82"/>
  <circle cx="295" cy="56" r="44" fill="#a855f7" fill-opacity="0.84"/>
  <circle cx="96" cy="138" r="60" fill="#ec4899" fill-opacity="0.82"/>
  <circle cx="176" cy="146" r="52" fill="#22c55e" fill-opacity="0.8"/>
  <circle cx="268" cy="145" r="58" fill="#3b82f6" fill-opacity="0.86"/>
  <circle cx="54" cy="222" r="48" fill="#eab308" fill-opacity="0.84"/>
  <circle cx="148" cy="228" r="50" fill="#ef4444" fill-opacity="0.82"/>
  <circle cx="242" cy="225" r="52" fill="#14b8a6" fill-opacity="0.84"/>
  <circle cx="326" cy="212" r="46" fill="#f59e0b" fill-opacity="0.82"/>
  <circle cx="185" cy="92" r="24" fill="#ffffff" fill-opacity="0.18"/>
  <circle cx="115" cy="195" r="18" fill="#0f172a" fill-opacity="0.45"/>
</svg>
`;

export const BASE_CULTURA360_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cultura360 · Agenda Cultural</title>
</head>
<body>
  <div class="page-shell">
    <header class="site-header">
      <a href="#top" class="brand">Cultura360</a>
      <nav aria-label="Navegación principal">
        <a href="#inicio">Inicio</a>
        <a href="#actividades" class="is-active">Actividades</a>
        <a href="#agenda">Agenda</a>
      </nav>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-media">
          ${HERO_ARTWORK_SVG}
        </div>
        <div class="hero-content">
          <span class="eyebrow">Agenda cultural municipal</span>
          <h1 id="hero-title">Encuentra algo que hacer esta semana</h1>
          <p>Descubre conciertos, talleres, exposiciones y actividades familiares.</p>
          <a href="#actividades" class="hero-link">Explorar</a>
        </div>
      </section>

      <section class="search-panel" aria-labelledby="search-title">
        <h2 id="search-title">Buscar actividades</h2>
        <form class="search-form" onsubmit="event.preventDefault()">
          <div class="search-field">
            <label for="q">Actividad o palabra clave</label>
            <input id="q" class="search-input" type="search" placeholder="Ej: jazz, teatro, fotografía" />
          </div>
          <button type="submit" class="search-btn">Buscar</button>
        </form>
      </section>

      <section id="actividades" class="events-section" aria-labelledby="events-title">
        <div class="events-header">
          <h2 id="events-title">Agenda destacada</h2>
          <span class="events-count">3 propuestas activas</span>
        </div>
        <div class="events-grid">
          <article class="event-card">
            <span class="event-tag">Música</span>
            <h3>Noches de Jazz en el Patio</h3>
            <p>Cuarteto acústico al aire libre con acceso libre hasta completar aforo.</p>
            <div class="event-meta">Viernes · 20:30 · Centro Cultural</div>
          </article>
          <article class="event-card">
            <span class="event-tag">Taller</span>
            <h3>Fotografía Urbana Nocturna</h3>
            <p>Recorrido práctico de composición y exposición larga por el casco histórico.</p>
            <div class="event-meta">Sábado · 18:00 · Plaza Mayor</div>
          </article>
          <article class="event-card">
            <span class="event-tag">Exposición</span>
            <h3>Geometrías del Color</h3>
            <p>Muestra colectiva de arte gráfico contemporáneo y cartelería municipal.</p>
            <div class="event-meta">Hasta el domingo · Sala Norte</div>
          </article>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;

export const ORIGINAL_BROKEN_CSS = `
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #1e293b; padding: 14px; }
.page-shell { max-width: 960px; margin: 0 auto; }
.site-header { border-bottom: 1px solid #cbd5e1; padding: 8px 0; margin-bottom: 14px; }
.brand { font-size: 14px; font-weight: 500; color: #334155; text-decoration: none; margin-right: 12px; }
.site-header nav { display: inline; }
.site-header nav a { font-size: 14px; color: #475569; text-decoration: underline; margin-right: 10px; }
.hero { background: #e2e8f0; color: #334155; padding: 12px; margin-bottom: 16px; }
.hero-media { height: 140px; overflow: hidden; margin-bottom: 10px; }
.hero-media svg { width: 100%; height: 100%; display: block; }
.eyebrow { font-size: 12px; color: #475569; display: block; margin-bottom: 4px; }
.hero h1 { font-size: 17px; font-weight: 600; margin: 0 0 6px; }
.hero p { font-size: 15px; margin: 0 0 10px; }
.hero-link { color: #1d4ed8; font-size: 14px; }
.search-panel { border: 1px solid #cbd5e1; padding: 10px; margin-bottom: 16px; }
.search-panel h2 { font-size: 16px; margin: 0 0 8px; }
.search-field label { display: block; font-size: 12px; margin-bottom: 4px; }
.search-input { width: 100%; padding: 6px; border: 1px solid #94a3b8; margin-bottom: 8px; }
.search-btn { padding: 6px 10px; }
.events-section h2 { font-size: 16px; margin: 0 0 8px; }
.events-count { font-size: 12px; color: #64748b; display: block; margin-bottom: 8px; }
.event-card { border: 1px solid #cbd5e1; padding: 10px; margin-bottom: 8px; }
.event-tag { font-size: 11px; color: #475569; }
.event-card h3 { font-size: 15px; margin: 4px 0; }
.event-card p { font-size: 13px; margin: 0 0 4px; }
.event-meta { font-size: 12px; color: #64748b; }
`;

// Helper normalizer for flexible CSS acceptance ("puedes proponer valores propios si funcionan")
function norm(val) {
  return String(val || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function isLengthPxOrRem(val, minPx = 1, maxPx = 200) {
  const v = norm(val);
  const pxMatch = v.match(/^(-?\d+(?:\.\d+)?)px$/);
  if (pxMatch) {
    const num = parseFloat(pxMatch[1]);
    return num >= minPx && num <= maxPx;
  }
  const remMatch = v.match(/^(-?\d+(?:\.\d+)?)(rem|em)$/);
  if (remMatch) {
    const num = parseFloat(remMatch[1]) * 16;
    return num >= minPx && num <= maxPx;
  }
  return false;
}

function isShorthandPadding(val) {
  const parts = norm(val).split(" ");
  if (parts.length < 1 || parts.length > 4) return false;
  return parts.every((p) => p === "0" || isLengthPxOrRem(p, 2, 64));
}

function isColorValue(val) {
  const v = norm(val);
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(v) || /^(rgb|rgba|hsl|hsla)\(.+\)$/.test(v) || /^[a-z]{3,20}$/.test(v);
}

function isDarkBlueOrBrandColor(val) {
  const v = norm(val);
  if (!isColorValue(v)) return false;
  // Reject very light colors for dark hero backgrounds
  return !["#fff", "#ffffff", "white", "#f8fafc", "#f1f5f9", "#e2e8f0", "transparent"].includes(v);
}

export const MISSIONS = [
  {
    id: "m1",
    number: "01",
    shortTitle: "Diagnóstico",
    isCore: true,
    phaseTag: "FASE 01 · DIAGNÓSTICO · 8-12 MIN",
    title: "Audita la base y el contenedor",
    subtitle: "Antes de diseñar jerarquías, normaliza el modelo de caja y da aire al lienzo.",
    clientQuote: "«La página respira mal y pega los bordes al navegador»",
    clientDesc:
      "Cultura360 parte sin reset de box-sizing ni anchura máxima. Define la base tipográfica, el ancho de lectura del contenedor y la separación global entre bloques.",
    criteria: [
      { id: "m1-c1", label: "Activar box-sizing: border-box en el selector universal", blankIds: ["m1_box"] },
      { id: "m1-c2", label: "Centrar el contenedor principal con max-width y márgenes automáticos", blankIds: ["m1_maxw", "m1_margin"] },
      { id: "m1-c3", label: "Aplicar fondo neutro legible y tipografía sans-serif base", blankIds: ["m1_bg", "m1_font"] }
    ],
    roadmapTitle: "RUTA DE PROGRAMACIÓN (5 VALORES)",
    roadmapSteps: [
      "1. Modelo de caja global: border-box (1 decisión)",
      "2. Lienzo base: fondo y familia tipográfica (2 decisiones)",
      "3. Contenedor .page-shell: anchura máxima y centrado (2 decisiones)"
    ],
    extraChallenge: null,
    fileLabel: "styles.css · reto 0",
    defaultCompleted: true,
    blanks: {
      m1_box: {
        initial: "border-box",
        ideal: "border-box",
        label: "box-sizing",
        hint: "Usa `border-box` para que padding y borde no aumenten el ancho total.",
        validate: (v) => norm(v) === "border-box"
      },
      m1_font: {
        initial: "system-ui, -apple-system, sans-serif",
        ideal: "system-ui, -apple-system, sans-serif",
        label: "font-family",
        hint: "Una pila limpia como `system-ui, -apple-system, sans-serif` mejora la lectura.",
        validate: (v) => norm(v).length >= 4
      },
      m1_bg: {
        initial: "#f8fafc",
        ideal: "#f8fafc",
        label: "background",
        hint: "Usa un gris muy claro como `#f8fafc` o `#f1f5f9` para dar contraste a las tarjetas.",
        validate: (v) => isColorValue(v)
      },
      m1_maxw: {
        initial: "980px",
        ideal: "980px",
        label: "max-width",
        hint: "Limita el ancho de lectura entre `860px` y `1120px` (ej. `980px`).",
        validate: (v) => isLengthPxOrRem(v, 680, 1280)
      },
      m1_margin: {
        initial: "0 auto",
        ideal: "0 auto",
        label: "margin",
        hint: "`0 auto` centra horizontalmente un bloque con anchura máxima.",
        validate: (v) => ["0 auto", "0px auto", "auto"].includes(norm(v))
      }
    },
    codeLines: [
      { type: "comment", text: "/* 1. Reset base y superficie */" },
      { type: "ruleStart", selector: "*, *::before, *::after" },
      { type: "propBlank", indent: 2, prop: "box-sizing", blankId: "m1_box" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: "body" },
      { type: "propStatic", indent: 2, prop: "margin", val: "0" },
      { type: "propBlank", indent: 2, prop: "font-family", blankId: "m1_font" },
      { type: "propBlank", indent: 2, prop: "background", blankId: "m1_bg" },
      { type: "propStatic", indent: 2, prop: "color", val: "#0f172a" },
      { type: "propStatic", indent: 2, prop: "padding", val: "20px" },
      { type: "ruleEnd" },
      { type: "comment", text: "/* 2. Contenedor centrado */" },
      { type: "ruleStart", selector: ".page-shell" },
      { type: "propBlank", indent: 2, prop: "max-width", blankId: "m1_maxw" },
      { type: "propBlank", indent: 2, prop: "margin", blankId: "m1_margin" },
      { type: "ruleEnd" }
    ],
    learnItems: [
      {
        prop: "box-sizing: border-box",
        desc: "Evita que añadir padding o border rompa las cuadrículas y desborde el ancho del contenedor."
      },
      {
        prop: "max-width + margin: 0 auto",
        desc: "Mantiene longitudes de línea cómodas en pantallas grandes y centra el contenido de Cultura360."
      }
    ],
    experiment: {
      title: "El ancho guía la lectura",
      desc: "Ajusta la anchura máxima del contenedor para ver cómo cambia la densidad del texto.",
      label: "Anchura máxima del bloque",
      min: 280,
      max: 560,
      step: 10,
      unit: "px",
      initial: 420,
      cssProp: "maxWidth",
      cardTitle: "Contenedor editorial",
      cardText: "Un ancho equilibrado evita líneas demasiado largas o fragmentadas."
    },
    htmlEditable: false
  },
  {
    id: "m2",
    number: "02",
    shortTitle: "Jerarquía",
    isCore: true,
    phaseTag: "FASE 02 · JERARQUÍA · 10-20 MIN",
    title: "Rescata la cabecera y el hero",
    subtitle: "El título, el texto y la acción principal no deben competir por atención.",
    clientQuote: "«La portada no tiene protagonista»",
    clientDesc:
      "El tamaño y el peso de la marca compiten con el menú. En el hero, el h1 tiene prácticamente el mismo protagonismo que el texto de apoyo. Define una ruta perceptiva clara.",
    criteria: [
      {
        id: "m2-c1",
        label: "Configurar cabecera, marca y enlaces de navegación",
        blankIds: ["m2_h_display", "m2_h_justify", "m2_h_align", "m2_h_pad", "m2_brand_size", "m2_brand_weight"]
      },
      {
        id: "m2-c2",
        label: "Rediseñar hero, contexto y titular con CSS",
        blankIds: ["m2_hero_bg", "m2_hero_rad", "m2_hero_gap", "m2_eye_size", "m2_eye_ls", "m2_h1_size", "m2_h1_lh", "m2_p_color"]
      },
      {
        id: "m2-c3",
        label: "Adaptar hero a móvil y construir CTA accesible",
        blankIds: ["m2_cta_pad", "m2_cta_weight", "m2_mob_cols"]
      }
    ],
    roadmapTitle: "RUTA DE PROGRAMACIÓN (17 VALORES)",
    roadmapSteps: [
      "1. Cabecera: espaciado, marca y menú (6 decisiones)",
      "2. Hero: fondo, bordes y separación (3 decisiones)",
      "3. Tipografía: título, eyebrow y párrafo (5 decisiones)",
      "4. Acción y móvil: CTA y una columna (3 decisiones)"
    ],
    extraChallenge: {
      label: "Reto extra opcional: escribe desde cero la regla .site-header nav a:hover. Debe verse un cambio al pasar el ratón. No se corrige con respuesta única.",
      placeholder: ".site-header nav a:hover {\n  color: #153b64;\n  background: #e2e8f0;\n}",
      initial: ".site-header nav a:hover {\n  background: #f1f5f9;\n  color: #153b64;\n}"
    },
    fileLabel: "styles.css · reto 1",
    defaultCompleted: false,
    blanks: {
      m2_h_display: {
        initial: "flex",
        ideal: "flex",
        label: "display",
        hint: "Usa `flex` para alinear marca y navegación en una misma fila.",
        validate: (v) => norm(v) === "flex" || norm(v) === "grid"
      },
      m2_h_justify: {
        initial: "space-between",
        ideal: "space-between",
        label: "justify-content",
        hint: "`space-between` empuja la marca a la izquierda y el menú a la derecha.",
        validate: (v) => ["space-between", "space-around"].includes(norm(v))
      },
      m2_h_align: {
        initial: "center",
        ideal: "center",
        label: "align-items",
        hint: "`center` alinea verticalmente el logotipo y los enlaces.",
        validate: (v) => norm(v) === "center"
      },
      m2_h_pad: {
        initial: "16px 28px",
        ideal: "16px 28px",
        label: "padding",
        hint: "Un relleno como `16px 28px` da aire a la barra superior.",
        validate: (v) => isShorthandPadding(v)
      },
      m2_brand_size: {
        initial: "22px",
        ideal: "22px",
        label: "font-size",
        hint: "Dale a `.brand` entre `18px` y `28px` (ej. `22px`) para separarla del menú.",
        validate: (v) => isLengthPxOrRem(v, 17, 34)
      },
      m2_brand_weight: {
        initial: "800",
        ideal: "800",
        label: "font-weight",
        hint: "Usa `700` u `800` para dar peso a la marca `Cultura360`.",
        validate: (v) => ["700", "800", "900", "bold"].includes(norm(v))
      },
      m2_hero_bg: {
        initial: "#153b64",
        ideal: "#153b64",
        label: "background",
        hint: "El azul corporativo `#153b64` aporta contraste con el texto blanco.",
        validate: (v) => isDarkBlueOrBrandColor(v)
      },
      m2_hero_rad: {
        initial: "18px",
        ideal: "18px",
        label: "border-radius",
        hint: "Un radio entre `12px` y `24px` (ej. `18px`) moderniza la tarjeta del hero.",
        validate: (v) => isLengthPxOrRem(v, 8, 36)
      },
      m2_hero_gap: {
        initial: "28px",
        ideal: "28px",
        label: "gap",
        hint: "Separa la ilustración del bloque de texto con `24px` o `28px`.",
        validate: (v) => isLengthPxOrRem(v, 14, 56)
      },
      m2_eye_size: {
        initial: "11px",
        ideal: "11px",
        label: "font-size",
        hint: "El eyebrow debe ser sutil: entre `10px` y `13px` (ej. `11px`).",
        validate: (v) => isLengthPxOrRem(v, 9, 14)
      },
      m2_eye_ls: {
        initial: "0.1em",
        ideal: "0.1em",
        label: "letter-spacing",
        hint: "Un tracking amplio (`0.08em` o `0.1em`) refuerza las mayúsculas pequeñas.",
        validate: (v) => /^0?\.\d+(em|rem)$/.test(norm(v)) || isLengthPxOrRem(v, 1, 5)
      },
      m2_h1_size: {
        initial: "34px",
        ideal: "34px",
        label: "font-size",
        hint: "Para que el H1 sea protagonista, usa entre `28px` y `44px` (ej. `34px`).",
        validate: (v) => isLengthPxOrRem(v, 26, 52)
      },
      m2_h1_lh: {
        initial: "1.14",
        ideal: "1.14",
        label: "line-height",
        hint: "En titulares grandes, un interlineado compacto como `1.12` o `1.15` evita huecos.",
        validate: (v) => {
          const n = parseFloat(norm(v));
          return !Number.isNaN(n) && n >= 1.0 && n <= 1.35;
        }
      },
      m2_p_color: {
        initial: "#dbeafe",
        ideal: "#dbeafe",
        label: "color",
        hint: "Un tono claro suave como `#dbeafe` o `#e2e8f0` subordina el párrafo al H1 blanco.",
        validate: (v) => isColorValue(v)
      },
      m2_cta_pad: {
        initial: "",
        ideal: "11px 20px",
        label: "padding",
        hint: "Prueba con `11px 20px` o `12px 22px` para dar cuerpo táctil al botón Explorar.",
        validate: (v) => isShorthandPadding(v)
      },
      m2_cta_weight: {
        initial: "800",
        ideal: "800",
        label: "font-weight",
        hint: "Usa `700` u `800` para destacar la acción principal.",
        validate: (v) => ["600", "700", "800", "bold"].includes(norm(v))
      },
      m2_mob_cols: {
        initial: "",
        ideal: "1fr",
        label: "grid-template-columns",
        hint: "En móvil, cambia a `1fr` para apilar imagen y texto en una sola columna.",
        validate: (v) => ["1fr", "100%", "minmax(0, 1fr)"].includes(norm(v))
      }
    },
    codeLines: [
      { type: "comment", text: "/* 1. Cabecera: espaciado, marca y menú */" },
      { type: "ruleStart", selector: ".site-header" },
      { type: "propBlank", indent: 2, prop: "display", blankId: "m2_h_display" },
      { type: "propBlank", indent: 2, prop: "justify-content", blankId: "m2_h_justify" },
      { type: "propBlank", indent: 2, prop: "align-items", blankId: "m2_h_align" },
      { type: "propBlank", indent: 2, prop: "padding", blankId: "m2_h_pad" },
      { type: "propStatic", indent: 2, prop: "background", val: "#ffffff" },
      { type: "propStatic", indent: 2, prop: "border-radius", val: "14px 14px 0 0" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".brand" },
      { type: "propBlank", indent: 2, prop: "font-size", blankId: "m2_brand_size" },
      { type: "propBlank", indent: 2, prop: "font-weight", blankId: "m2_brand_weight" },
      { type: "propStatic", indent: 2, prop: "color", val: "#0f172a" },
      { type: "propStatic", indent: 2, prop: "text-decoration", val: "none" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".site-header nav" },
      { type: "propStatic", indent: 2, prop: "display", val: "flex" },
      { type: "propStatic", indent: 2, prop: "gap", val: "8px" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".site-header nav a" },
      { type: "propStatic", indent: 2, prop: "padding", val: "7px 12px" },
      { type: "propStatic", indent: 2, prop: "border-radius", val: "8px" },
      { type: "propStatic", indent: 2, prop: "font-size", val: "13px" },
      { type: "propStatic", indent: 2, prop: "font-weight", val: "600" },
      { type: "propStatic", indent: 2, prop: "color", val: "#334155" },
      { type: "propStatic", indent: 2, prop: "text-decoration", val: "none" },
      { type: "ruleEnd" },
      { type: "comment", text: "/* 2. Hero: fondo, bordes y separación */" },
      { type: "ruleStart", selector: ".hero" },
      { type: "propStatic", indent: 2, prop: "display", val: "grid" },
      { type: "propStatic", indent: 2, prop: "grid-template-columns", val: "1fr 1.15fr" },
      { type: "propBlank", indent: 2, prop: "gap", blankId: "m2_hero_gap" },
      { type: "propBlank", indent: 2, prop: "background", blankId: "m2_hero_bg" },
      { type: "propBlank", indent: 2, prop: "border-radius", blankId: "m2_hero_rad" },
      { type: "propStatic", indent: 2, prop: "padding", val: "14px" },
      { type: "propStatic", indent: 2, prop: "align-items", val: "center" },
      { type: "propStatic", indent: 2, prop: "margin", val: "14px 18px 20px" },
      { type: "ruleEnd" },
      { type: "comment", text: "/* 3. Tipografía: título, eyebrow y párrafo */" },
      { type: "ruleStart", selector: ".eyebrow" },
      { type: "propStatic", indent: 2, prop: "display", val: "block" },
      { type: "propStatic", indent: 2, prop: "text-transform", val: "uppercase" },
      { type: "propBlank", indent: 2, prop: "font-size", blankId: "m2_eye_size" },
      { type: "propBlank", indent: 2, prop: "letter-spacing", blankId: "m2_eye_ls" },
      { type: "propStatic", indent: 2, prop: "color", val: "#93c5fd" },
      { type: "propStatic", indent: 2, prop: "font-weight", val: "700" },
      { type: "propStatic", indent: 2, prop: "margin-bottom", val: "8px" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".hero h1" },
      { type: "propBlank", indent: 2, prop: "font-size", blankId: "m2_h1_size" },
      { type: "propBlank", indent: 2, prop: "line-height", blankId: "m2_h1_lh" },
      { type: "propStatic", indent: 2, prop: "font-weight", val: "800" },
      { type: "propStatic", indent: 2, prop: "color", val: "#ffffff" },
      { type: "propStatic", indent: 2, prop: "margin", val: "0 0 10px" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".hero p" },
      { type: "propBlank", indent: 2, prop: "color", blankId: "m2_p_color" },
      { type: "propStatic", indent: 2, prop: "font-size", val: "14.5px" },
      { type: "propStatic", indent: 2, prop: "line-height", val: "1.5" },
      { type: "propStatic", indent: 2, prop: "margin", val: "0 0 18px" },
      { type: "ruleEnd" },
      { type: "comment", text: "/* 4. Acción y móvil: CTA y una columna */" },
      { type: "ruleStart", selector: ".hero-link" },
      { type: "propStatic", indent: 2, prop: "display", val: "inline-block" },
      { type: "propStatic", indent: 2, prop: "background", val: "#ffffff" },
      { type: "propStatic", indent: 2, prop: "color", val: "#153b64" },
      { type: "propStatic", indent: 2, prop: "border", val: "0" },
      { type: "propStatic", indent: 2, prop: "border-radius", val: "10px" },
      { type: "propBlank", indent: 2, prop: "padding", blankId: "m2_cta_pad" },
      { type: "propBlank", indent: 2, prop: "font-weight", blankId: "m2_cta_weight" },
      { type: "propStatic", indent: 2, prop: "text-decoration", val: "none" },
      { type: "ruleEnd" },
      { type: "mediaStart", query: "@media (max-width: 640px)" },
      { type: "ruleStart", selector: "  .hero" },
      { type: "propBlank", indent: 4, prop: "grid-template-columns", blankId: "m2_mob_cols" },
      { type: "ruleEnd" },
      { type: "mediaEnd" }
    ],
    learnItems: [
      {
        prop: "font-size",
        desc: "Establece el tamaño visual. Un h1 copiado normalmente a 18 px o menos se confunde con el cuerpo. Debe generar una diferencia perceptible respecto a la descripción."
      },
      {
        prop: "font-weight",
        desc: "Define el grosor del trazo (400 normal, 700-800 negrita). Combinar peso y tamaño evita que la marca compita con los enlaces."
      },
      {
        prop: "padding",
        desc: "En botones y enlaces CTA como .hero-link, aporta zona táctil cómoda (mínimo recomendado 44px de altura) y sensación de botón real."
      },
      {
        prop: "grid-template-columns: 1fr",
        desc: "Dentro de @media (max-width: 640px) colapsa las dos columnas del hero en una sola para evitar textos apretados en móvil."
      }
    ],
    experiment: {
      title: "El espacio comunica",
      desc: "Arrastra el control y observa cómo cambia una tarjeta. Es una prueba visual: no modifica el código de tu entrega.",
      label: "Separación interior",
      min: 8,
      max: 48,
      step: 2,
      unit: "px",
      initial: 32,
      cssProp: "padding",
      cardTitle: "Tarjeta cultural",
      cardText: "Un grupo visual reconocible"
    },
    htmlEditable: false
  },
  {
    id: "m3",
    number: "03",
    shortTitle: "Buscador",
    isCore: true,
    phaseTag: "FASE 03 · BUSCADOR · 10-15 MIN",
    title: "Alinea y vuelve accesible el buscador",
    subtitle: "Un formulario claro reduce la fricción: etiqueta visible, foco nítido y botón alineado.",
    clientQuote: "«El botón Buscar queda descolgado y el campo no parece interactivo»",
    clientDesc:
      "En la sección Buscar actividades, el input y el botón no comparten fila ni altura. Añade layout flexible, bordes definidos y un anillo de foco accesible con :focus-visible.",
    criteria: [
      { id: "m3-c1", label: "Alinear campo y botón en la misma fila con flex-end", blankIds: ["m3_form_disp", "m3_form_align", "m3_form_gap"] },
      { id: "m3-c2", label: "Estilizar el input con altura cómoda y radio coherente", blankIds: ["m3_in_pad", "m3_in_rad"] },
      { id: "m3-c3", label: "Definir estado :focus-visible accesible en el campo", blankIds: ["m3_focus_out"] }
    ],
    roadmapTitle: "RUTA DE PROGRAMACIÓN (6 VALORES)",
    roadmapSteps: [
      "1. Contenedor .search-form: flex, gap y alineación inferior (3 decisiones)",
      "2. Campo .search-input: relleno interior y radio (2 decisiones)",
      "3. Accesibilidad teclado: contorno :focus-visible (1 decisión)"
    ],
    extraChallenge: null,
    fileLabel: "styles.css · reto 2",
    defaultCompleted: false,
    blanks: {
      m3_form_disp: {
        initial: "",
        ideal: "flex",
        label: "display",
        hint: "Usa `flex` para colocar el campo y el botón lado a lado.",
        validate: (v) => norm(v) === "flex"
      },
      m3_form_align: {
        initial: "",
        ideal: "flex-end",
        label: "align-items",
        hint: "Usa `flex-end` (o `end`) para alinear el botón con el input dejando la etiqueta arriba.",
        validate: (v) => ["flex-end", "end"].includes(norm(v))
      },
      m3_form_gap: {
        initial: "10px",
        ideal: "10px",
        label: "gap",
        hint: "Separa el campo del botón con `10px` o `12px`.",
        validate: (v) => isLengthPxOrRem(v, 6, 28)
      },
      m3_in_pad: {
        initial: "10px 14px",
        ideal: "10px 14px",
        label: "padding",
        hint: "Un relleno de `10px 14px` iguala la presencia visual del botón.",
        validate: (v) => isShorthandPadding(v)
      },
      m3_in_rad: {
        initial: "8px",
        ideal: "8px",
        label: "border-radius",
        hint: "Usa `8px` o `10px` para mantener coherencia con el botón Explorar.",
        validate: (v) => isLengthPxOrRem(v, 4, 20)
      },
      m3_focus_out: {
        initial: "",
        ideal: "2px solid #2563eb",
        label: "outline",
        hint: "Prueba `2px solid #2563eb` para que quienes navegan con Tab vean dónde están.",
        validate: (v) => norm(v).includes("solid") && norm(v).length >= 8
      }
    },
    codeLines: [
      { type: "comment", text: "/* 1. Formulario en línea */" },
      { type: "ruleStart", selector: ".search-panel" },
      { type: "propStatic", indent: 2, prop: "padding", val: "16px 24px 20px" },
      { type: "propStatic", indent: 2, prop: "background", val: "#ffffff" },
      { type: "propStatic", indent: 2, prop: "border-top", val: "1px solid #e2e8f0" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".search-form" },
      { type: "propBlank", indent: 2, prop: "display", blankId: "m3_form_disp" },
      { type: "propBlank", indent: 2, prop: "align-items", blankId: "m3_form_align" },
      { type: "propBlank", indent: 2, prop: "gap", blankId: "m3_form_gap" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".search-field" },
      { type: "propStatic", indent: 2, prop: "flex", val: "1" },
      { type: "ruleEnd" },
      { type: "comment", text: "/* 2. Input y foco visible */" },
      { type: "ruleStart", selector: ".search-input" },
      { type: "propStatic", indent: 2, prop: "width", val: "100%" },
      { type: "propBlank", indent: 2, prop: "padding", blankId: "m3_in_pad" },
      { type: "propBlank", indent: 2, prop: "border-radius", blankId: "m3_in_rad" },
      { type: "propStatic", indent: 2, prop: "border", val: "1px solid #cbd5e1" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".search-input:focus-visible" },
      { type: "propBlank", indent: 2, prop: "outline", blankId: "m3_focus_out" },
      { type: "propStatic", indent: 2, prop: "outline-offset", val: "2px" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".search-btn" },
      { type: "propStatic", indent: 2, prop: "padding", val: "10px 18px" },
      { type: "propStatic", indent: 2, prop: "border-radius", val: "8px" },
      { type: "propStatic", indent: 2, prop: "border", val: "0" },
      { type: "propStatic", indent: 2, prop: "background", val: "#153b64" },
      { type: "propStatic", indent: 2, prop: "color", val: "#ffffff" },
      { type: "propStatic", indent: 2, prop: "font-weight", val: "700" },
      { type: "ruleEnd" }
    ],
    learnItems: [
      {
        prop: "align-items: flex-end",
        desc: "Cuando un campo tiene <label> encima, alinear al final mantiene el botón exactamente a la altura de la caja de texto."
      },
      {
        prop: ":focus-visible",
        desc: "Muestra el anillo de foco únicamente cuando el usuario navega con teclado, cumpliendo WCAG sin recargar el clic de ratón."
      }
    ],
    experiment: {
      title: "Separación en formularios",
      desc: "Modifica el aire entre elementos de un bloque de búsqueda para equilibrar densidad y claridad.",
      label: "Relleno del bloque de búsqueda",
      min: 8,
      max: 36,
      step: 2,
      unit: "px",
      initial: 20,
      cssProp: "padding",
      cardTitle: "Campo + Botón",
      cardText: "Espacios consistentes agrupan la etiqueta con su entrada."
    },
    htmlEditable: false
  },
  {
    id: "m4",
    number: "04",
    shortTitle: "Patrones",
    isCore: true,
    phaseTag: "FASE 04 · PATRONES · 10-15 MIN",
    title: "Maqueta la rejilla de actividades",
    subtitle: "Convierte las tarjetas apiladas en un patrón Grid adaptable y escaneable.",
    clientQuote: "«Las tarjetas ocupan todo el ancho y cuesta comparar eventos»",
    clientDesc:
      "La agenda destacada necesita una rejilla automática que muestre varias columnas en escritorio y se adapte sin desbordar en móvil. Añade contraste suave y elevación al pasar el cursor.",
    criteria: [
      { id: "m4-c1", label: "Construir rejilla adaptable con CSS Grid y minmax", blankIds: ["m4_grid_disp", "m4_grid_cols", "m4_grid_gap"] },
      { id: "m4-c2", label: "Dar cuerpo visual a .event-card (fondo, borde y radio)", blankIds: ["m4_card_bg", "m4_card_rad"] }
    ],
    roadmapTitle: "RUTA DE PROGRAMACIÓN (5 VALORES)",
    roadmapSteps: [
      "1. Patrón .events-grid: display, columnas automáticas y gap (3 decisiones)",
      "2. Tarjeta .event-card: superficie y radio (2 decisiones)"
    ],
    extraChallenge: null,
    fileLabel: "styles.css · reto 3",
    defaultCompleted: false,
    blanks: {
      m4_grid_disp: {
        initial: "",
        ideal: "grid",
        label: "display",
        hint: "Usa `grid` para distribuir las tarjetas en columnas automáticas.",
        validate: (v) => norm(v) === "grid"
      },
      m4_grid_cols: {
        initial: "",
        ideal: "repeat(auto-fit, minmax(220px, 1fr))",
        label: "grid-template-columns",
        hint: "Usa `repeat(auto-fit, minmax(220px, 1fr))` para crear columnas fluidas.",
        validate: (v) => norm(v).includes("repeat") && norm(v).includes("minmax")
      },
      m4_grid_gap: {
        initial: "16px",
        ideal: "16px",
        label: "gap",
        hint: "Un `gap` de `16px` separa limpiamente las tarjetas.",
        validate: (v) => isLengthPxOrRem(v, 8, 36)
      },
      m4_card_bg: {
        initial: "#eef3f8",
        ideal: "#eef3f8",
        label: "background",
        hint: "Usa `#eef3f8` o `#f8fafc` para distinguir cada tarjeta del fondo blanco.",
        validate: (v) => isColorValue(v)
      },
      m4_card_rad: {
        initial: "12px",
        ideal: "12px",
        label: "border-radius",
        hint: "Un radio de `12px` armoniza con el resto del sistema Cultura360.",
        validate: (v) => isLengthPxOrRem(v, 6, 24)
      }
    },
    codeLines: [
      { type: "comment", text: "/* 1. Rejilla adaptable de actividades */" },
      { type: "ruleStart", selector: ".events-section" },
      { type: "propStatic", indent: 2, prop: "padding", val: "16px 24px 28px" },
      { type: "propStatic", indent: 2, prop: "background", val: "#ffffff" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".events-grid" },
      { type: "propBlank", indent: 2, prop: "display", blankId: "m4_grid_disp" },
      { type: "propBlank", indent: 2, prop: "grid-template-columns", blankId: "m4_grid_cols" },
      { type: "propBlank", indent: 2, prop: "gap", blankId: "m4_grid_gap" },
      { type: "ruleEnd" },
      { type: "comment", text: "/* 2. Tarjeta cultural */" },
      { type: "ruleStart", selector: ".event-card" },
      { type: "propBlank", indent: 2, prop: "background", blankId: "m4_card_bg" },
      { type: "propBlank", indent: 2, prop: "border-radius", blankId: "m4_card_rad" },
      { type: "propStatic", indent: 2, prop: "padding", val: "16px" },
      { type: "propStatic", indent: 2, prop: "border", val: "1px solid #dbe4f0" },
      { type: "propStatic", indent: 2, prop: "transition", val: "transform 0.15s ease" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".event-card:hover" },
      { type: "propStatic", indent: 2, prop: "transform", val: "translateY(-2px)" },
      { type: "ruleEnd" }
    ],
    learnItems: [
      {
        prop: "repeat(auto-fit, minmax(220px, 1fr))",
        desc: "Permite que las tarjetas pasen de 3 columnas en escritorio a 1 en móvil automáticamente sin saturar el CSS con media queries."
      },
      {
        prop: "transition + transform",
        desc: "Animar transform en lugar de propiedades de layout garantiza transiciones fluidas a 60 fps."
      }
    ],
    experiment: {
      title: "Radio y suavidad visual",
      desc: "Comprueba cómo el radio de borde cambia el carácter formal o cercano de una tarjeta.",
      label: "Redondeo de esquinas (border-radius)",
      min: 0,
      max: 28,
      step: 2,
      unit: "px",
      initial: 12,
      cssProp: "borderRadius",
      cardTitle: "Noches de Jazz",
      cardText: "Bordes consistentes en botones, hero y tarjetas."
    },
    htmlEditable: false
  },
  {
    id: "m5",
    number: "05",
    shortTitle: "Reto final",
    isCore: false,
    phaseTag: "FASE 05 · RETO FINAL · 15 MIN",
    title: "Integra HTML semántico y pulido final",
    subtitle: "Combina estructura HTML y detalle CSS en la etiqueta de categoría y pie de tarjeta.",
    clientQuote: "«Queremos destacar las etiquetas y rematar la vista completa»",
    clientDesc:
      "En este reto final puedes editar tanto estilos de insignia (.event-tag) como añadir una cuarta actividad directamente en la pestaña index.html si quieres ver crecer tu rejilla.",
    criteria: [
      { id: "m5-c1", label: "Convertir .event-tag en píldora visual con contraste AA", blankIds: ["m5_tag_bg", "m5_tag_col", "m5_tag_rad"] },
      { id: "m5-c2", label: "Rematar la jerarquía del titular de tarjeta (.event-card h3)", blankIds: ["m5_h3_size"] }
    ],
    roadmapTitle: "RUTA DE PROGRAMACIÓN (4 VALORES + HTML)",
    roadmapSteps: [
      "1. Insignia .event-tag: fondo, color de texto y píldora (3 decisiones)",
      "2. Titular .event-card h3: tamaño legible (1 decisión)",
      "3. Extra en index.html: añade un cuarto <article class='event-card'> y observa la rejilla"
    ],
    extraChallenge: null,
    fileLabel: "styles.css · reto final",
    defaultCompleted: false,
    blanks: {
      m5_tag_bg: {
        initial: "",
        ideal: "#dbeafe",
        label: "background",
        hint: "Usa un fondo suave como `#dbeafe` o `#e0f2fe` para la etiqueta.",
        validate: (v) => isColorValue(v)
      },
      m5_tag_col: {
        initial: "",
        ideal: "#153b64",
        label: "color",
        hint: "Usa un texto oscuro como `#153b64` o `#1e3a8a` para superar el ratio de contraste 4.5:1.",
        validate: (v) => isDarkBlueOrBrandColor(v)
      },
      m5_tag_rad: {
        initial: "999px",
        ideal: "999px",
        label: "border-radius",
        hint: "`999px` convierte cualquier insignia en una píldora perfecta.",
        validate: (v) => isLengthPxOrRem(v, 10, 999)
      },
      m5_h3_size: {
        initial: "16px",
        ideal: "16px",
        label: "font-size",
        hint: "Usa entre `15px` y `19px` (ej. `16px`) para destacar el título del evento.",
        validate: (v) => isLengthPxOrRem(v, 14, 22)
      }
    },
    codeLines: [
      { type: "comment", text: "/* 1. Etiqueta de categoría accesible */" },
      { type: "ruleStart", selector: ".event-tag" },
      { type: "propStatic", indent: 2, prop: "display", val: "inline-block" },
      { type: "propBlank", indent: 2, prop: "background", blankId: "m5_tag_bg" },
      { type: "propBlank", indent: 2, prop: "color", blankId: "m5_tag_col" },
      { type: "propBlank", indent: 2, prop: "border-radius", blankId: "m5_tag_rad" },
      { type: "propStatic", indent: 2, prop: "padding", val: "3px 10px" },
      { type: "propStatic", indent: 2, prop: "font-size", val: "11px" },
      { type: "propStatic", indent: 2, prop: "font-weight", val: "700" },
      { type: "ruleEnd" },
      { type: "comment", text: "/* 2. Titular y metadatos */" },
      { type: "ruleStart", selector: ".event-card h3" },
      { type: "propBlank", indent: 2, prop: "font-size", blankId: "m5_h3_size" },
      { type: "propStatic", indent: 2, prop: "margin", val: "8px 0 6px" },
      { type: "propStatic", indent: 2, prop: "color", val: "#0f172a" },
      { type: "ruleEnd" },
      { type: "ruleStart", selector: ".event-meta" },
      { type: "propStatic", indent: 2, prop: "margin-top", val: "10px" },
      { type: "propStatic", indent: 2, prop: "font-size", val: "12px" },
      { type: "propStatic", indent: 2, prop: "color", val: "#475569" },
      { type: "propStatic", indent: 2, prop: "font-weight", val: "600" },
      { type: "ruleEnd" }
    ],
    learnItems: [
      {
        prop: "Contraste AA (WCAG 2.1)",
        desc: "Las etiquetas pequeñas necesitan al menos 4.5:1 de contraste entre texto y fondo; combina fondo claro (#dbeafe) con tinta profunda (#153b64)."
      },
      {
        prop: "border-radius: 999px",
        desc: "Truco clásico en CSS para generar bordes completamente circulares en píldoras sin depender de su altura exacta."
      }
    ],
    experiment: {
      title: "Escala tipográfica en tarjetas",
      desc: "Prueba el tamaño del titular de tarjeta para que destaque sobre su descripción sin competir con el H1.",
      label: "Tamaño del titular de tarjeta",
      min: 13,
      max: 24,
      step: 1,
      unit: "px",
      initial: 16,
      cssProp: "headingSize",
      cardTitle: "Geometrías del Color",
      cardText: "Jerarquía secundaria clara dentro de la rejilla."
    },
    htmlEditable: true
  }
];
