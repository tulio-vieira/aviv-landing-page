Landing page for **aviv SDG Editorial**, a Christian publishing house in Brasília. Single page, Brazilian Portuguese, statically exported for hosting on Amazon S3.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, statically exported (`output: "export"` in [next.config.ts](next.config.ts)) — there is no Node server in production, everything is pre-rendered HTML/CSS/JS.
- **Tailwind CSS v4**, configured via `@theme` in [src/app/globals.css](src/app/globals.css) rather than a `tailwind.config.js`. Brand colors (`maroon`, `graphite`) and font families are defined there as design tokens.
- **Embla Carousel** (`embla-carousel-react` + `embla-carousel-autoplay`) for the book catalog carousel, paired with a small hand-rolled lightbox component — no other UI/carousel library.
- No backend, no CMS, no database, no analytics. Content is hardcoded in the components; contact happens exclusively through WhatsApp/email links (see [src/config/site.ts](src/config/site.ts)).

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

- **`stage`** — deployed to **GitHub Pages** on every push to `main` via [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml). Served from a subpath (`/aviv-landing-page`), so `next.config.ts` sets `basePath` accordingly and every static asset URL goes through the `withBasePath()` helper. Marked `noindex` (`allowIndexing: false`) since it's not the real site.
- **`prod`** — the real domain, `avivsdg.com.br`, root path, indexable. Deployment target is **Amazon S3** (per the original requirement); there is no automated prod deploy pipeline yet — `npm run build` with `NEXT_PUBLIC_ENVIRONMENT` unset (defaults to `prod`) produces the `./out` folder to upload manually.

## Known limitations / follow-ups

- `CONTACT.instagramUrl` in `src/config/site.ts` is a placeholder pointing at the WhatsApp link until a real Instagram handle is provided.
- No CNPJ or privacy-policy page — footer intentionally matches the original design (copyright line only), since the site collects no data and has no analytics.
- No automated tests — correctness is covered by TypeScript + ESLint + manual verification in a browser.
