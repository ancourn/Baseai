import { CopilotConfig, AIRequest, GeneratedCode, AIProvider } from '../core/types';
import ZAI from 'z-ai-web-dev-sdk';

export class CodeGenerator {
  private aiProvider: AIProvider;
  private config: CopilotConfig;
  private zaiInstance: any;

  constructor(config: CopilotConfig) {
    this.config = config;
    this.aiProvider = this.createAIProvider(config);
  }

  async generate(request: AIRequest): Promise<GeneratedCode> {
    try {
      const response = await this.aiProvider.generate({
        messages: [
          { role: 'system', content: request.system },
          { role: 'user', content: request.prompt }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });

      return this.parseResponse(response);
    } catch (error) {
      console.error('AI generation failed:', error);
      return this.handleGenerationError(error);
    }
  }

  private createAIProvider(config: CopilotConfig): AIProvider {
    switch (config.aiProvider) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'anthropic':
        return new AnthropicProvider(config);
      case 'local':
        return new LocalProvider(config);
      default:
        throw new Error(`Unsupported AI provider: ${config.aiProvider}`);
    }
  }

  private parseResponse(response: any): GeneratedCode {
    // Parse and structure the AI response
    const content = response.choices?.[0]?.message?.content || '';
    
    return {
      code: this.extractCode(content),
      explanation: this.extractExplanation(content),
      confidence: this.calculateConfidence(response),
      suggestions: this.extractSuggestions(content),
      tests: this.extractTests(content),
      metadata: {
        model: this.config.model,
        tokensUsed: response.usage?.total_tokens || 0,
        processingTime: Date.now()
      }
    };
  }

  private extractCode(content: string): string {
    // Extract code from markdown code blocks
    const codeBlockMatch = content.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    
    // If no code block found, return the entire content
    return content.trim();
  }

  private extractExplanation(content: string): string {
    // Extract explanation from content (text outside code blocks)
    const explanation = content.replace(/```(?:\w+)?\n[\s\S]*?\n```/g, '').trim();
    return explanation || 'Generated code based on your request.';
  }

  private calculateConfidence(response: any): number {
    // Calculate confidence based on response metadata
    const finishReason = response.choices?.[0]?.finish_reason;
    const tokensUsed = response.usage?.total_tokens || 0;
    
    let confidence = 0.5; // Base confidence
    
    if (finishReason === 'stop') {
      confidence += 0.3;
    }
    
    if (tokensUsed > 0 && tokensUsed < this.config.maxTokens * 0.8) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }

  private extractSuggestions(content: string): string[] {
    // Extract suggestions from content
    const suggestions: string[] = [];
    const suggestionMatch = content.match(/(?:Suggestions?|Recommendations?):\s*(.*?)(?:\n\n|$)/i);
    
    if (suggestionMatch) {
      const suggestionText = suggestionMatch[1];
      suggestions.push(...suggestionText.split(',').map(s => s.trim()));
    }
    
    return suggestions;
  }

  private extractTests(content: string): string {
    // Extract test code from content
    const testMatch = content.match(/(?:Tests?|Test Code):\s*```(?:\w+)?\n([\s\S]*?)\n```/i);
    if (testMatch) {
      return testMatch[1].trim();
    }
    
    return '';
  }

  private handleGenerationError(error: any): GeneratedCode {
    return {
      code: '',
      explanation: `Failed to generate code: ${error.message}`,
      confidence: 0,
      suggestions: ['Please try again with a more specific prompt', 'Check your internet connection'],
      metadata: {
        model: this.config.model,
        tokensUsed: 0,
        processingTime: Date.now()
      }
    };
  }
}

// AI Provider implementations
class OpenAIProvider implements AIProvider {
  private config: CopilotConfig;
  private zai: any;

  constructor(config: CopilotConfig) {
    this.config = config;
  }

  async generate(request: any): Promise<any> {
    try {
      this.zai = await ZAI.create();
      
      const completion = await this.zai.chat.completions.create({
        messages: request.messages,
        max_tokens: request.max_tokens,
        temperature: request.temperature,
        model: this.config.model
      });

      return completion;
    } catch (error) {
      console.error('OpenAI generation failed:', error);
      throw error;
    }
  }
}

class AnthropicProvider implements AIProvider {
  private config: CopilotConfig;
  private zai: any;

  constructor(config: CopilotConfig) {
    this.config = config;
  }

  async generate(request: any): Promise<any> {
    try {
      this.zai = await ZAI.create();
      
      // Convert OpenAI format to Anthropic format
      const systemMessage = request.messages.find((m: any) => m.role === 'system');
      const userMessages = request.messages.filter((m: any) => m.role === 'user');
      
      const completion = await this.zai.chat.completions.create({
        messages: [
          ...(systemMessage ? [{ role: 'system', content: systemMessage.content }] : []),
          ...userMessages
        ],
        max_tokens: request.max_tokens,
        temperature: request.temperature,
        model: this.config.model
      });

      return completion;
    } catch (error) {
      console.error('Anthropic generation failed:', error);
      throw error;
    }
  }
}

class LocalProvider implements AIProvider {
  private config: CopilotConfig;
  private zai: any;

  constructor(config: CopilotConfig) {
    this.config = config;
  }

  async generate(request: any): Promise<any> {
    try {
      this.zai = await ZAI.create();
      
      const completion = await this.zai.chat.completions.create({
        messages: request.messages,
        max_tokens: request.max_tokens,
        temperature: request.temperature,
        model: this.config.model
      });

      return completion;
    } catch (error) {
      console.error('Local generation failed:', error);
      throw error;
    }
  }
}