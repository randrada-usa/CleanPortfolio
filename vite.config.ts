import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client", "react/jsx-runtime", "@radix-ui/react-dialog", "framer-motion", "lucide-react", "@sanity/client"],
  },
});
