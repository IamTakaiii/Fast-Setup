#!/usr/bin/env bun

import { existsSync, rmSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const moduleName = process.argv[2];
const force = process.argv.includes("--force") || process.argv.includes("-f");

if (!moduleName) {
    console.error("❌ Please provide a module name");
    console.log("Usage: bun run remove:module <module-name> [--force]");
    process.exit(1);
}

// Convert to kebab-case and PascalCase
const kebabCase = moduleName.toLowerCase().replace(/\s+/g, "-");
const pascalCase = kebabCase
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const modulePath = join(process.cwd(), "src", "modules", kebabCase);

// Check if module exists
if (!existsSync(modulePath)) {
    console.error(`❌ Module "${kebabCase}" does not exist`);
    process.exit(1);
}

// Confirm deletion
if (!force) {
    console.log(`⚠️  You are about to delete module "${kebabCase}"`);
    console.log(`   Path: ${modulePath}`);
    console.log("");
    console.log("   This will:");
    console.log("   - Delete all module files");
    console.log("   - Remove DI container registration");
    console.log("");
    console.log("   Use --force flag to skip this confirmation");
    console.log("");

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
        readline.question("   Are you sure? (yes/no): ", resolve);
    });

    readline.close();

    if (answer.toLowerCase() !== "yes" && answer.toLowerCase() !== "y") {
        console.log("❌ Deletion cancelled");
        process.exit(0);
    }
}

// Remove module directory
try {
    rmSync(modulePath, { recursive: true, force: true });
    console.log(`✅ Deleted module directory: ${modulePath}`);
} catch (error) {
    console.error(`❌ Failed to delete module directory: ${error}`);
    process.exit(1);
}

// Auto-unregister from DI container
const diContainerPath = join(process.cwd(), "src", "config", "di-container.ts");
let diContent = readFileSync(diContainerPath, "utf-8");

const importPattern = new RegExp(
    `import\\s+{[^}]*${pascalCase}Repository[^}]*}\\s+from\\s+["']@modules/${kebabCase}/${kebabCase}\\.repository["'];?\\n?`,
    "g",
);
const registerPattern = new RegExp(
    `container\\.register\\(${pascalCase}Repository,\\s*{[^}]*}\\);?\\n?`,
    "g",
);

const hadImport = importPattern.test(diContent);
const hadRegister = registerPattern.test(diContent);

if (hadImport || hadRegister) {
    diContent = diContent.replace(importPattern, "");
    diContent = diContent.replace(registerPattern, "");

    // Clean up extra blank lines
    diContent = diContent.replace(/\n{3,}/g, "\n\n");

    writeFileSync(diContainerPath, diContent);
    console.log(`✅ Unregistered ${pascalCase}Repository from DI container`);
}

// Auto-unregister routes from v1 index
const v1IndexPath = join(process.cwd(), "src", "api", "v1", "index.ts");
let v1Content = readFileSync(v1IndexPath, "utf-8");

const routeImportPattern = new RegExp(
    `import\\s+{\\s*${kebabCase}Routes\\s*}\\s+from\\s+["']@modules/${kebabCase}/${kebabCase}\\.controller["'];?\\n?`,
    "g",
);
const routeUsePattern = new RegExp(`\\.use\\(${kebabCase}Routes\\)`, "g");

const hadRouteImport = routeImportPattern.test(v1Content);
const hadRouteUse = routeUsePattern.test(v1Content);

if (hadRouteImport || hadRouteUse) {
    v1Content = v1Content.replace(routeImportPattern, "");
    v1Content = v1Content.replace(routeUsePattern, "");

    // Clean up extra blank lines
    v1Content = v1Content.replace(/\n{3,}/g, "\n\n");

    writeFileSync(v1IndexPath, v1Content);
    console.log(`✅ Unregistered ${kebabCase}Routes from v1 routes`);
}

console.log(`
✨ Module "${kebabCase}" removed successfully!

📝 Module cleanup complete!
`);
