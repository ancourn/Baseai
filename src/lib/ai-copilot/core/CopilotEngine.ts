import { CopilotConfig, CodeGenerationRequest, GeneratedCode, CodeContext } from './types';
import { CodeAnalyzer } from '../analyzers/CodeAnalyzer';
import { CodeGenerator } from '../generators/CodeGenerator';
import { ContextManager } from '../context/ContextManager';
import { TemplateEngine } from '../templates/TemplateEngine';

export class CopilotEngine {
  private config: CopilotConfig;
  private analyzer: CodeAnalyzer;
  private generator: CodeGenerator;
  private contextManager: ContextManager;
  private templateEngine: TemplateEngine;

  constructor(config: CopilotConfig) {
    this.config = config;
    this.analyzer = new CodeAnalyzer();
    this.generator = new CodeGenerator(config);
    this.contextManager = new ContextManager();
    this.templateEngine = new TemplateEngine();
  }

  async generateCode(request: CodeGenerationRequest): Promise<GeneratedCode> {
    try {
      // 1. Analyze context
      const enhancedContext = await this.enhanceContext(request.context);
      
      // 2. Check templates first
      const templateResult = await this.templateEngine.match(request);
      if (templateResult && templateResult.confidence > 0.8) {
        return this.enhanceTemplate(templateResult, request);
      }
      
      // 3. Use AI generation
      const aiRequest = this.buildAIRequest(request, enhancedContext);
      return await this.generator.generate(aiRequest);
    } catch (error) {
      console.error('Code generation failed:', error);
      throw new Error(`Failed to generate code: ${error.message}`);
    }
  }

  async analyzeCode(code: string, language: string, filePath?: string): Promise<any> {
    try {
      return await this.analyzer.analyzeFile({
        path: filePath || 'temp',
        content: code,
        language,
        size: code.length,
        lastModified: new Date()
      });
    } catch (error) {
      console.error('Code analysis failed:', error);
      throw new Error(`Failed to analyze code: ${error.message}`);
    }
  }

  async getProjectContext(projectPath: string): Promise<any> {
    try {
      return await this.contextManager.getProjectContext(projectPath);
    } catch (error) {
      console.error('Failed to get project context:', error);
      throw new Error(`Failed to get project context: ${error.message}`);
    }
  }

  private async enhanceContext(context?: CodeContext): Promise<CodeContext> {
    return this.contextManager.enrich(context);
  }

  private buildAIRequest(request: CodeGenerationRequest, context: CodeContext): any {
    return {
      prompt: this.buildPrompt(request, context),
      system: this.buildSystemPrompt(request.language, request.framework),
      options: request.options
    };
  }

  private buildPrompt(request: CodeGenerationRequest, context: CodeContext): string {
    let prompt = request.prompt;
    
    if (context.currentFile) {
      prompt += `\n\nCurrent file: ${context.currentFile}`;
    }
    
    if (context.surroundingCode) {
      prompt += `\n\nSurrounding code:\n${context.surroundingCode}`;
    }
    
    if (context.projectStructure) {
      prompt += `\n\nProject structure: ${JSON.stringify(context.projectStructure, null, 2)}`;
    }
    
    return prompt;
  }

  private buildSystemPrompt(language: string, framework?: string): string {
    let systemPrompt = `You are an expert ${language} developer`;
    
    if (framework) {
      systemPrompt += ` specializing in ${framework}`;
    }
    
    systemPrompt += `. Generate clean, efficient, and well-documented code.`;
    
    return systemPrompt;
  }

  private async enhanceTemplate(templateMatch: any, request: CodeGenerationRequest): Promise<GeneratedCode> {
    const renderedCode = await this.templateEngine.render(templateMatch);
    
    return {
      code: renderedCode,
      explanation: `Generated using template: ${templateMatch.template.name}`,
      confidence: templateMatch.confidence,
      suggestions: [],
      metadata: {
        model: 'template',
        tokensUsed: 0,
        processingTime: Date.now()
      }
    };
  }
}