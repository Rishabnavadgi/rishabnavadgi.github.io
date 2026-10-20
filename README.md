# Rishab Navadgi engineering portfolio

Static site. All copy and project data live in `src/content.mjs`. A small Node script renders it to plain HTML in `dist/`. No frameworks and no runtime dependencies. The only external requests are Google Fonts and MathJax (cdnjs) for equations.

## Run locally

Needs Node 18 or newer.

```bash
npm run dev        # build, then serve dist/ at http://localhost:4173
npm run build      # rebuild dist/ after editing content
npm run check      # verify links, anchors, ids, image alt text and dimensions
```

## Deploy

Build with placeholders hidden, then upload `dist/`.

```bash
npm run build:public && npm run check
```

- **Netlify**. Drag `dist/` onto app.netlify.com/drop, or connect the repo with build command `npm run build:public` and publish directory `dist`.
- **Vercel**. Import the repo, framework preset "Other", build command `npm run build:public`, output directory `dist`.
- **GitHub Pages**. Push `dist/` to a `gh-pages` branch, or use a Pages workflow that runs `npm run build:public` and uploads `dist`.

After you have a domain, set `site.url` in `src/content.mjs` so the canonical and Open Graph tags point at it.

## Structure

```
src/content.mjs    site info, hero, projects (case studies), about, skills
src/diagrams.mjs   hand-drawn SVG schematics used in case studies
src/build.mjs      renders dist/index.html
src/check.mjs      static link and asset checks
src/serve.mjs      local preview server
static/            css, js, favicon, images, resume PDF (copied into dist/)
```

Case studies open as views on the same page (`#aip`, `#resin`, `#fasteners`, `#satellite-cad`, `#mass-tracking`, `#cubesat`, `#uav`). Without JavaScript they stack below the home sections, so every link still works.

## Adding or editing a project

Add an object to `projects` in `src/content.mjs`. Set `featured: true` to put it in the large rows on the home page. Each section is a list of blocks (`p`, `list`, `math`, `figure`, `figs`, `table`, `status`, `diagram`, `placeholder`). The block types are documented at the top of the file. Put images in `static/assets/img/` and give each one real `w` and `h` values.

## Replacing the resume

Overwrite `static/assets/Rishab_Navadgi_Resume.pdf`, or change `site.resume`.
