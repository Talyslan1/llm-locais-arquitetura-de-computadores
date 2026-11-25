import { defineConfig } from "astro/config";

const repository = "llm-locais-arquitetura-de-computadores";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  site: "https://talyslan1.github.io",
  base: isGitHubPages ? `/${repository}` : "/",
  output: "static",
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
