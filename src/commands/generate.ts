import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import prompts from "prompts";
import { TEMPLATES_DIR } from "../constants.js";

/**
 * Main command handler for project generation
 */
export async function generate(templateName: string, projectName?: string) {
	try {
		// 1. Template Validation
		const templatePath = await validateTemplate(templateName);

		// 2. Project Name Resolution
		const resolvedName = await resolveProjectName(projectName);
		const targetDir = path.resolve(process.cwd(), resolvedName);

		// 3. Target Directory Validation
		await validateTargetDir(targetDir, resolvedName);

		// 4. Project Generation
		await executeGeneration(templatePath, targetDir, resolvedName);

		// 5. Final Success Message
		displaySuccessMessage(resolvedName);
	} catch (error) {
		handleError(error);
	}
}

/**
 * Validates if the template exists and lists alternatives if not
 */
async function validateTemplate(template: string): Promise<string> {
	const templatePath = path.join(TEMPLATES_DIR, template);

	if (await fs.pathExists(templatePath)) {
		const metaPath = path.join(templatePath, "meta.json");
		if (await fs.pathExists(metaPath)) {
			try {
				const meta = await fs.readJson(metaPath);
				console.log(pc.cyan(`\nℹ Selected Template: ${pc.bold(meta.name || template)}`));
				if (meta.description) console.log(pc.dim(`  ${meta.description}`));
				if (meta.features && Array.isArray(meta.features)) {
					console.log(pc.dim("  Features:"));
					meta.features.forEach((f: string) => console.log(pc.dim(`   - ${f}`)));
				}
				console.log(""); // Empty line for spacing
			} catch (e) {
				// Ignore error if meta.json is invalid
			}
		}
		return templatePath;
	}

	console.log(pc.red(`\n✖ Unknown template: ${pc.bold(template)}`));

	if (await fs.pathExists(TEMPLATES_DIR)) {
		const files = await fs.readdir(TEMPLATES_DIR);
		const available = files.filter((f) => !f.startsWith("."));

		if (available.length > 0) {
			console.log(pc.yellow(`  Available templates:`));
			for (const t of available) {
				let desc = "";
				try {
					const m = await fs.readJson(path.join(TEMPLATES_DIR, t, "meta.json"));
					if (m.description) desc = ` - ${m.description}`;
				} catch {}
				console.log(pc.cyan(`    ${t}${pc.dim(desc)}`));
			}
			console.log("");
		}
	}

	process.exit(1);
}

/**
 * Resolves project name via argument or interactive prompt
 */
async function resolveProjectName(name?: string): Promise<string> {
	if (name) return name;

	const response = await prompts({
		type: "text",
		name: "projectName",
		message: "What is your project name?",
		initial: "my-app",
		validate: (value) => (value.length > 0 ? true : "Project name is required"),
	});

	if (!response.projectName) {
		console.log(pc.yellow("\nOperation cancelled."));
		process.exit(0);
	}

	return response.projectName;
}

/**
 * Ensures the target directory doesn't already exist
 */
async function validateTargetDir(dir: string, name: string) {
	if (await fs.pathExists(dir)) {
		console.log(pc.red(`\n✖ Directory ${pc.bold(name)} already exists.`));
		console.log(pc.yellow("  Please choose a different name or remove the existing directory.\n"));
		process.exit(1);
	}
}

/**
 * Handles the actual file copying and configuration updates
 */
async function executeGeneration(src: string, dest: string, name: string) {
	console.log(pc.blue(`\n🚀 Generating project ${pc.cyan(name)}...`));

	// Copy template files
	await fs.copy(src, dest);

	// Update package.json
	const pkgPath = path.join(dest, "package.json");
	if (await fs.pathExists(pkgPath)) {
		const pkg = await fs.readJson(pkgPath);
		pkg.name = name;
		await fs.writeJson(pkgPath, pkg, { spaces: 2 });
	}
}

/**
 * Displays the final success banner and next steps
 */
function displaySuccessMessage(name: string) {
	console.log(pc.green(`\n✔ Project ${pc.bold(name)} created successfully!`));
	
	console.log(pc.dim("\n-------------------------------------------"));
	console.log(pc.bold("Next steps:"));
	console.log(`  1. ${pc.cyan(`cd ${name}`)}`);
	console.log(`  2. ${pc.cyan("bun install")}`);
	console.log(`  3. ${pc.cyan("bun dev")}`);
	console.log(pc.dim("-------------------------------------------\n"));
}

/**
 * Global error handler
 */
function handleError(error: unknown) {
	const message = error instanceof Error ? error.message : String(error);
	console.error(pc.red(`\n✖ Critical Error: ${message}`));
	process.exit(1);
}