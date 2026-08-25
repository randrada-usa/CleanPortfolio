import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "eyebrow", title: "Card label", type: "string" }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "team", type: "string" }),
    defineField({ name: "timeline", type: "string" }),
    defineField({ name: "projectType", title: "Project type", type: "string" }),
    defineField({ name: "challenge", type: "text", rows: 4 }),
    defineField({ name: "approach", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "results", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "liveUrl", title: "Live URL", type: "url" }),
    defineField({ name: "githubUrl", title: "GitHub URL", type: "url" }),
  ],
  preview: { select: { title: "title", subtitle: "role", media: "image" } },
});
