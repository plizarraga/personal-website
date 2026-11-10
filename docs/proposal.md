# Propuesta: sitio web de marca personal

Acordada el 2026-11-10 en una sesión de grilling (tres rondas, todas las recomendaciones aceptadas). Los términos en inglés en **negritas** están definidos en [`GLOSSARY.md`](../GLOSSARY.md).

## 1. Objetivo

Que un reclutador entienda en 10 segundos quién es Pedro Lizárraga, qué ha construido y cómo contactarlo, y que Google y los LLMs lo identifiquen como una sola persona con un perfil claro.

| Audiencia | Rol en el sitio |
| --- | --- |
| **Primary audience**: reclutadores y hiring managers de puestos Senior Full-Stack remotos | Todo el home se escribe para ellos |
| **Freelance client**: negocios que quieren un agente de IA | Un bloque al final del home que enlaza al caso de estudio del agente |

## 2. Identidad

- **Canonical name:** "Pedro Lizárraga". Las variantes "Pedro Lizárraga Brambila" y "Pedro Lizarraga" van solo en `alternateName` del JSON-LD.
- **Headline:** "Senior Software Engineer | Full-Stack", con la misma redacción en el sitio, el CV, LinkedIn y GitHub.
- **Differentiators**, en el subtítulo del hero: plataformas de salud con Epic FHIR y GraphQL, y agentes de IA.
- **Datos públicos:** email, LinkedIn, GitHub y "Mexicali, Baja California, Mexico · Remote". El teléfono no aparece ni en el sitio ni en el PDF.
- **Coherencia entre perfiles.** Hoy hay dos inconsistencias que corregir:
  - La bio de GitHub dice "Frontend Developer | Angular". Hay que cambiarla al Headline.
  - El README del perfil de GitHub (repo `plizarraga/plizarraga`) describe a un frontend developer y enlaza a una URL vieja de LinkedIn (`/in/pedro-lizárraga-6455a15a`). Hay que reescribirlo con la URL vigente: `https://www.linkedin.com/in/pedro-lizarraga-brambila` (confirmada el 2026-11-10).

## 3. Páginas

Hay tres tipos de página y nada más: ni `/about` ni `/blog` al lanzar.

### `/`: home

Se lee de arriba abajo en este orden:

1. **Navegación mínima:** el nombre enlaza al inicio, más Experience, Work y Contact.
2. **Hero:**
   - Foto pequeña, la misma de LinkedIn.
   - `<h1>Pedro Lizárraga</h1>`, el Headline y el subtítulo con los Differentiators.
   - Una línea con "Mexicali, Baja California, Mexico · Remote".
   - Acciones: *Email me*, *Download CV (PDF)*, LinkedIn y GitHub.
3. **Selected work:** los 3 casos de estudio, cada uno con título, una línea de resumen y su stack. Son enlaces de texto, sin miniaturas.
4. **Experience (resumen):** los 3 roles más recientes en una línea cada uno, y un enlace a `/experience`.
5. **Bloque freelance:** algo como "I also build AI agents for businesses", con enlace al caso de estudio del agente.
6. **Footer:** email, perfiles y fecha de última actualización.

### `/experience`: CV completo en HTML

Es la versión que leen los crawlers y los LLMs: todo el texto del CV con encabezados semánticos, sin teléfono. Desde aquí se descarga el PDF.

### `/work/<slug>`: casos de estudio

Al lanzar hay tres:

| Slug sugerido | Proyecto | Nota |
| --- | --- | --- |
| `healthcare-platform` | Healthcare Platform (Publicis Sapient) | Sin nombre del cliente, igual que en el CV |
| `ai-appointment-agent` | Agente de citas con IA | Marcado "in development" |
| `nestjs-starter-template` | starter-template-nestjs | Con enlace al código público |

Fender queda para después del lanzamiento.

**Plantilla de cada caso:**
- **Summary:** 2 o 3 frases autocontenidas que un LLM pueda citar tal cual.
- **Context**
- **My role**
- **What I built**
- **Key decisions:** qué se eligió y por qué.
- **Outcome:** cualitativo si no hay métricas confirmadas.
- **Stack**
- **Dates**

## 4. Reglas de contenido

- **CV Master como única fuente.** Todo dato sale de `CV_MASTER.md`. Lo nuevo que surja en las entrevistas de los casos de estudio se confirma y se agrega al master *antes* de publicarse. Hoy el master no tiene ninguna métrica, así que no se inventa ninguna.
- **El agente sigue "in development"** hasta que realmente esté en producción.
- **Idioma:** solo inglés. La página en español para clientes freelance se agrega cuando el agente salga de desarrollo.
- **El nombre en la primera frase.** La primera frase de cada página nombra a la persona y lo que hace: "I'm Pedro Lizárraga, a Senior Software Engineer…". Una frase así se entiende fuera de contexto, que es como la citan los LLMs.
- **Tecnologías con su nombre completo** y siempre escritas igual que en el master: "TypeScript", no "TS".
- **Sincronización a mano.** Cuando cambie el master, se actualiza el Markdown del sitio. El PDF se genera en el repo `career` como una variante "website" sin teléfono y se copia al sitio.

## 5. UI/UX: estilo "documento"

**Lectura**
- Una sola columna de unos 68 a 70 caracteres de ancho.
- Texto base de unos 18 px con interlineado de 1.6.
- Jerarquía con un solo `h1` por página y `h2`/`h3` sin saltarse niveles.
- Textos fáciles de escanear: lo importante al inicio de cada línea, listas con el arranque en negritas y párrafos cortos.

**Tipografía y color**
- Fuente del sistema (`system-ui`) o una sola fuente variable autoalojada, sin pedir fuentes a terceros.
- Fondo y texto neutros, con un solo color de acento para los enlaces y el nombre.
- Modo oscuro automático con `prefers-color-scheme`.

**Lo que no lleva:** animaciones, carruseles, modales, barras de habilidad, muros de logos, grids de íconos de tecnologías, banner de cookies (no hay cookies) ni widget de chat.

**Accesibilidad (WCAG 2.2 AA)**
- Contraste de al menos 4.5:1.
- Enlaces subrayados y foco visible.
- Un enlace "skip to content" al inicio.
- Zonas táctiles de al menos 24×24 px.
- Texto alternativo en la foto.

**Rendimiento**
- Cero JavaScript en el navegador.
- Foto en AVIF o WebP con `width` y `height` declarados, para que la página no salte al cargar.
- Diseño pensado primero para móvil.

## 6. SEO técnico

- **Título y descripción** distintos en cada página: título de unos 60 caracteres y meta descripción de unos 155. En el home, por ejemplo: `Pedro Lizárraga · Senior Software Engineer, Full-Stack`.
- **URLs:**
  - Canónica absoluta en cada página.
  - Un solo host: `www` redirige al dominio sin `www`.
  - HTTPS y la misma política de slash final en todas las URLs.
- **Sitemap y robots.txt:** `@astrojs/sitemap` genera el sitemap a partir de `site` en `astro.config`. `robots.txt` permite todo e incluye la línea `Sitemap:`.
- **Datos estructurados (JSON-LD):**
  - **Home:** `ProfilePage` con `mainEntity` de tipo `Person`. Google dice que `ProfilePage` aplica a páginas centradas en una persona, y menciona como ejemplo válido la página "About Me" de un blog.
  - **Casos de estudio:** `Article` con `author` apuntando al mismo `Person` mediante su `@id`.
  - **`Person`:** `name`, `alternateName`, `jobTitle`, `url`, `image`, `email`, `sameAs` (LinkedIn y GitHub), `knowsAbout` (tecnologías del master), `address` (Mexicali, MX) y `alumniOf` (Instituto Tecnológico de Mexicali).
- **Open Graph:** una sola imagen de 1200×630 para compartir (nombre más Headline), y `og:type` de tipo `profile` en el home.
- **Otros:**
  - Página 404 propia.
  - Enlaces internos entre el home, `/experience` y los casos de estudio.
  - Enlaces de regreso desde tus perfiles: campo de sitio web en LinkedIn y GitHub, y el README del perfil de GitHub.

Esqueleto del JSON-LD del home. Los valores definitivos salen del master:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://pedrolizarraga.com/#person",
    "name": "Pedro Lizárraga",
    "alternateName": ["Pedro Lizárraga Brambila", "Pedro Lizarraga"],
    "jobTitle": "Senior Software Engineer",
    "url": "https://pedrolizarraga.com/",
    "image": "https://pedrolizarraga.com/pedro-lizarraga.jpg",
    "email": "mailto:hello@pedrolizarraga.com",
    "address": { "@type": "PostalAddress", "addressLocality": "Mexicali", "addressRegion": "Baja California", "addressCountry": "MX" },
    "sameAs": ["https://www.linkedin.com/in/pedro-lizarraga-brambila", "https://github.com/plizarraga"],
    "knowsAbout": ["TypeScript", "Node.js", "NestJS", "React", "Angular", "GraphQL", "PostgreSQL", "FHIR", "AI agents"]
  }
}
```

## 7. Lectura por LLMs y crawlers

- **HTML estático completo.** Todo el texto está en el HTML y nada va dentro de imágenes.
- **Elementos semánticos:** `header`, `nav`, `main`, `article`, `section`, `footer` y `time datetime`.
- **`/llms.txt`:** el nombre, un resumen en un blockquote y la lista de páginas con enlace a su versión Markdown. Ojo: es una propuesta de estándar y ningún proveedor grande ha confirmado que lo lea. Es un extra barato que no reemplaza ni el HTML semántico ni el JSON-LD.
- **Copia en Markdown de cada página** (`/experience.md`, `/work/<slug>.md`), generada en el build con endpoints estáticos de Astro (`src/pages/experience.md.ts`).
- **`robots.txt` abierto a todos los bots**, incluidos los de entrenamiento.
  - En Cloudflare, los dominios nuevos dejan Search, Agents y Training en "Allow" por defecto.
  - Antes de lanzar, conviene revisarlo en *Security › Settings › AI Crawler and Agent access policies*.
- **Coherencia fuera del sitio.** El mismo Headline y el mismo resumen en LinkedIn, GitHub y el sitio son la señal más fuerte para que un modelo no confunda personas.
- **Revisión mensual:** preguntar a ChatGPT, Claude, Perplexity y Gemini "Who is Pedro Lizárraga, software engineer?" y anotar qué responden.

## 8. Infraestructura

| Pieza | Elección | Nota verificada en docs (nov 2026) |
| --- | --- | --- |
| Framework | Astro, salida estática | La versión mayor actual es la 7. Un sitio 100 % estático no necesita adapter |
| Hosting | Cloudflare Workers Static Assets | Cloudflare recomienda Workers en lugar de Pages para proyectos nuevos. Basta un `wrangler.jsonc` con `assets.directory: "./dist"` y `not_found_handling: "404-page"` |
| Dominio | `pedrolizarraga.com` en Cloudflare Registrar | Precio de costo al registrar y renovar, privacidad WHOIS gratis y DNS obligatorio de Cloudflare. Activar 2FA en la cuenta |
| Correo | Cloudflare Email Routing: `hello@` → Gmail | Las respuestas salen desde Gmail, salvo que configures "send as" con otro SMTP |
| Analítica | Cloudflare Web Analytics | Sin cookies ni banner |
| Consolas | Google Search Console (propiedad de dominio vía DNS) y Bing Webmaster Tools (importable desde Search Console) | |
| Código | Repo público en GitHub | Muestra de código, sin secretos |

## 9. Orden de trabajo

**Fase 0: base**
1. Comprar `pedrolizarraga.com` en Cloudflare Registrar y activar 2FA.
2. Configurar Email Routing para `hello@pedrolizarraga.com`.

**Fase 1: contenido sin entrevistas**
1. Crear el repo de Astro y el layout del estilo "documento".
2. Construir el home y `/experience` a partir del master.
3. Generar el PDF "website" en el repo `career`.
4. Agregar SEO y la capa para LLMs: metadatos, JSON-LD, sitemap, `robots.txt`, `llms.txt` y las copias `.md`.
5. Publicar una vista previa en `workers.dev` sin compartirla.

**Fase 2: casos de estudio**, uno a la vez y en este orden: Healthcare Platform, agente de IA y starter de NestJS.
1. Hacer la entrevista corta.
2. Confirmar los datos nuevos en el master.
3. Escribir el caso y revisarlo.

**Fase 3: lanzamiento**
1. Conectar el dominio y la redirección de `www`.
2. Verificar las políticas de crawlers de IA en Cloudflare.
3. Validar el JSON-LD con el Rich Results Test de Google.
4. Revisar con Lighthouse.
5. Dar de alta el sitio en Search Console y Bing, y enviar el sitemap.

**Fase 4: perfiles.** Actualizar la bio y el campo de sitio web de GitHub, reescribir el README del perfil y agregar el sitio en LinkedIn.

**Después del lanzamiento**
- El caso de estudio de Fender.
- La página en español para clientes freelance, cuando el agente esté en producción.
- Reconsiderar el blog solo si puedes publicar con regularidad.

## 10. Pendientes que dependen de ti

- [x] Confirmar la URL de LinkedIn vigente: `https://www.linkedin.com/in/pedro-lizarraga-brambila`.
- [ ] Una foto profesional, la misma de LinkedIn.
- [ ] Las tres entrevistas de casos de estudio.
- [ ] Opcional pero valioso: responder los "Open details" del master, sobre todo métricas que puedas defender.
- [ ] Comprar el dominio.

## 11. Cómo medir si funciona

- **Lighthouse:** 95 o más en Performance, Accessibility, Best Practices y SEO, en móvil.
- **Rich Results Test:** `ProfilePage` válido y sin errores.
- **Search Console:** el sitio indexado y apareciendo en búsquedas de tu nombre. Revisarlo cada mes.
- **Respuestas de LLMs:** la revisión mensual de la sección 7, para ver si te describen con el Headline y los Differentiators.

## 12. Fuera de alcance al lanzar

Blog, `/about`, versión en español, formulario de contacto, calendario de reuniones, GA4, animaciones, teléfono y el caso de estudio de Fender.
