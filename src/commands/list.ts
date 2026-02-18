import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import { TEMPLATES_DIR } from "../constants.js";

export async function list() {
	try {
		if (!await fs.pathExists(TEMPLATES_DIR)) {
			console.log(pc.yellow("No templates directory found."));
			return;
		}

		const files = await fs.readdir(TEMPLATES_DIR);
		const templates = files.filter((f) => !f.startsWith("."));

		if (templates.length === 0) {
			console.log(pc.yellow("No templates found."));
			return;
		}

		console.log(pc.bold(pc.blue("\n📦 Available Templates\n")));

		for (const template of templates) {
			const metaPath = path.join(TEMPLATES_DIR, template, "meta.json");
			let meta: any = {};
			
			if (await fs.pathExists(metaPath)) {
				try {
					meta = await fs.readJson(metaPath);
				} catch (e) {
					// Ignore invalid json
				}
			}

			// Template Header
			console.log(pc.cyan(`🔹 ${pc.bold(meta.name || template)}`));
			if (meta.description) {
				console.log(`   ${pc.italic(meta.description)}`);
			}
            console.log("");

			// Tech Stack Section
			if (meta.techStack) {
				console.log(pc.white(pc.bold("   🛠  Tech Stack:")));
				Object.entries(meta.techStack).forEach(([key, value]) => {
					console.log(`      ${pc.dim(key)}: ${value}`);
				});
                console.log("");
			}
			
			// Features Section
			if (meta.features && Array.isArray(meta.features) && meta.features.length > 0) {
				console.log(pc.white(pc.bold("   ✨ Key Features:")));
				meta.features.forEach((feature: string) => {
					console.log(pc.dim(`      ${feature}`));
				});
			}

            // Separator
			console.log(pc.dim("\n   ──────────────────────────────────────────────────\n"));
		}

	} catch (error) {
		console.error(pc.red(`\n✖ Error: ${error instanceof Error ? error.message : error}`));
	}
}