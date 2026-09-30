@AGENTS.md

# aviv SDG Editorial — landing page

Landing page for **aviv SDG Editorial**, a Christian publishing house in Brasília. Single page, Brazilian Portuguese, statically exported and hosted on Amazon S3 + CloudFront at **https://aviveditorial.com.br**.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, statically exported (`output: "export"` in [next.config.ts](next.config.ts)) — there is no Node server in production, everything is pre-rendered HTML/CSS/JS.
- **Tailwind CSS v4**, configured via `@theme` in [src/app/globals.css](src/app/globals.css) rather than a `tailwind.config.js`. Brand colors (`maroon`, `graphite`) and font families are defined there as design tokens.
- **Embla Carousel** (`embla-carousel-react` + `embla-carousel-autoplay`) for the book catalog carousel, paired with a small hand-rolled lightbox component — no other UI/carousel library.
- **Google Analytics 4** (plain `gtag.js` via `next/script`, prod only — see [Google Analytics](#google-analytics)).
- No backend, no CMS, no database. Content is hardcoded in the components; contact happens exclusively through WhatsApp/email links (see [src/config/site.ts](src/config/site.ts)).
- Infrastructure as code with **Terraform** and a manual **PowerShell** prod deploy script, both in [devops/](devops/) (see [Production deploy (AWS)](#production-deploy-aws)).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint
```

## Project structure

```
src/app/                Routes, layout, metadata, SEO files (sitemap, robots, OG image)
src/components/         One component per landing-page section (Hero, Sobre, BookCarousel, ...)
src/components/brand/   The 3 brand SVG components (hero stamp, topbar + footer wordmarks)
src/config/             site.ts (contact info, nav links) and environment.ts (stage/prod)
src/assets/svg/         Brand SVGs imported directly by the components above
scripts/                Asset-processing scripts (see below)
assets-source/          Raw, unprocessed design exports — gitignored, never imported directly
devops/terraform/       AWS infrastructure for prod (S3 + CloudFront + ACM)
devops/deploy.ps1       Manual production deploy script
```

## Language

All user-facing copy is Brazilian Portuguese (`lang="pt-BR"` in the root layout). There is no i18n library or English version — this was an explicit requirement, not a placeholder.

## Asset pipeline

Design exports from the client's Illustrator file are large and not web-ready (12 catalog photos at 2-5MB each, an 8MB hero video). Raw files live in `assets-source/` (gitignored — never committed, never imported by app code directly) and get processed into `public/` before they're referenced anywhere.

### Catalog images + hero poster (rerunnable)

```bash
npm run optimize-images
```

Runs [scripts/optimize-images.mjs](scripts/optimize-images.mjs), which uses `sharp` to resize/convert everything in `assets-source/` to WebP:

- `carrossel-1.png` … `carrossel-12.png` → `public/images/carousel/carrossel-N-thumb.webp` (900px, for the carousel strip) and `-full.webp` (1800px, for the lightbox)
- `hero-poster-source.jpg` → `public/images/hero-poster.webp` (1600px)

**To update the catalog:** replace/add files in `assets-source/` following the `carrossel-N.png` naming (update `SLIDE_COUNT` in [BookCarousel.tsx](src/components/carousel/BookCarousel.tsx) if the count changes), then rerun the command above and commit the resulting `public/images/` output. `next/image`'s optimizer doesn't work with static export, so these pre-sized WebP files *are* the optimization — there's no server-side resizing at request time (`images.unoptimized: true` in `next.config.ts`).

When replacing a file in `public/` under the same name, bump `STATIC_ASSET_ID` in [src/config/environment.ts](src/config/environment.ts) so browsers fetch the new version (`withBasePath()` appends it as `?v=`).

### Hero video (manual, occasional)

Not scripted (it's a rare, one-off edit), but repeatable with `ffmpeg`:

```bash
# Re-encode + downscale, drop audio (video is muted/looping background only)
ffmpeg -i assets-source/homepage-video.mp4 -an -vf "scale=1600:-2" \
  -c:v libx264 -preset slow -crf 27 -profile:v high -movflags +faststart public/videos/hero.mp4

ffmpeg -i assets-source/homepage-video.mp4 -an -vf "scale=1600:-2" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 public/videos/hero.webm

# Extract a poster frame, then run it through optimize-images.mjs like any other source image
ffmpeg -y -ss 2 -i assets-source/homepage-video.mp4 -frames:v 1 -q:v 2 assets-source/hero-poster-source.jpg
```

This took the original ~8MB video down to ~1.6MB combined (mp4 + webm). [HeroBackground.tsx](src/components/HeroBackground.tsx) shows the poster image immediately (fast first paint) and swaps to the video after mount — and skips the video entirely if the visitor has `prefers-reduced-motion` on or their connection reports `saveData`/a slow `effectiveType`.

### Brand SVGs (no processing needed)

`aviv-stamp.svg`, `logo-lettering.svg`, `logo-completa.svg` in `src/assets/svg/` are imported directly (`import avivStamp from "@/assets/svg/aviv-stamp.svg"`) by the components in `src/components/brand/`. They started as live Illustrator text (which depended on a paid font we don't have web-license for, and briefly caused a rendering bug), and were re-exported with text converted to outlines — so they're now plain vector paths with no font dependency at all. **To update:** re-export from Illustrator with `Type > Create Outlines` applied before saving, drop the file in `src/assets/svg/`, done.

### Favicon (no processing needed)

`src/app/icon.png` (browser tab + Google Search result) and `src/app/apple-icon.png` (iOS home screen) are the same 144×144 PNG, picked up by Next.js's file convention — no import or metadata needed. Google Search only shows a favicon that is a **raster** image (no SVG), **square**, and ideally a multiple of 48px, which is why this isn't an SVG like the other brand assets. **To update:** replace both files with the new export (keep them square), done. Next.js adds a content hash to the icon URLs, so there's no need to bump `STATIC_ASSET_ID`.

## Fonts

The original design specifies three paid/commercial fonts we don't have web-embedding rights for (Myriad Pro, Adobe Garamond Pro, Bebas Neue Pro). We substitute close free equivalents via `next/font/google` (self-hosted at build time, no runtime request to Google) in [layout.tsx](src/app/layout.tsx):

| Design font | Free substitute | Used for |
|---|---|---|
| Myriad Pro | Source Sans 3 | body copy |
| Adobe Garamond Pro | EB Garamond | the "Soli Deo Gloria" quote/heading |
| Oswald | Oswald (already free) | section headings |
| Bebas Neue Pro | Bebas Neue | still loaded, though no longer strictly required now that the brand SVGs use outlined paths instead of live text (see above) |

## Hosting & environments

Static export only — there's no server in production, so anything requiring one (ISR, server actions, the default `next/image` loader, cookies, rewrites) is off the table by design.

Two environments, switched via `NEXT_PUBLIC_ENVIRONMENT` and defined in [src/config/environment.ts](src/config/environment.ts):

- **`stage`** — deployed to **GitHub Pages** on every push to `main` via [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml). Served from a subpath (`/aviv-landing-page`), so `next.config.ts` sets `basePath` accordingly and every static asset URL goes through the `withBasePath()` helper. Marked `noindex` (`allowIndexing: false`) and has no Google Analytics, since it's not the real site.
- **`prod`** — **https://aviveditorial.com.br** (apex, no `www`), root path, indexable, with Google Analytics. Hosted on a private S3 bucket behind CloudFront. `www.aviveditorial.com.br` serves the same site; the canonical URL (`siteUrl`, which also drives `og:url`, the sitemap and `<link rel="canonical">`) is the apex, so search engines treat that as the real one. Deployed manually with [devops/deploy.ps1](devops/deploy.ps1) — deliberately no pipeline.

## Google Analytics

[src/components/GoogleAnalytics.tsx](src/components/GoogleAnalytics.tsx) (rendered in the root layout) loads the GA4 tag (`gtag.js`) only when the current environment has a `gaMeasurementId` in [src/config/environment.ts](src/config/environment.ts). `stage` is always `null` (no tag at all, so test traffic doesn't pollute the data); `prod` is `null` until the real ID is set.

Besides page views (and GA's automatic Enhanced Measurement), it reports **contact clicks** as custom events. Any element with a `data-analytics-event` attribute is tracked by a single delegated click listener, so the tracked components stay server components:

| Event | Fired by | `section` parameter |
|---|---|---|
| `contact_whatsapp` | WhatsApp links | `contato`, `topbar`, `mobile-menu` |
| `contact_email` | `mailto:` link | `contato` |

To track another link, add `data-analytics-event="<event_name>"` and `data-analytics-section="<where>"` to it.

### Basic setup (one-time)

1. Go to [analytics.google.com](https://analytics.google.com) → **Admin** → **Create** → **Property**. Name it e.g. "aviv SDG Editorial", time zone **Brazil (GMT-03:00)**, currency **BRL**.
2. When asked for a data stream, choose **Web**, enter `https://aviveditorial.com.br`, and keep **Enhanced measurement** on.
3. Copy the stream's **Measurement ID** (`G-XXXXXXXXXX`) into `configs.prod.gaMeasurementId` in [src/config/environment.ts](src/config/environment.ts) (replacing the `TODO`). It isn't a secret — it's visible in the page HTML anyway — so it's committed.
4. Deploy (see below), open the site and check **Reports → Realtime**: your visit should show up within a minute. Click the WhatsApp/email links and the `contact_whatsapp` / `contact_email` events should appear there too.
5. **Admin → Data display → Events**: once each event has been received (can take up to 24h to be listed), toggle **Mark as key event** on `contact_whatsapp` and `contact_email`. They then show up as conversions in the reports.
6. Optional: **Admin → Data collection and modification → Data retention** → raise event data retention from 2 to 14 months, so year-over-year comparisons are possible.
7. Optional: to see the `section` parameter in standard reports, **Admin → Data display → Custom definitions → Create custom dimension**, scope **Event**, event parameter `section`.

For debugging, the [Google Tag Assistant](https://tagassistant.google.com) connects to the live site and shows events as they fire (**Admin → DebugView**).

## Production deploy (AWS)

Everything lives in [devops/](devops/):

- [devops/terraform/](devops/terraform/) — the AWS resources, all in `us-east-1` (CloudFront only accepts ACM certificates from there):
  - **S3 bucket** (`aviveditorial-com-br-site` by default), fully private — only the CloudFront distribution can read it (Origin Access Control + bucket policy).
  - **ACM certificate** for `aviveditorial.com.br` + `www.aviveditorial.com.br`, validated by DNS.
  - **CloudFront distribution** serving both hostnames: HTTP → HTTPS redirect, `index.html` as root object, missing paths → `/404.html`, managed `CachingOptimized` policy, compression, `PriceClass_All` (so Brazilian visitors hit South American edges).
- [devops/deploy.ps1](devops/deploy.ps1) — builds and uploads the site.

DNS stays at **Hostinger** (it also hosts other records, e.g. email), so the DNS records are added there by hand — Terraform can't manage them.

### Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) ≥ 1.5, the [AWS CLI](https://aws.amazon.com/cli/) v2, Node 20+, PowerShell.
- AWS credentials in the **default** credential chain (`aws configure` default profile, or `AWS_*` environment variables). Nothing in `devops/` picks a profile.

### State file — back it up

Terraform state is **local**: `devops/terraform/terraform.tfstate` (gitignored). It is the only record of which AWS resources belong to this stack, and the deploy script reads the bucket name and distribution ID from it. Losing it means re-importing every resource by hand, so keep a copy somewhere safe (password manager, private drive) after every `terraform apply`. Do commit `.terraform.lock.hcl` (pins the provider version).

### First-time setup

All commands run from `devops/terraform/`.

1. **Create the certificate only**:
   ```powershell
   terraform init
   terraform apply -target="aws_acm_certificate.site"
   terraform output acm_validation_records
   ```
2. **Validate it at Hostinger**: in hPanel → *Domains* → `aviveditorial.com.br` → *DNS / Nameservers*, add each record from `acm_validation_records` as a **CNAME**. Hostinger appends the domain automatically, so for the name use only the part before `.aviveditorial.com.br.` (e.g. `_abc123.www`), and for the target use the value without the trailing dot. Wait until the certificate shows **Issued** in the ACM console (`us-east-1`), usually a few minutes. Leave these records in place forever: ACM uses them to renew the certificate automatically.
3. **Create the rest**:
   ```powershell
   terraform apply
   terraform output cloudfront_domain   # e.g. d1234abcd.cloudfront.net
   ```
4. **Point the domain to CloudFront at Hostinger**:
   - Delete any existing `A` / `AAAA` records on `@` (Hostinger's default parking/hosting records) and disable Hostinger CDN if it's on.
   - Add a **CNAME** with name `@` → `<cloudfront_domain>`. At the root, Hostinger turns it into a flattened **ALIAS** record ("CNAME ALIAS"), which coexists with the MX/TXT records ([Hostinger docs](https://www.hostinger.com/support/10067986-how-to-manage-alias-records-at-hostinger/)).
   - Add (or replace) a **CNAME** with name `www` → `<cloudfront_domain>`.
5. **Deploy the site** (below) and check that `https://aviveditorial.com.br` and `https://www.aviveditorial.com.br` both load with a valid certificate.

Later infrastructure changes are just `terraform plan` / `terraform apply` from `devops/terraform/`.

### Deploying

From the repo root:

```powershell
./devops/deploy.ps1          # asks for confirmation before uploading
./devops/deploy.ps1 -Force   # no prompt
```

The script:

1. Checks that `aws`, `npm` and `terraform` are installed, and warns if git has uncommitted changes (they'd be deployed too).
2. Reads `bucket_name` and `distribution_id` from `terraform output`.
3. Runs `npm ci`, `npm run lint` and `npm run build` with `NEXT_PUBLIC_ENVIRONMENT=prod`.
4. Asks `Deploy to PRODUCTION? (y/N)`.
5. Uploads `./out` with `aws s3 sync --delete` in two passes: `_next/static/` (content-hashed file names) with `Cache-Control: public, max-age=31536000, immutable`, everything else with `public, max-age=300`. Then it re-uploads `opengraph-image` with `Content-Type: image/png` (see limitations below).
6. Invalidates `/*` on CloudFront, so the new version is live within a minute or two.

## Known limitations / follow-ups

- **Google Analytics Measurement ID not set yet** — `configs.prod.gaMeasurementId` is `null` (marked `TODO`) until the GA4 property is created; see [Basic setup](#basic-setup-one-time).
- **No cookie consent (LGPD)** — GA4 sets cookies (`_ga`, `_ga_*`) and collects usage data, and the site currently has no consent banner or privacy notice. Brazil's LGPD generally expects visitors to be informed and, ideally, to consent. The natural next step is a small pt-BR consent banner using Google Consent Mode v2 (GA loads in "denied" mode until the visitor accepts) plus a privacy policy page with text reviewed by the client.
- **OG image** — [src/app/opengraph-image.tsx](src/app/opengraph-image.tsx) is picked up automatically by Next.js (file convention, no import needed) and every page's `og:image` points to it, but its design is still a placeholder. The static export writes it as `out/opengraph-image` with no file extension, so the deploy script re-uploads it with `Content-Type: image/png` — otherwise some link-preview crawlers (WhatsApp) ignore it. If the OG image approach changes (e.g. a static `.png` in `public/`, or removing it), revisit that step of [devops/deploy.ps1](devops/deploy.ps1).
- **Apex and `www` both serve the site** (no redirect) — kept simple on purpose; the canonical tag points search engines to the apex. If a hard redirect `www` → apex is ever wanted, it needs a CloudFront Function.
- `CONTACT.instagramUrl` in `src/config/site.ts` is a placeholder pointing at the WhatsApp link until a real Instagram handle is provided.
- No CNPJ or privacy-policy page — footer intentionally matches the original design (copyright line only).
- No automated tests — correctness is covered by TypeScript + ESLint + manual verification in a browser.
