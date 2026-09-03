# Rey Jane Andrada — Portfolio v2

React Router 7 portfolio with local content fallbacks and Sanity-ready schemas.

## Local development

```sh
npm install
npm run dev
```

## Content

Projects and certifications currently load from `app/data/site.ts`, using assets in `public/assets`. To connect Sanity:

1. Run `npm run sanity -- init` and create/select a project.
2. Copy `.env.example` to `.env.local`.
3. Add the project ID and dataset to both the app and Studio variables.
4. Run `npm run sanity -- start` to manage content.

The adapter in `app/lib/content.server.ts` automatically falls back to local content if Sanity is not configured or contains no documents.

## Performance assets

The homepage uses transparent WebP portrait variants at 480, 768, and 1024 px
(quality 85), generated from `public/assets/photos/427227d6-2a2a-4b17-9a69-a8baeed439f71.png`.
Project cards use 480, 800, and 1200 px WebP variants (quality 82); detail pages
continue to use the original screenshots. When replacing a local image, regenerate
its variants and keep the source mapping in `app/lib/images.ts` in sync. Unmapped
images, including CMS images, fall back to their supplied URL.

Manrope's Latin WOFF2 is hosted in `public/assets/fonts`, alongside its SIL Open
Font License. The hero is visible in the server-rendered HTML; certificate preview
images are requested only on desktop, and lazily when they approach the viewport.

## CV

The Download CV control is intentionally disabled until the final PDF is supplied.
