import "reflect-metadata";
import { container } from "tsyringe";

// Register generic dependencies here if needed
// container.register("SomeService", { useClass: SomeImplementation });

export { container, injectable, inject, singleton } from "tsyringe";
