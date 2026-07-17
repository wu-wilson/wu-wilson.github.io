## ⚡ Overview

[**wilsonwu.io**](https://wilsonwu.io) is my personal portfolio — a scroll-driven notebook where one continuous hand-drawn line threads every section. Desktop is a pinned, scroll-scrubbed film; mobile is a flowing document. No animation libraries — all motion is hand-rolled from `requestAnimationFrame` + CSS.

## 🔭 Architecture

```
React SPA (Vite · Tailwind) ──► rAF scroll engine ──► scenes + the line
            └── static build ──► GitHub Pages · wilsonwu.io (Cloudflare DNS)
```

Static and frontend-only, no backend. One `requestAnimationFrame` loop maps scroll to every scene and to the single SVG line — measured from the live layout, scrubbed as a moving dash-window. Desktop pins a tall track under a sticky stage; mobile flows.

## 🚀 Stack

- React 18 (TS)
- Tailwind CSS v3
- Vite 5
- No animation libraries (hand-rolled `requestAnimationFrame` + CSS)

## 🛠️ Local Setup

#### 1. Clone the repository

```bash
git clone https://github.com/wu-wilson/wu-wilson.github.io.git
cd wu-wilson.github.io
```

#### 2. Install and run

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

> Requires Node.js 18+ and npm 9+.

## ☁️ Deployment

Deployed on [GitHub Pages](https://pages.github.com) from the `wu-wilson.github.io` repository. `public/CNAME` points the site at the custom domain `wilsonwu.io`; DNS via [Cloudflare](https://www.cloudflare.com).

One command builds and publishes the static bundle to the `gh-pages` branch:

```bash
npm run deploy
```

`predeploy` runs `npm run build` (type-check + Vite build) first, then `gh-pages -d dist` pushes `dist/`.
