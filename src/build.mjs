// Static site builder. No dependencies; needs Node 18+.
//   node src/build.mjs                 -> dist/ (deployable site)
//   HIDE_PLACEHOLDERS=1 node src/build.mjs   -> same, with placeholder boxes removed
import { mkdir, writeFile, cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { site, hero, projects, about, skills } from "./content.mjs";
import { diagrams } from "./diagrams.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(root, "dist");
const HIDE = process.env.HIDE_PLACEHOLDERS === "1";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SECTIONS = [
  ["overview", "Overview"],
  ["contribution", "My contribution"],
  ["challenge", "Engineering challenge"],
  ["approach", "Approach"],
  ["evidence", "Evidence"],
  ["outcome", "Outcome"],
  ["next", "Next steps"],
];

const STATUS_LABEL = { done: "Done", active: "In progress", planned: "Planned" };

function chip([kind, label]) {
  return `<span class="chip chip--${kind}"><span class="chip__dot" aria-hidden="true"></span>${esc(label)}</span>`;
}

function img({ src, alt, w, h }, cls = "") {
  return `<img class="${cls}" src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
}

// ── blocks ────────────────────────────────────────────────────────────
function block(b, ctx) {
  if (b.p) return `<p>${b.p}</p>`;
  if (b.list) return `<ul class="bullets">${b.list.map((li) => `<li>${li}</li>`).join("")}</ul>`;
  if (b.math) return `<div class="math">\\[${b.math}\\]</div>`;
  if (b.figure) {
    const f = b.figure;
    const n = ++ctx.fig;
    const paper = /\.png$/.test(f.src) ? " fig--paper" : "";
    return `<figure class="fig${f.wide ? " fig--wide" : ""}${paper}">
      <div class="fig__frame"><a href="${f.src}" target="_blank" rel="noopener" aria-label="Open full-size image: ${esc(f.alt)}">${img(f, "fig__img")}</a></div>
      <figcaption><span class="fig__no">Fig. ${n}</span>${esc(f.caption)}</figcaption>
    </figure>`;
  }
  if (b.diagram) {
    const n = ++ctx.fig;
    return `<figure class="fig fig--wide fig--diagram">
      <div class="fig__frame fig__frame--scroll">${diagrams[b.diagram]}</div>
      <figcaption><span class="fig__no">Fig. ${n}</span>${esc(b.caption)}</figcaption>
    </figure>`;
  }
  if (b.placeholder) {
    if (HIDE) return "";
    return `<div class="ph" role="note">
      <span class="ph__tag">To add</span>
      <p class="ph__what">${esc(b.placeholder)}</p>
      ${b.note ? `<p class="ph__note">${esc(b.note)}</p>` : ""}
    </div>`;
  }
  if (b.table) {
    const t = b.table;
    const num = new Set(t.numeric || []);
    const cell = (tag, v, i) => `<${tag}${num.has(i) ? ' class="num"' : ""}>${v}</${tag}>`;
    return `<figure class="tbl">
      <figcaption>${t.caption}</figcaption>
      <div class="tbl__scroll" tabindex="0" role="region" aria-label="${esc(t.caption.replace(/\\\(|\\\)/g, ""))}">
        <table><thead><tr>${t.head.map((h, i) => cell("th", esc(h), i)).join("")}</tr></thead>
        <tbody>${t.rows.map((r) => `<tr>${r.map((v, i) => cell("td", esc(v), i)).join("")}</tr>`).join("")}</tbody></table>
      </div>
      ${t.note ? `<p class="tbl__note">${esc(t.note)}</p>` : ""}
    </figure>`;
  }
  if (b.status) {
    return `<ol class="status">${b.status
      .map(([k, item]) => `<li class="status__row status__row--${k}"><span class="chip chip--${k}"><span class="chip__dot" aria-hidden="true"></span>${STATUS_LABEL[k]}</span><span>${esc(item)}</span></li>`)
      .join("")}</ol>`;
  }
  if (b.figs) return `<div class="figs">${b.figs.map((x) => block(x, ctx)).join("")}</div>`;
  throw new Error("Unknown block: " + JSON.stringify(b).slice(0, 80));
}

// ── case study ────────────────────────────────────────────────────────
function caseStudy(p, i) {
  const ctx = { fig: 0 };
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const secs = SECTIONS.filter(([k]) => p.sections[k]?.length)
    .map(([k, label], n) => {
      const body = p.sections[k].map((b) => block(b, ctx)).join("\n");
      if (!body.trim()) return "";
      return `<section class="cs" id="${p.id}-${k}" aria-labelledby="${p.id}-${k}-h">
        <h3 class="cs__h" id="${p.id}-${k}-h"><span class="cs__n">${String(n + 1).padStart(2, "0")}</span>${label}</h3>
        <div class="cs__body">${body}</div>
      </section>`;
    })
    .join("\n");
  const toc = SECTIONS.filter(([k]) => p.sections[k]?.length)
    .map(([k, label]) => `<li><a href="#${p.id}-${k}">${label}</a></li>`)
    .join("");
  return `<article class="case" id="${p.id}" aria-labelledby="${p.id}-title" data-title="${esc(p.title)}">
  <div class="case__head band">
    <div class="wrap">
      <a class="back" href="#card-${p.id}"><span aria-hidden="true">←</span> All projects</a>
      <p class="eyebrow">${esc(p.code)} · Case study</p>
      <h2 class="case__title" id="${p.id}-title" tabindex="-1">${esc(p.title)}</h2>
      <p class="case__lede">${esc(p.summary)}</p>
      <dl class="titleblock">
        <div><dt>Organization</dt><dd>${esc(p.org)}</dd></div>
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Period</dt><dd>${esc(p.period)}</dd></div>
        <div><dt>Status</dt><dd>${chip(p.status)}</dd></div>
        <div class="titleblock__wide"><dt>Tools and methods</dt><dd>${p.tools.map(esc).join(" · ")}</dd></div>
      </dl>
    </div>
  </div>
  <div class="wrap case__grid">
    <nav class="toc" aria-label="${esc(p.title)} sections"><p class="toc__h">Contents</p><ol>${toc}</ol></nav>
    <div class="case__body">${secs}</div>
  </div>
  <nav class="wrap pager" aria-label="More case studies">
    <a href="#${prev.id}"><span class="pager__k">Previous</span><span class="pager__t">${esc(prev.title)}</span></a>
    <a href="#${next.id}" class="pager__next"><span class="pager__k">Next</span><span class="pager__t">${esc(next.title)}</span></a>
  </nav>
</article>`;
}

// ── home ──────────────────────────────────────────────────────────────
function facts(p) {
  return `<dl class="facts">${p.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
}

function featured(p, i) {
  const pos = p.id === "fasteners" ? ' style="object-position:50% 35%"' : "";
  return `<article class="feat" id="card-${p.id}">
    <a class="feat__media" href="#${p.id}" tabindex="-1" aria-hidden="true">
      <img src="${p.cover.src}" alt="" width="${p.cover.w}" height="${p.cover.h}" loading="${i === 0 ? "eager" : "lazy"}" decoding="async"${pos}>
      <span class="feat__code">${esc(p.code)}</span>
    </a>
    <div class="feat__text">
      <p class="eyebrow">${esc(p.org.split(" (")[0])}</p>
      <h3 class="feat__title"><a href="#${p.id}">${esc(p.title)}</a></h3>
      <p class="feat__sum">${esc(p.summary)}</p>
      ${facts(p)}
      <div class="feat__foot">${chip(p.status)}<a class="link-arrow" href="#${p.id}" aria-label="Read case study: ${esc(p.title)}">Read case study <span aria-hidden="true">→</span></a></div>
    </div>
  </article>`;
}

function archiveCard(p) {
  const media = p.cover
    ? `<img src="${p.cover.src}" alt="" width="${p.cover.w}" height="${p.cover.h}" loading="lazy" decoding="async">`
    : `<span class="card__empty" aria-hidden="true"><span>Photos to add</span></span>`;
  return `<article class="card" id="card-${p.id}">
    <a class="card__media${p.cover && /\.png$/.test(p.cover.src) ? " card__media--paper" : ""}" href="#${p.id}" tabindex="-1" aria-hidden="true">${media}</a>
    <p class="eyebrow">${esc(p.code)} · ${esc(p.period)}</p>
    <h3 class="card__title"><a href="#${p.id}">${esc(p.title)}</a></h3>
    <p class="card__sum">${esc(p.summary)}</p>
    <div class="card__foot">${chip(p.status)}</div>
  </article>`;
}

function contactLinks() {
  const items = [
    `<li><span class="contact__k">Email</span><span class="contact__v"><a href="mailto:${site.email}" id="email-link">${site.email}</a><button type="button" class="copy" id="copy-email" data-copy="${site.email}">Copy</button></span></li>`,
    `<li><span class="contact__k">LinkedIn</span><span class="contact__v"><a href="${site.linkedin}" target="_blank" rel="noopener">${site.linkedin.replace(/^https:\/\/www\./, "").replace(/\/$/, "")}</a></span></li>`,
  ];
  if (site.github) items.push(`<li><span class="contact__k">GitHub</span><span class="contact__v"><a href="${site.github}" target="_blank" rel="noopener">${site.github.replace(/^https?:\/\//, "")}</a></span></li>`);
  items.push(`<li><span class="contact__k">Resume</span><span class="contact__v"><a href="${site.resume}" target="_blank" rel="noopener">Open PDF</a></span></li>`);
  items.push(`<li><span class="contact__k">Based in</span><span class="contact__v">${site.location}</span></li>`);
  return `<ul class="contact">${items.join("")}</ul>`;
}

function body() {
  const feat = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <div class="wrap topbar__in">
    <a class="brand" href="#top" aria-label="Rishab Navadgi, home"><span class="brand__mark" aria-hidden="true">RN</span><span class="brand__name">Rishab Navadgi</span></a>
    <nav aria-label="Primary"><ul class="nav">
      <li><a href="#work">Work</a></li><li><a href="#about">About</a></li><li><a href="#skills">Skills</a></li><li><a href="#contact">Contact</a></li>
      <li><a class="btn btn--small" href="${site.resume}" target="_blank" rel="noopener">Resume</a></li>
      <li><button type="button" class="theme" id="theme-toggle" aria-label="Switch to light theme"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M10 3a7 7 0 0 1 0 14z"/></svg></button></li>
    </ul></nav>
  </div>
</header>
<main id="main">
<div id="home">
  <section class="hero band band--grid" id="top" aria-labelledby="hero-name">
    <div class="wrap hero__grid">
      <div class="hero__text">
        <p class="eyebrow">${esc(hero.eyebrow)}</p>
        <h1 id="hero-name" class="hero__name">${esc(site.name)}</h1>
        <p class="hero__lines">${hero.lines.map((l) => `<span>${esc(l)}</span>`).join("")}</p>
        <p class="hero__intro">${esc(hero.intro)}</p>
        <div class="hero__cta">
          <a class="btn btn--primary" href="#work">Explore My Projects</a>
          <a class="btn" href="${site.resume}" target="_blank" rel="noopener">View Resume</a>
        </div>
        <dl class="hero__roles">${hero.roles.map(([o, r]) => `<div><dt>${esc(o)}</dt><dd>${esc(r)}</dd></div>`).join("")}</dl>
      </div>
      <figure class="sheet">
        <div class="sheet__paper">
          <span class="sheet__reg sheet__reg--tl" aria-hidden="true"></span><span class="sheet__reg sheet__reg--tr" aria-hidden="true"></span>
          <span class="sheet__reg sheet__reg--bl" aria-hidden="true"></span><span class="sheet__reg sheet__reg--br" aria-hidden="true"></span>
          <img src="${hero.image.src}" alt="${esc(hero.image.alt)}" width="${hero.image.w}" height="${hero.image.h}" fetchpriority="high">
        </div>
        <figcaption class="sheet__block">${hero.sheet.map(([k, v]) => `<span><b>${esc(k)}</b>${esc(v)}</span>`).join("")}</figcaption>
      </figure>
    </div>
  </section>

  <section class="sec" id="work" aria-labelledby="work-h">
    <div class="wrap">
      <div class="sec__head"><h2 id="work-h" class="sec__h">Selected work</h2><p class="sec__meta">${feat.length} case studies · ${more.length} more below</p></div>
      <div class="feats">${feat.map(featured).join("")}</div>
      <div class="sec__head sec__head--sub"><h3 class="sec__h2">More projects</h3></div>
      <div class="cards">${more.map(archiveCard).join("")}</div>
    </div>
  </section>

  <section class="sec sec--alt" id="about" aria-labelledby="about-h">
    <div class="wrap about">
      <div class="about__bio">
        <h2 id="about-h" class="sec__h">About</h2>
        ${about.bio.map((t) => `<p>${esc(t)}</p>`).join("")}
        <p class="about__edu"><b>${esc(site.degree)}</b><br>${esc(site.school)} · ${esc(site.grad)}</p>
        <h3 class="sec__h3">Technical interests</h3>
        <ul class="tags">${about.interests.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
      <div class="about__time">
        <h3 class="sec__h3">Experience</h3>
        <ol class="timeline">${about.timeline.map(([d, o, r]) => `<li><span class="timeline__d">${esc(d)}</span><span class="timeline__o">${esc(o)}</span><span class="timeline__r">${esc(r)}</span></li>`).join("")}</ol>
      </div>
    </div>
  </section>

  <section class="sec" id="skills" aria-labelledby="skills-h">
    <div class="wrap">
      <div class="sec__head"><h2 id="skills-h" class="sec__h">Technical skills</h2><p class="sec__meta">Grouped by what the work needs. Each item ties to a project on this site or the resume.</p></div>
      <div class="skills">${skills.map(([g, items]) => `<div class="skill"><h3 class="skill__h">${esc(g)}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
    </div>
  </section>

  <section class="sec sec--alt" id="contact" aria-labelledby="contact-h">
    <div class="wrap contact__grid">
      <div><h2 id="contact-h" class="sec__h">Contact</h2><p class="contact__lede">I'm looking for internships in aerospace structures, composites, and mechanical design. Email is the fastest way to reach me.</p></div>
      ${contactLinks()}
    </div>
  </section>
</div>
<div id="cases">
${projects.map(caseStudy).join("\n")}
</div>
</main>
<footer class="foot"><div class="wrap foot__in"><span>© <span id="year">2026</span> ${esc(site.name)}</span><a href="#top">Back to top</a></div></footer>`;
}

const FONTS = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..700&family=IBM+Plex+Mono:wght@400;500&family=Source+Sans+3:ital,wght@0,400..700;1,400..500&display=swap";
const MATHJAX = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js";
const MJ_CONFIG = `<script>window.MathJax={tex:{inlineMath:[["\\\\(","\\\\)"]],displayMath:[["\\\\[","\\\\]"]]},svg:{fontCache:"global"},options:{skipHtmlTags:["script","noscript","style","textarea","pre","code","svg"]}};</script>`;
const EARLY = `<script>document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>`;

function head() {
  const ogImg = new URL(hero.image.src, site.url).href;
  const ld = { "@context": "https://schema.org", "@type": "Person", name: site.name, url: site.url, jobTitle: "Materials Science and Engineering student", affiliation: { "@type": "CollegeOrUniversity", name: site.school }, sameAs: [site.linkedin, site.github].filter(Boolean) };
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(site.title)}</title>
<meta name="description" content="${esc(site.description)}">
<link rel="canonical" href="${site.url}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(site.title)}"><meta property="og:description" content="${esc(site.description)}"><meta property="og:url" content="${site.url}"><meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#121416">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="css/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${EARLY}
${MJ_CONFIG}
<script defer src="${MATHJAX}"></script>
<script defer src="js/site.js"></script>`;
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await cp(path.join(root, "static"), DIST, { recursive: true });
const html = `<!doctype html>\n<html lang="en">\n<head>\n${head()}\n</head>\n<body>\n${body()}\n</body>\n</html>\n`;
await writeFile(path.join(DIST, "index.html"), html);

// Preview fragment for a claude.ai Artifact (the host supplies doctype, head and body).
const frag = `<title>Rishab Navadgi Portfolio</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="css/site.css">
${EARLY}
${MJ_CONFIG}
<script defer src="${MATHJAX}"></script>
<script defer src="js/site.js"></script>
${body()}`;
await mkdir(path.join(root, ".artifact"), { recursive: true });
await writeFile(path.join(root, ".artifact", "index.html"), frag);

console.log(`Built dist/ (${projects.length} case studies${HIDE ? ", placeholders hidden" : ""}).`);
