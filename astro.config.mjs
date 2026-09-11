// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: once deployed, set this to your real Netlify URL (or custom domain).
// It's used to generate the sitemap and canonical/OG URLs.
const SITE_URL = 'https://madison-group-rides.netlify.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
});
