import { inject, injectable } from "tsyringe";
import { ExampleRepository } from "@modules/example/example.repository";
import type { ILogger } from "@shared/logger/logger.port";

@injectable()
export class GetExampleUseCase {
    constructor(
        @inject(ExampleRepository) private repository: ExampleRepository,
        @inject("Logger") private logger: ILogger,
    ) {}

    async execute() {
        this.logger.info("Executing GetExampleUseCase");
        return this.repository.findAll();
    }
}
