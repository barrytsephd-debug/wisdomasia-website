# WisdomAsia Website

Source for [wisdomasia-mr.com](https://wisdomasia-mr.com) — a single-page static site for WisdomAsia's independent research and consulting practice.

## Stack

- Plain HTML (`index.html`) and vanilla JavaScript (`script.js`) — no framework, no client-side routing.
- Tailwind CSS v4, compiled at build time via the `@tailwindcss/vite` plugin from `styles.css`.
- [Vite](https://vite.dev) is used only as a build step: it compiles `styles.css`, bundles `script.js`, and copies everything in `public/` (images, favicon) to the site root.
- Icons via [Lucide](https://lucide.dev), loaded from a version-pinned CDN script tag in `index.html`.

## Local development

```
npm install
npm run dev
```

## Build

```
npm run build
```

Outputs the deployable static site to `dist/`.

## Deployment

Pushes to `main` are built and deployed automatically to GitHub Pages by `.github/workflows/deploy.yml`.
