import { describe, it, expect, vi } from "vitest";
import "reflect-metadata";
import { GetExampleUseCase } from "@modules/example/example.usecase";
import { ExampleRepository } from "@modules/example/example.repository";

describe("GetExampleUseCase", () => {
  it("should return a list of examples", async () => {
    // Mock the concrete repository class
    const mockRepo = {
      findAll: vi.fn().mockResolvedValue([{ id: "1", name: "Test" }]),
      create: vi.fn()
    } as unknown as ExampleRepository;
    
    const mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn()
    };

    const useCase = new GetExampleUseCase(mockRepo, mockLogger);
    const examples = await useCase.execute();

    expect(examples).toHaveLength(1);
    expect(examples[0].name).toBe("Test");
    expect(mockLogger.info).toHaveBeenCalled();
  });
});