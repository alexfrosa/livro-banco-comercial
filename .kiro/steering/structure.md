# Project Structure

```
/
├── .github/workflows/        # CI/CD — deploy.yml (build + publish to GitHub Pages)
├── content/
│   └── chapters/             # Book content — one folder per chapter
│       └── NN-slug/          # NN = zero-padded order (e.g. 01-o-que-e-um-banco)
│           ├── index.md      # Chapter metadata (frontmatter: title, order, description)
│           └── NN-slug.mdx   # Section files (frontmatter: title, order, description, simulation?, diagram?)
├── public/                   # Static assets (og-image.png, favicon, etc.)
├── src/
│   ├── components/           # Astro components (.astro)
│   │   └── simulations/      # Preact islands (.tsx) — only interactive simulations live here
│   ├── layouts/              # Page shells (BaseLayout.astro, ChapterLayout.astro)
│   ├── pages/                # Astro routes
│   │   ├── index.astro       # Landing page
│   │   └── [...slug].astro   # Dynamic chapter/section routes
│   ├── styles/               # global.css, themes.css (CSS custom properties)
│   ├── tests/                # Vitest test files (.test.ts / .test.tsx)
│   └── utils/                # Pure TypeScript utilities (no framework deps)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Key Conventions

### Content
- Chapter folders: `NN-kebab-slug/` (zero-padded number prefix drives sort order)
- `index.md` holds chapter-level metadata only — no body content
- Section files are `.mdx` to allow embedding Preact simulation/diagram components
- Frontmatter fields: `title` (required), `order` (required), `description`, `simulation`, `diagram`, `ogImage`

### Source Code
- Astro components for static/server-rendered UI; Preact only for interactive islands
- Utilities in `src/utils/` are plain TypeScript — no Astro or Preact imports
- localStorage access always wrapped in try/catch for private-browsing degradation
- CSS class naming: `kebab-case` with component prefix (e.g. `nav-`, `hero-`, `glossary-`)
- Comments in source files reference requirement IDs (e.g. `// Req 6.4`)

### Testing
- Test files live in `src/tests/`
- Property-based tests use `fast-check` — minimum 100 runs per property
- Unit tests cover: `ProgressTracker`, `ThemeManager`, `contentLoader`, `glossary`, `moneyCreation`
- Component tests use `@testing-library/preact` + `happy-dom`
- Preservation tests (`preservation.test.ts`) guard baseline behaviors that must not regress
