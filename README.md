# camielvanderbeek.com Site

Static rebuild of your portfolio site, ready for GitHub Pages.

## Publish to GitHub Pages on `camielvanderbeek.com`

1. Create a GitHub repo (for example: `thekindest-site`).
2. Put all files from this folder in the repo root.
3. Add these two files in the repo root:
   - `CNAME` with content: `camielvanderbeek.com`
   - `.nojekyll` (empty file)
4. Push to `main`.
5. In GitHub repo settings: **Pages** -> **Source**: `Deploy from branch` -> `main` + `/ (root)`.
6. At your DNS provider, set:
   - `A` records for `camielvanderbeek.com` to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Optional `CNAME` for `www` -> `<your-github-username>.github.io`
7. Wait for GitHub Pages SSL to finish provisioning, then enforce HTTPS in Pages settings.

## Local preview

Open `index.html` in a browser.
