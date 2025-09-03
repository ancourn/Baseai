import { CopilotEngine } from "../../src/lib/ai-copilot/core/CopilotEngine";
import { CopilotConfig } from "../../src/lib/ai-copilot/core/types";

describe("CopilotEngine", () => {
  let copilotEngine: CopilotEngine;
  let mockConfig: CopilotConfig;

  beforeEach(() => {
    mockConfig = {
      aiProvider: "local",
      model: "gpt-3.5-turbo",
      maxTokens: 2000,
      temperature: 0.7,
      contextWindow: 4000,
    };
    copilotEngine = new CopilotEngine(mockConfig);
  });

  describe("generateCode", () => {
    it("should generate code successfully", async () => {
      const request = {
        prompt: "Create a simple function that adds two numbers",
        language: "typescript",
        options: {
          includeTests: true,
          includeComments: true,
        },
      };

      const result = await copilotEngine.generateCode(request);

      expect(result).toBeDefined();
      expect(result.code).toBeDefined();
      expect(typeof result.code).toBe("string");
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it("should handle empty prompt", async () => {
      const request = {
        prompt: "",
        language: "typescript",
      };

      await expect(copilotEngine.generateCode(request)).rejects.toThrow();
    });

    it("should handle unsupported language", async () => {
      const request = {
        prompt: "Create a function",
        language: "unsupported-language",
      };

      // Should not throw but handle gracefully
      const result = await copilotEngine.generateCode(request);
      expect(result).toBeDefined();
    });

    it("should include framework in generation when specified", async () => {
      const request = {
        prompt: "Create a component",
        language: "typescript",
        framework: "react",
      };

      const result = await copilotEngine.generateCode(request);
      expect(result).toBeDefined();
      // The generated code should be React-related
      expect(result.code.toLowerCase()).toContain("react");
    });
  });

  describe("analyzeCode", () => {
    it("should analyze code successfully", async () => {
      const code = \`
        function add(a: number, b: number): number {
          return a + b;
        }
      \`;

      const result = await copilotEngine.analyzeCode(code, "typescript");

      expect(result).toBeDefined();
      expect(result.dependencies).toBeDefined();
      expect(result.exports).toBeDefined();
      expect(result.imports).toBeDefined();
      expect(result.complexity).toBeGreaterThan(0);
    });

    it("should handle empty code", async () => {
      const code = "";

      const result = await copilotEngine.analyzeCode(code, "typescript");
      expect(result).toBeDefined();
      expect(result.complexity).toBe(0);
    });

    it("should detect patterns in code", async () => {
      const code = \`
        class TestClass {
          private value: number;
          
          constructor(value: number) {
            this.value = value;
          }
          
          getValue(): number {
            return this.value;
          }
        }
      \`;

      const result = await copilotEngine.analyzeCode(code, "typescript");
      expect(result.patterns).toBeDefined();
      expect(result.patterns.length).toBeGreaterThan(0);
      
      const classPattern = result.patterns.find(p => p.type === "class");
      expect(classPattern).toBeDefined();
    });
  });

  describe("getProjectContext", () => {
    it("should get project context", async () => {
      const projectPath = "/test/project";

      const result = await copilotEngine.getProjectContext(projectPath);

      expect(result).toBeDefined();
      expect(result.language).toBeDefined();
      expect(result.dependencies).toBeDefined();
      expect(result.structure).toBeDefined();
    });
  });
});
