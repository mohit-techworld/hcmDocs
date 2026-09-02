# HCM Documentation

Documentation site for the HCM / Human Maximizer platform, built with
[Docusaurus](https://docusaurus.io/).

## Requirements

- Node.js >= 18
- pnpm (the repo pins `pnpm@11.10.0` via `packageManager`)

## Install

```bash
pnpm install
```

## Local development

```bash
pnpm start
```

Starts a dev server with hot reload on <http://localhost:3000>.

### Search on the dev server

Search works under `pnpm start`, but the index has to exist first:

```bash
pnpm search:index     # builds once, drops the index where dev can serve it
pnpm start
```

The index is a snapshot — re-run `pnpm search:index` after adding or renaming
pages, or dev results will be stale. Production is unaffected: every
`pnpm build` regenerates the real index.

Two pieces make this work, and both are deliberate:

- `scripts/dev-search-index.cjs` copies `build/search-index.json` into
  `static/`, which the dev server serves. The copy is gitignored.
- `patches/@easyops-cn__docusaurus-search-local@0.51.1.patch` removes three
  `process.env.NODE_ENV === "production"` guards that made the plugin skip
  fetching the index and return `[]` from every dev search. Without the patch
  you get *"The search index is only available when you run docusaurus
  build!"* no matter what. pnpm reapplies it on install; if a plugin upgrade
  makes it stop applying, that is a loud error, and the fallback is
  `pnpm preview`.

To drop the patch entirely: delete the file, remove `patchedDependencies`
from `pnpm-workspace.yaml`, and use `pnpm preview` to test search.

## Build

```bash
pnpm build
```

Writes a static site to `build/`. The build **fails on broken links**
(`onBrokenLinks: "throw"`), which is deliberate — do not relax it to get a
build through.

Serve the production build locally:

```bash
pnpm serve
```

## Checks

```bash
node scripts/check-frontmatter.cjs --list   # every page needs title + description
node scripts/check-unused-assets.cjs        # nothing orphaned in static/
node scripts/build-brand-assets.cjs         # regenerate favicons + OG card
node scripts/build-sidebar-icons.cjs        # regenerate sidebar/navbar icon masks
```

Optional, needs a browser (`pnpm add -D puppeteer` first):

```bash
pnpm serve &
node scripts/verify-sidebar-icons.cjs http://localhost:3000
```

It asserts every sidebar and navbar icon actually paints. Static checks cannot
see a CSS mask defeated by another rule claiming the same `::before`.

CI runs the build and the two fast checks on every pull request
(`.github/workflows/docs.yml`).

## Layout

| Path | Contents |
| --- | --- |
| `docs/tenancy/` | Multi-tenant request contract — start here for API work |
| `docs/API/` | Endpoint reference, grouped by domain |
| `docs/modules/` | Functional module guides |
| `docs/ms1/` | MS1 control plane (server + admin client) |
| `docs/backend/`, `docs/frontend/` | Implementation guides |
| `src/components/Icon/` | The site's icon vocabulary (Lucide) |
| `scripts/` | Repo checks and asset generation |

## Conventions

- Every page carries `title` and `description` front matter.
- Icons come from `<Icon name="…" />`, never emoji. See
  `src/components/Icon/index.js` for the vocabulary.
- Status marks use `<Status yes />` / `<Status no />` so the state is carried
  by a word as well as a colour.
- Diagrams are Mermaid fenced blocks; quote any node label containing
  brackets or parentheses.
