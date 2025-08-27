import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlifyPlugin from "@netlify/vite-plugin-react-router";

export default defineConfig({
  plugins: [netlifyPlugin(), tailwindcss(), reactRouter({
serverBuildPath: "build/server/server.js"
}), tsconfigPaths()],
  server: {
    port: 4380
  }
});
