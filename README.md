## ⚡ Overview

[**wilsonwu.io**](https://wilsonwu.io) is my personal website, showcasing my portfolio projects, resume, and socials.

## 🔭 Architecture

```
┌───────────────────────────────────────────┐
│                  Browser                  │
│                                           │
│      ┌───────────┐     ┌───────────┐      │
│      │  React    │←───→│    rAF    │      │
│      │ SVG + text│     │  engine   │      │
│      └───────────┘     └───────────┘      │
└─────────────────────┬─────────────────────┘
                      │ static build
              ┌───────┴───────┐
              │ GitHub Pages  │
              │ Cloudflare DNS│
              └───────────────┘
```

## 🚀 Stack

- React 18 (TS)
- Tailwind CSS v3
- Vite 5
- No animation libraries; everything is hand-rolled SVG + `requestAnimationFrame` (zero runtime deps beyond React)

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

Deployed on [GitHub Pages](https://pages.github.com); DNS via [Cloudflare](https://www.cloudflare.com).

```bash
npm run deploy
```
