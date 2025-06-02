/**
 * Build script for bundling the application using esbuild.
 *
 * This script bundles the application entry point (`src/mod.ts`) into a single
 * JavaScript file (`dist/index.js`) optimized for Node.js 22. It includes features
 * like minification, tree-shaking, and external dependency exclusion.
 *
 * @example
 * // Run the script to build the application:
 * deno run --allow-read --allow-write build/build.ts
 *
 * @throws {Error} If the build process encounters an issue.
 */
import * as esbuild from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";

if (import.meta.main) {
  const outputFile = "dist/index.js";
  await esbuild.build({
    plugins: denoPlugins({ loader: "native" }),
    entryPoints: ["src/mod.ts"],
    outfile: outputFile,
    bundle: true,
    platform: "node",
    target: "node22",
    minify: true,
    sourcemap: false,
    treeShaking: true,
    external: ["debug"],
  });
  await esbuild.stop();
}
