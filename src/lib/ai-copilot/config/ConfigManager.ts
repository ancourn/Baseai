import { CopilotConfig, AIModelConfig, TemplateConfig, ContextConfig, PluginConfig, UIConfig } from '../core/types';

export interface CopilotSystemConfig {
  ai: AIModelConfig;
  templates: TemplateConfig;
  context: ContextConfig;
  plugins: PluginConfig;
  ui: UIConfig;
}

export class ConfigManager {
  private config: CopilotSystemConfig;
  private configPath: string;
  private isLoaded: boolean = false;

  constructor(configPath?: string) {
    this.configPath = configPath || './ai-copilot.config.json';
    this.config = this.getDefaultConfig();
  }

  async loadConfig(): Promise<void> {
    try {
      // In a real implementation, this would read from a file or database
      // For now, we'll use the default config
      this.config = this.getDefaultConfig();
      this.isLoaded = true;
      console.log('Configuration loaded successfully');
    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }

  async saveConfig(): Promise<void> {
    try {
      // In a real implementation, this would write to a file or database
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Failed to save configuration:', error);
      throw error;
    }
  }

  getConfig(): CopilotSystemConfig {
    if (!this.isLoaded) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }
    return { ...this.config };
  }

  getCopilotConfig(): CopilotConfig {
    const aiConfig = this.config.ai;
    return {
      aiProvider: aiConfig.provider,
      model: aiConfig.model,
      maxTokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
      contextWindow: aiConfig.maxTokens // Using maxTokens as contextWindow for now
    };
  }

  updateConfig(updates: Partial<CopilotSystemConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  updateAIConfig(updates: Partial<AIModelConfig>): void {
    this.config.ai = { ...this.config.ai, ...updates };
  }

  updateTemplateConfig(updates: Partial<TemplateConfig>): void {
    this.config.templates = { ...this.config.templates, ...updates };
  }

  updateContextConfig(updates: Partial<ContextConfig>): void {
    this.config.context = { ...this.config.context, ...updates };
  }

  updatePluginConfig(updates: Partial<PluginConfig>): void {
    this.config.plugins = { ...this.config.plugins, ...updates };
  }

  updateUIConfig(updates: Partial<UIConfig>): void {
    this.config.ui = { ...this.config.ui, ...updates };
  }

  validateConfig(): boolean {
    try {
      // Validate AI config
      if (!this.config.ai.provider || !this.config.ai.model) {
        throw new Error('AI provider and model are required');
      }

      if (this.config.ai.maxTokens <= 0) {
        throw new Error('Max tokens must be positive');
      }

      if (this.config.ai.temperature < 0 || this.config.ai.temperature > 2) {
        throw new Error('Temperature must be between 0 and 2');
      }

      // Validate template config
      if (!this.config.templates.templatesPath) {
        throw new Error('Templates path is required');
      }

      // Validate context config
      if (this.config.context.maxFiles <= 0) {
        throw new Error('Max files must be positive');
      }

      if (this.config.context.maxFileSize <= 0) {
        throw new Error('Max file size must be positive');
      }

      return true;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      return false;
    }
  }

  getSupportedAIProviders(): string[] {
    return ['openai', 'anthropic', 'local'];
  }

  getSupportedModels(provider: string): string[] {
    const models: Record<string, string[]> = {
      openai: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'],
      anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      local: ['gpt-3.5-turbo', 'llama-2', 'mistral', 'codellama']
    };

    return models[provider] || [];
  }

  resetToDefaults(): void {
    this.config = this.getDefaultConfig();
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = { ...this.getDefaultConfig(), ...importedConfig };
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      throw new Error('Invalid configuration format');
    }
  }

  private getDefaultConfig(): CopilotSystemConfig {
    return {
      ai: {
        provider: 'local',
        model: 'gpt-3.5-turbo',
        maxTokens: 2000,
        temperature: 0.7,
        apiKey: '',
        baseUrl: ''
      },
      templates: {
        templatesPath: './templates',
        customTemplates: [],
        enableCommunityTemplates: true
      },
      context: {
        maxFiles: 100,
        maxFileSize: 1024 * 1024, // 1MB
        cacheSize: 1000,
        includeDependencies: true
      },
      plugins: {
        enabledPlugins: ['javascript', 'typescript', 'python', 'java', 'go'],
        pluginDirectory: './plugins',
        autoLoadPlugins: true
      },
      ui: {
        theme: 'system',
        codeEditorTheme: 'vs-dark',
        fontSize: 14,
        showLineNumbers: true,
        wordWrap: true,
        minimap: false
      }
    };
  }
}

// Global configuration manager instance
export const configManager = new ConfigManager();