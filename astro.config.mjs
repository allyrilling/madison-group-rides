// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: once bikemadison.org is live, point this at the custom domain instead.
// It's used to generate the sitemap and canonical/OG URLs.
const SITE_URL = 'https://bikemadison.netlify.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
});
