import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "reyPortfolio",
  title: "Rey Portfolio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "replace-me",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
