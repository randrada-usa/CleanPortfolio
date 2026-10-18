# Rey Jane Andrada — Portfolio

My personal portfolio as a backend-focused developer and aspiring data engineer, showcasing projects, technical contributions, certifications, and community experience.

The site includes project case studies covering the problems, implementation decisions, and outcomes behind my work—from student applications and organization platforms to commissioned games and hackathon prototypes.

## Highlights

- Project case studies with my role, technical approach, and results
- Certifications and participation in workshops, hackathons, and developer communities
- Core Stack with technology icons
- GitHub contributions cached during the browser session
- CV preview and PDF download
- Responsive layouts and reduced-motion support

## Built with

React Router 7 · React · TypeScript · Vite · Framer Motion · Sanity

## Run locally

Use Node.js 24.

```sh
npm ci
npm run dev
```

## Checks

```sh
npm test
npm run typecheck
npm run build
```

GitHub Actions runs these checks on pushes and pull requests.

## Content and assets

Projects and certifications use local content in `app/data/site.ts`, with optional Sanity integration. Public assets live in `public/assets`.

Selected certificate signatures are blurred in the published images. Projects subject to confidentiality or dataset restrictions include an availability note.

## Sanity setup

To connect Sanity:

1. Run `npm run sanity -- init` and create/select a project.
2. Copy `.env.example` to `.env.local`.
3. Add the project ID and dataset to both the app and Studio variables.
4. Run `npm run sanity -- start` to manage content.

The adapter in `app/lib/content.server.ts` automatically falls back to local content if Sanity is not configured or contains no documents.

## Performance assets

The homepage uses transparent WebP portrait variants at 480, 768, and 1024 px
(quality 85), generated from `public/assets/photos/427227d6-2a2a-4b17-9a69-a8baeed439f71.png`.
Project cards use 480, 800, and 1200 px WebP variants (quality 82); detail pages
reuse these on smaller screens and add 1600 and 1920 px variants for larger screens.
Experience hover previews use 400 and 800 px WebP variants (quality 82).
When replacing a local image, regenerate
its variants and keep the source mapping in `app/lib/images.ts` in sync. Unmapped
images, including CMS images, fall back to their supplied URL.

Manrope's Latin WOFF2 is hosted in `public/assets/fonts`, alongside its SIL Open
Font License. The hero is visible in the server-rendered HTML; certificate preview
images are requested only on desktop. Certificate and experience preview sets are
preloaded at low priority when their section comes within 400 px of the viewport.
Project cards preload the responsive detail image on pointer hover, keyboard focus,
or pointer down, alongside React Router's existing route prefetching. Speculative
image preloads are skipped on data-saver and 2G connections; visible images still load.
