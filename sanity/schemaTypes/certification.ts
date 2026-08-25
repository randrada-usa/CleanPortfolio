import { defineField, defineType } from "sanity";

const categories = ["Data & Analytics", "Artificial Intelligence", "Cloud & Development", "Software & Tools", "Hackathons & Events"];

export const certificationType = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "issuer", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "string", options: { list: categories }, validation: (rule) => rule.required() }),
    defineField({ name: "image", type: "image", validation: (rule) => rule.required() }),
    defineField({ name: "year", type: "string" }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "issuer", media: "image" } },
});
