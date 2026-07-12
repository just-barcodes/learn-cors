# CORS, explained

An interactive, single-page guide to Cross-Origin Resource Sharing: what CORS is, why
it exists, and exactly how to fix the errors it produces.

Built with [Vite](https://vite.dev), [React 19](https://react.dev), and TypeScript. All
content lives in one typed data module (`src/data/cors.ts`); the interactive pieces (the
request-flow animation and the live header playground) are plain React components.

## Getting started

```bash
npm install
npm run dev        # start the dev server
```

## Scripts

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR             |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/`     |
| `npm run preview` | Preview the production build locally           |
| `npm run lint`    | Run ESLint                                      |

## Structure

```
src/
  data/cors.ts              # all content: nav, flow scenarios, headers, gotchas, links
  components/
    Sidebar.tsx             # section navigation (drives hash routing)
    sections/               # one component per section of the guide
      Hero, SameOrigin, WhyCsrf, BrowserVsCurl,
      SimpleVsPreflight, Options, RequestFlow (interactive),
      HeaderDocs, Playground (interactive), ServerSetup,
      Diagnose, Gotchas
  styles/
    tokens.css              # design tokens (colors, fonts, layout)
    ui.css                  # shared content primitives (cards, callouts, code, badges)
    global.css              # base styles
```

Navigation is hash-based, so each section is deep-linkable (e.g. `#playground`) and the
browser back button works.

## Attribution

Content and visual design are re-implemented from an original "CORS Explained" design
prototype. This repository is an independent, from-scratch React implementation of that
material.
