# Tech Stack

## Core
- **Astro 6** — static site generation, MDX support, zero JS by default
- **Preact 10** — lightweight UI for interactive islands (simulations only)
- **TypeScript** — strict mode, `jsxImportSource: preact`, path alias `@/*` → `src/*`
- **CSS custom properties** — theming (light/dark), no CSS-in-JS runtime
- **Mermaid.js 10** — diagram rendering from Markdown

## Integrations
- `@astrojs/mdx` — MDX support for embedding components in content
- `@astrojs/preact` (compat mode) — Preact islands
- `@astrojs/sitemap` — auto-generated sitemap

## Testing
- **Vitest** — test runner
- **fast-check** — property-based testing
- **@testing-library/preact** — component tests
- **happy-dom** — DOM environment for tests

## Build & Deploy
- GitHub Actions → GitHub Pages (auto-deploy on push to main)
- Vite excludes `*.test.ts` / `*.test.tsx` from the production bundle

## Common Commands

```bash
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build locally
npm run test       # run tests once (vitest --run)
npm run test:watch # run tests in watch mode
```
