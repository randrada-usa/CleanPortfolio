// Lets Node's test runner import app modules that use the "~/..." alias (resolved to app/*.ts).
import { register } from "node:module";

const hooks = `
const appRoot = ${JSON.stringify(new URL("../../app/", import.meta.url).href)};
export async function resolve(specifier, context, next) {
  if (specifier.startsWith("~/")) return next(appRoot + specifier.slice(2) + ".ts", context);
  return next(specifier, context);
}
`;

register(`data:text/javascript,${encodeURIComponent(hooks)}`);
