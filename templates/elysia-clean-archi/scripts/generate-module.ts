#!/usr/bin/env bun

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

const moduleName = process.argv[2];

if (!moduleName) {
    console.error("❌ Please provide a module name");
    console.log("Usage: bun run generate:module <module-name>");
    process.exit(1);
}

// Convert to kebab-case and PascalCase
const kebabCase = moduleName.toLowerCase().replace(/\s+/g, "-");
const pascalCase = kebabCase
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const modulePath = join(process.cwd(), "src", "modules", kebabCase);

// Check if module already exists
if (existsSync(modulePath)) {
    console.error(`❌ Module "${kebabCase}" already exists`);
    process.exit(1);
}

// Create module directory
mkdirSync(modulePath, { recursive: true });

// Generate files
const files = {
    // Entity
    [`${kebabCase}.entity.ts`]: `import { t } from "elysia";
import { Static } from "@sinclair/typebox";

export const ${pascalCase}Schema = t.Object({
    id: t.String(),
    name: t.String(),
    createdAt: t.Date(),
});

export type ${pascalCase} = Static<typeof ${pascalCase}Schema>;
`,

    // Repository
    [`${kebabCase}.repository.ts`]: `import { injectable } from "tsyringe";
import type { ${pascalCase} } from "@modules/${kebabCase}/${kebabCase}.entity";
import { pgDb } from "@data/postgres";

@injectable()
export class ${pascalCase}Repository {
    async findAll(): Promise<${pascalCase}[]> {
        // TODO: Implement database query
        return [];
    }

    async findById(id: string): Promise<${pascalCase} | null> {
        // TODO: Implement database query
        return null;
    }

    async create(data: Omit<${pascalCase}, "id" | "createdAt">): Promise<${pascalCase}> {
        // TODO: Implement database query
        throw new Error("Not implemented");
    }

    async update(id: string, data: Partial<${pascalCase}>): Promise<${pascalCase}> {
        // TODO: Implement database query
        throw new Error("Not implemented");
    }

    async delete(id: string): Promise<void> {
        // TODO: Implement database query
    }
}
`,

    // Use Case
    [`${kebabCase}.usecase.ts`]: `import { inject, injectable } from "tsyringe";
import { ${pascalCase}Repository } from "@modules/${kebabCase}/${kebabCase}.repository";
import type { ILogger } from "@shared/logger/logger.port";

@injectable()
export class Get${pascalCase}UseCase {
    constructor(
        private repository: ${pascalCase}Repository,
        @inject("Logger") private logger: ILogger,
    ) {}

    async execute() {
        this.logger.info("Fetching ${kebabCase}");
        return this.repository.findAll();
    }
}

@injectable()
export class Create${pascalCase}UseCase {
    constructor(
        private repository: ${pascalCase}Repository,
        @inject("Logger") private logger: ILogger,
    ) {}

    async execute(data: { name: string }) {
        this.logger.info("Creating ${kebabCase}");
        return this.repository.create(data);
    }
}
`,

    // Docs
    [`${kebabCase}.docs.ts`]: `import { ${pascalCase}Schema } from "@modules/${kebabCase}/${kebabCase}.entity";
import { createApiResponseArraySchema } from "@shared/response/response.schema";

export const ${kebabCase}Docs = {
    getAll: {
        detail: {
            tags: ["${pascalCase}"],
            summary: "Get all ${kebabCase}",
            description: "Retrieve a list of all ${kebabCase} entities",
        },
        response: createApiResponseArraySchema(${pascalCase}Schema),
    },
};
`,

    // Controller
    [`${kebabCase}.controller.ts`]: `import { Elysia } from "elysia";
import { container } from "@shared/di";
import { Get${pascalCase}UseCase } from "@modules/${kebabCase}/${kebabCase}.usecase";
import { ApiResponse } from "@shared/response/response.util";
import { i18nMiddleware } from "@shared/i18n/i18n.middleware";
import { authMiddleware } from "@shared/auth/auth.middleware";
import { ${kebabCase}Docs } from "@modules/${kebabCase}/${kebabCase}.docs";

export const ${kebabCase}Routes = new Elysia({ prefix: "/${kebabCase}" })
    .use(i18nMiddleware)
    .use(authMiddleware)
    .get(
        "/",
        async ({ lng }) => {
            const useCase = container.resolve(Get${pascalCase}UseCase);
            const data = await useCase.execute();
            return ApiResponse.success(data, "success", lng);
        },
        ${kebabCase}Docs.getAll,
    );
`,
};

// Write files
for (const [filename, content] of Object.entries(files)) {
    const filePath = join(modulePath, filename);
    writeFileSync(filePath, content);
    console.log(`✅ Created ${filename}`);
}

// Auto-register in DI container
const diContainerPath = join(process.cwd(), "src", "config", "di-container.ts");
const diContent = readFileSync(diContainerPath, "utf-8");

const importStatement = `import { ${pascalCase}Repository } from "@modules/${kebabCase}/${kebabCase}.repository";`;
const registerStatement = `container.register(${pascalCase}Repository, { useClass: ${pascalCase}Repository });`;

// Check if already registered
if (!diContent.includes(importStatement)) {
    // Add import after the last import
    const lastImportIndex = diContent.lastIndexOf("import");
    const nextLineIndex = diContent.indexOf("\n", lastImportIndex);
    const newContent =
        diContent.slice(0, nextLineIndex + 1) +
        importStatement +
        "\n" +
        diContent.slice(nextLineIndex + 1);

    // Add registration before the last line
    const lines = newContent.split("\n");
    const lastNonEmptyIndex = lines.findLastIndex((line) => line.trim() !== "");
    lines.splice(lastNonEmptyIndex, 0, registerStatement);

    writeFileSync(diContainerPath, lines.join("\n"));
    console.log(`✅ Registered ${pascalCase}Repository in DI container`);
}

// Auto-register routes in v1 index
const v1IndexPath = join(process.cwd(), "src", "api", "v1", "index.ts");
let v1Content = readFileSync(v1IndexPath, "utf-8");

const routeImport = `import { ${kebabCase}Routes } from "@modules/${kebabCase}/${kebabCase}.controller";`;
const routeUse = `.use(${kebabCase}Routes)`;

if (!v1Content.includes(routeImport)) {
    // Add import after the last import
    const lastImportIndex = v1Content.lastIndexOf("import");
    const nextLineIndex = v1Content.indexOf("\n", lastImportIndex);
    v1Content =
        v1Content.slice(0, nextLineIndex + 1) +
        routeImport +
        "\n" +
        v1Content.slice(nextLineIndex + 1);

    // Add .use() before the semicolon at the end of v1Routes chain
    v1Content = v1Content.replace(
        /(export const v1Routes = new Elysia\([^)]*\)(?:\.use\([^)]+\))*)(;)/,
        `$1${routeUse}$2`,
    );

    writeFileSync(v1IndexPath, v1Content);
    console.log(`✅ Registered ${kebabCase}Routes in v1 routes`);
}

// Instructions
console.log(`
✨ Module "${kebabCase}" created successfully!

📁 Files created:
   - ${kebabCase}.entity.ts
   - ${kebabCase}.repository.ts
   - ${kebabCase}.usecase.ts
   - ${kebabCase}.docs.ts
   - ${kebabCase}.controller.ts

📝 Next steps:
   1. Implement database queries in ${kebabCase}.repository.ts
   2. Add business logic in ${kebabCase}.usecase.ts
   3. Customize API documentation in ${kebabCase}.docs.ts
`);
