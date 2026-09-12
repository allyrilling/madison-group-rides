# Manual to-dos (Netlify dashboard)

Site: https://legendary-cat-565b14.netlify.app
Repo: https://github.com/allyrilling/madison-group-rides

These three can't be done via CLI/API and need a few clicks in the Netlify dashboard.

## 1. Enable Netlify Identity + Git Gateway (needed for `/admin` to work)

1. Project configuration → **Identity** → Enable Identity
2. Set registration to **Invite only**
3. Same page → **Services** → **Git Gateway** → Enable Git Gateway
4. **Identity → Invite users** → enter your email (and anyone else who should edit content)
5. Check your inbox, set a password, then log in at `https://legendary-cat-565b14.netlify.app/admin`

## 2. Rename the site (optional)

Current auto-generated name is `legendary-cat-565b14`. To change the subdomain:

- **Project configuration → Domain management → Options → Edit site name**
- (Automated rename attempts via the API were silently ignored — this has to be done in the dashboard.)

## 3. Update `SITE_URL` once the final URL is settled

In `astro.config.mjs`, update the `SITE_URL` constant to match whatever domain you land on (the current `legendary-cat-565b14.netlify.app`, a renamed subdomain, or a custom domain). Used for the sitemap and social preview links. Redeploy after changing it (just commit + push).
