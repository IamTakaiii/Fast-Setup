import { injectable } from "tsyringe";
import type { Example } from "@modules/example/example.entity";
import { pgDb } from "@data/postgres";

@injectable()
export class ExampleRepository {
    async findAll(): Promise<Example[]> {
        // Placeholder DB logic
        return [
            {
                id: "1",
                name: "Example Item",
                description: "This is a test item",
                createdAt: new Date(),
            },
        ];
    }

    async create(data: Omit<Example, "id" | "createdAt">): Promise<Example> {
        return {
            id: Math.random().toString(36).substring(7),
            ...data,
            createdAt: new Date(),
        };
    }
}
