import { container } from "@shared/di";
import { ExampleRepository } from "@modules/example/example.repository";
import { LoggerService } from "@shared/logger/logger.service";

// Register implementations
// Note: ExampleRepository is a class, so tsyringe can often resolve it automatically if it's injectable.
// But explicit registration or ensuring it's a singleton is good practice.
container.register(ExampleRepository, { useClass: ExampleRepository });
container.register("Logger", { useClass: LoggerService });
