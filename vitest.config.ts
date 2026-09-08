import {defineConfig} from "vitest/config";
import path from "node:path";
import {fileURLToPath} from "node:url";

export default defineConfig({
  test: {environment: "node", exclude: ["tests/browser/**", "node_modules/**", ".next/**"]},
  resolve: {alias: {"@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src")}},
});
