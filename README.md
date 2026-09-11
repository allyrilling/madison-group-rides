# Madison Group Rides

An independent catalog of group bicycle rides, clubs, and events around Madison, Wisconsin — recurring shop/club rides, one-time centuries and fondos, a filterable list view, and a map.

Built with [Astro](https://astro.build) (static site, no server to run or pay for) and [Decap CMS](https://decapcms.org) (a free, git-based content editor) so the catalog can be kept up to date from a web form instead of by editing code.

## Project structure

```
src/
  content/
    organizers/   # shops, clubs, teams — one .md file per organizer
    rides/        # recurring rides — one .md file per ride
    events/       # one-time / annual events — one .md file per event
  content.config.ts   # the schema (fields) for each collection above
  components/    # reusable Astro components (cards, filter bar, map, etc.)
  layouts/        # BaseLayout.astro — shared <head>, header, footer
  pages/          # routes: /, /rides/, /events/, /map/, /submit/, /about/
  scripts/        # vanilla TS for the client-side filter UI and the Leaflet map
public/
  admin/          # Decap CMS admin UI (config.yml defines the editing form)
research/         # raw research notes used to compile the initial ride data (not part of the site)
```

### How the data model works

Three content collections, defined in `src/content.config.ts`:

- **`organizers`** — a shop, club, or team. Referenced by rides/events, or you can skip this and just type a plain `organizerName` on the ride/event itself if the organizer doesn't need its own profile.
- **`rides`** — recurring/seasonal rides (a weekly shop ride, a club's Tuesday night ride, etc.)
- **`events`** — one-time or annual dated rides (a century, a charity fondo, etc.)

Every ride/event has an `active` flag. Uncheck it (rather than deleting the entry) for anything discontinued or canceled — it disappears from the public listings but stays in the repo for reference (see `ride-the-drive.md` for an example — the 2026 edition was canceled by the city, so it's kept but marked inactive). There's also a free-text `notes` field for anything unconfirmed; it shows up as a small caution flag on the ride's card and detail page.

## Local development

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # production build to ./dist
npm run preview   # serve the production build locally
```

## Adding or editing rides

**Option A — Decap CMS (recommended, no code required):** once deployed and set up (see below), go to `https://<your-site>/admin`, log in, and add/edit rides through a form. Saving creates a commit and Netlify redeploys automatically.

**Option B — edit the Markdown files directly** in `src/content/rides/`, `src/content/events/`, or `src/content/organizers/`, following the existing files as examples. Field names and types are enforced by `src/content.config.ts` — `npm run build` (or `npx astro check`) will tell you if a file doesn't match the schema.

## Deploying to Netlify

1. **Push this repo to GitHub** (or GitLab/Bitbucket).
2. **In Netlify:** "Add new site" → "Import an existing project" → pick this repo. Build settings are already defined in `netlify.toml` (`npm run build`, publishes `dist/`) — Netlify should detect them automatically.
3. **Update the site URL:** once you know your Netlify URL (or a custom domain), set it in `astro.config.mjs` (the `SITE_URL` constant near the top) and redeploy. This is used for the sitemap and social preview links.
4. **Turn on Netlify Identity** (Site configuration → Identity → Enable Identity). Under registration preference, set it to **Invite only** — this is what will gate who can log into `/admin`.
5. **Turn on Git Gateway** (Site configuration → Identity → Services → Git Gateway → Enable Git Gateway). This is what lets Decap CMS commit content changes on your behalf without every editor needing their own GitHub account.
6. **Invite yourself (and anyone else who should edit content):** Identity tab → Invite users → enter email addresses. Each invitee gets an email with a link that lets them set a password and log in at `/admin`.
7. Visit `https://<your-site>/admin`, log in, and you should see the Organizers / Recurring Rides / One-Time & Annual Events collections ready to edit.

All of the above is free on Netlify's standard free tier for a site of this size (Identity's free tier covers up to 5 active users, which should be plenty for a small team of editors).

### Submitted rides

The `/submit/` page uses [Netlify Forms](https://docs.netlify.com/forms/setup/) (also free up to 100 submissions/month) — no setup required beyond deploying; submissions show up under Forms in your Netlify dashboard. Review them there and add anything worth including via the CMS.

## Design notes

The visual style leans into Madison's isthmus-between-two-lakes geography (see `IsthmusMotif.astro`) with a lake-teal / capitol-limestone / cardinal-accent palette defined as CSS custom properties in `src/styles/global.css`. No CSS framework or UI library — plain CSS and a handful of small vanilla-TS scripts (`scripts/filter.ts`, `scripts/map.ts`) for the interactive bits, kept dependency-light on purpose.
