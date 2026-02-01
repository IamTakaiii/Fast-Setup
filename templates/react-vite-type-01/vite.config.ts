import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { normalizePath, PluginOption } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { inspectorServer } from '@react-dev-inspector/vite-plugin'


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		inspectorServer() as PluginOption,
		react({
			babel: {
				plugins: ["@react-dev-inspector/babel-plugin"],
			},
		}),
		tailwindcss(),
		TanStackRouterVite(),
		viteStaticCopy({
			targets: [
				{
					src: normalizePath(path.resolve("./src/assets/locales")),
					dest: normalizePath(path.resolve("./dist")),
				},
			],
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve("./src"),
		},
	},
	server: {
		host: true,
		strictPort: true,
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		css: true,
	},
});
