import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  await prisma.codeGeneration.deleteMany();
  await prisma.codeAnalysis.deleteMany();
  await prisma.codeTemplate.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
});

// Global test utilities
global.testUtils = {
  createTestUser: async (userData = {}) => {
    return prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
        ...userData,
      },
    });
  },

  createTestTemplate: async (templateData = {}) => {
    return prisma.codeTemplate.create({
      data: {
        name: "Test Template",
        description: "Test template description",
        language: "typescript",
        pattern: "test",
        template: "console.log(\"Hello, {{name}}!\");",
        variables: JSON.stringify([
          {
            name: "name",
            type: "string",
            description: "Name to greet",
            required: true,
          },
        ]),
        examples: JSON.stringify([
          {
            description: "Basic example",
            variables: { name: "World" },
            output: "console.log(\"Hello, World!\");",
          },
        ]),
        ...templateData,
      },
    });
  },

  createTestGeneration: async (generationData = {}) => {
    return prisma.codeGeneration.create({
      data: {
        prompt: "Test prompt",
        language: "typescript",
        generatedCode: "console.log(\"test\");",
        confidence: 0.8,
        ...generationData,
      },
    });
  },
};
