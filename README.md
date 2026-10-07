# Stapled. renovation demo

A standalone concept website by [Stapled.](https://stapled.co.uk) for
renovation businesses, built one room at a time. Each room is built for a
**fictional brand** and labelled as a concept throughout. Enquiry buttons
never send anything to the fictional business. They explain the concept and
point to Stapled.'s real enquiry form.

| Route | Status |
| --- | --- |
| `/` | Forwards to `/bathroom/` |
| `/bathroom/` | FORM Bathrooms: hero, then six chapters (possibilities, materials, transformation, details, gallery, invitation) |
| Kitchen, Garden, Garage | Shown as "Coming soon" in the demo bar |

Proposed public address (GitHub Pages project site):
**https://matthewstapley.github.io/StapledRenovationDemo/bathroom/**

Built with Astro and GSAP (ScrollTrigger). Image sources and licences are in
[IMAGE-CREDITS.md](IMAGE-CREDITS.md).

## Local development

Requires Node 22.12 or newer.

```sh
npm install
npm run dev       # http://localhost:4321/StapledRenovationDemo/bathroom/
npm run build     # static output in dist/
npm run preview   # serve the build at http://localhost:4321/StapledRenovationDemo/bathroom/
```

The site is configured for the GitHub Pages sub-path `/StapledRenovationDemo/`
(`base` in `astro.config.mjs`). Internal links and files in `public/` must go
through `asset()` in `src/data/assets.ts`, never a bare `/path`.

## Images

`python3 scripts/fetch-images.py` downloads every image from its Unsplash
source at each responsive width (`public/images/<name>-<width>.webp`).
Components render them with `srcset`/`sizes`. The hero is preloaded and
eager; everything else is lazy-loaded.

## Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages, but only
when run manually. Pushing does not deploy. To publish:

1. In the repository on GitHub, open **Settings → Pages**, and under
   **Build and deployment → Source** choose **GitHub Actions**.
2. Open **Actions → Deploy to GitHub Pages → Run workflow** (branch `main`).

## Structure

- `src/pages/bathroom/index.astro`: composes the room's sections.
- `src/components/bathroom/*.astro`: one component per section (markup and styles).
- `src/scripts/bathroom/*.ts`: one motion module per section. `index.ts` creates them all, in page order, inside a single `gsap.matchMedia()`, so desktop, mobile and reduced-motion versions are each set up and torn down cleanly.
- `src/data/bathroom.ts`: copy, responsive image sets, alt text and photo credits.
- `src/styles/form.css`: FORM brand tokens and shared type and button styles.

All pages are `noindex`.
