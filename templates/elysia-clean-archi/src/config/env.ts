import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
    NODE_ENV: Type.Union(
        [Type.Literal("development"), Type.Literal("production"), Type.Literal("test")],
        { default: "development" },
    ),
    PORT: Type.Number({ default: 3000 }),
    CORS_ORIGIN: Type.String({ default: "*" }),
    DATABASE_URL: Type.String(),
    BETTER_AUTH_SECRET: Type.String(),
    BETTER_AUTH_URL: Type.String({ default: "http://localhost:3000" }),
    LOG_LEVEL: Type.Union(
        [
            Type.Literal("fatal"),
            Type.Literal("error"),
            Type.Literal("warn"),
            Type.Literal("info"),
            Type.Literal("debug"),
            Type.Literal("trace"),
        ],
        { default: "info" },
    ),
    INTERNAL_DOCS_USERNAME: Type.String({ default: "admin" }),
    INTERNAL_DOCS_PASSWORD: Type.String({ default: "admin" }),
});

export type Env = Static<typeof EnvSchema>;

function validateEnv(): Env {
    const rawEnv = {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        DATABASE_URL: process.env.DATABASE_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        LOG_LEVEL: process.env.LOG_LEVEL,
        INTERNAL_DOCS_USERNAME: process.env.INTERNAL_DOCS_USERNAME,
        INTERNAL_DOCS_PASSWORD: process.env.INTERNAL_DOCS_PASSWORD,
    };

    const envWithDefaults = Value.Default(EnvSchema, rawEnv);

    if (!Value.Check(EnvSchema, envWithDefaults)) {
        const errors = [...Value.Errors(EnvSchema, envWithDefaults)];

        console.error("❌ Environment validation failed:");
        console.error("");

        for (const error of errors) {
            const path = error.path.replace("/", "");
            console.error(`   ${path}: ${error.message}`);
        }

        console.error("");
        console.error("Please check your .env file and ensure all required variables are set.");
        process.exit(1);
    }

    return envWithDefaults as Env;
}

export const env = validateEnv();

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
