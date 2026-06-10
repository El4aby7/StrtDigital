import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset URLs relative so the build works whether it is served
// from a custom domain (strtdigital.site) or a GitHub Pages project subpath
// (https://<user>.github.io/StrtDigital/). Routing uses HashRouter so deep
// links and refreshes never 404 on static hosting.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
