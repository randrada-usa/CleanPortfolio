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

## CV

The Download CV control is intentionally disabled until the final PDF is supplied.
