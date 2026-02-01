import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "../../templates");

export async function info(templateName: string) {
	try {
		const templatePath = path.join(TEMPLATES_DIR, templateName);

		if (!await fs.pathExists(templatePath)) {
			console.log(pc.red(`
✖ Unknown template: ${pc.bold(templateName)}`));
			
			// Show available templates if the requested one isn't found
			if (await fs.pathExists(TEMPLATES_DIR)) {
				const files = await fs.readdir(TEMPLATES_DIR);
				const available = files.filter((f) => !f.startsWith("."));
				if (available.length > 0) {
					console.log(pc.yellow(`  Available templates: ${pc.cyan(available.join(", "))}
`));
				}
			}
			process.exit(1);
		}

		const metaPath = path.join(templatePath, "meta.json");
		let meta: any = { name: templateName };

		if (await fs.pathExists(metaPath)) {
			try {
				meta = await fs.readJson(metaPath);
			} catch (e) {
				// Ignore invalid json
			}
		}

        console.log("");
		console.log(pc.bold(pc.blue(`📘 Template Information: ${meta.name || templateName}`)));
        console.log(pc.dim("──────────────────────────────────────────────────"));
        
		if (meta.description) {
            console.log("");
			console.log(pc.white(meta.description));
		}
        console.log("");

		// Tech Stack Section
		if (meta.techStack) {
			console.log(pc.yellow(pc.bold("🛠  Tech Stack")));
			Object.entries(meta.techStack).forEach(([key, value]) => {
				console.log(`   • ${pc.bold(key)}: ${pc.dim(String(value))}`);
			});
            console.log("");
		}
		
		// Features Section
		if (meta.features && Array.isArray(meta.features) && meta.features.length > 0) {
			console.log(pc.green(pc.bold("✨ Key Features")));
			meta.features.forEach((feature: string) => {
				console.log(`   ${feature}`);
			});
            console.log("");
		}

        // Usage
        console.log(pc.magenta(pc.bold("🚀 Usage")));
        console.log(`   bun fast-setup gen ${templateName} <project-name>`);
        console.log("");

	} catch (error) {
		console.error(pc.red(`
✖ Error: ${error instanceof Error ? error.message : error}`));
	}
}
