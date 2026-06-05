# MD Escapes 🏡

**Private stays, designed slowly.**

A curated rental platform with a built-in AI room visualizer — upload any room photo, repaint walls live, stage furniture, and get a cinematic AI design vision.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.example .env.local
```
Then open `.env.local` and replace `sk-ant-your-key-here` with your actual key from [console.anthropic.com](https://console.anthropic.com).

### 3. Run the dev server
```bash
npm run dev
```

Opens at **http://localhost:3000**

---

## Project Structure

```
md-escapes/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← Main app — all components live here
│   ├── main.jsx         ← React entry point
│   └── index.css        ← Global resets
├── .env.example         ← Copy to .env.local, add your API key
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Features

- **Room Intelligence** — auto-analyzes uploaded room on drop (type, style, light, quick wins)
- **Before/After Slider** — drag to compare original vs wall color preview live
- **Stage Furniture** — place emoji furniture directly on the image, drag to position
- **Quick Transforms** — one-tap presets (AirBnb Ready, Cozy Sanctuary, Home Office, etc.)
- **Custom Color Picker** — full hex + native color picker beyond the swatches
- **Saved Visions** — bank up to 3 AI design visions to compare directions
- **Fully responsive** — mobile accordion, tablet/desktop side-by-side layout

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Ready to deploy on Vercel, Netlify, or any static host.

> ⚠️ **Important:** For production, move your API calls to a backend route (Next.js API route, Express, etc.) so your API key is never exposed in the browser bundle.

---

## Tech Stack

- **React 18** + **Vite**
- **Anthropic Claude API** (claude-sonnet-4-20250514)
- Zero additional dependencies — all UI is inline styles + vanilla React

---

Built with ❤️ by DTE Solutions LLC
