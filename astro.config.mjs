// @ts-check
import { defineConfig } from 'astro/config';

// Hosted on GitHub Pages as a project site:
//   https://matthewstapley.github.io/StapledRenovationDemo/
// `base` makes Astro emit every bundled asset under that sub-path; links and
// public/ files go through asset() in src/data/assets.ts. The site root
// (src/pages/index.astro) forwards to the first room, /bathroom/.
// https://astro.build/config
export default defineConfig({
  site: 'https://matthewstapley.github.io',
  base: '/StapledRenovationDemo',
  trailingSlash: 'always',
});
