import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("cv", "routes/cv.tsx"),
  route("projects", "routes/projects.tsx"),
  route("projects/:slug", "routes/project-detail.tsx"),
  route("certifications", "routes/certifications.tsx"),
  route("certifications/:slug", "routes/certification-detail.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
