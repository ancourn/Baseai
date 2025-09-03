import { BaseLanguagePlugin, JavaScriptPlugin, TypeScriptPlugin, PythonPlugin, JavaPlugin, GoPlugin } from './LanguagePlugin';
import { LanguagePlugin } from '../core/types';

export class PluginManager {
  private plugins: Map<string, LanguagePlugin>;
  private extensions: Map<string, LanguagePlugin>;
  private initialized: boolean = false;

  constructor() {
    this.plugins = new Map();
    this.extensions = new Map();
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Register built-in plugins
    await this.registerPlugin(new JavaScriptPlugin());
    await this.registerPlugin(new TypeScriptPlugin());
    await this.registerPlugin(new PythonPlugin());
    await this.registerPlugin(new JavaPlugin());
    await this.registerPlugin(new GoPlugin());

    this.initialized = true;
    console.log('Plugin manager initialized with', this.plugins.size, 'plugins');
  }

  async registerPlugin(plugin: LanguagePlugin): Promise<void> {
    try {
      await plugin.initialize();
      
      this.plugins.set(plugin.language, plugin);
      
      // Register extensions
      for (const extension of plugin.extensions) {
        this.extensions.set(extension, plugin);
      }
      
      console.log(`Registered plugin: ${plugin.name} (${plugin.language})`);
    } catch (error) {
      console.error(`Failed to register plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  async unregisterPlugin(language: string): Promise<boolean> {
    const plugin = this.plugins.get(language);
    if (!plugin) {
      return false;
    }

    // Remove from plugins map
    this.plugins.delete(language);
    
    // Remove from extensions map
    for (const extension of plugin.extensions) {
      this.extensions.delete(extension);
    }
    
    console.log(`Unregistered plugin: ${plugin.name} (${plugin.language})`);
    return true;
  }

  getPlugin(language: string): LanguagePlugin | undefined {
    return this.plugins.get(language);
  }

  getPluginByExtension(extension: string): LanguagePlugin | undefined {
    return this.extensions.get(extension);
  }

  getAllPlugins(): LanguagePlugin[] {
    return Array.from(this.plugins.values());
  }

  getSupportedLanguages(): string[] {
    return Array.from(this.plugins.keys());
  }

  getSupportedExtensions(): string[] {
    return Array.from(this.extensions.keys());
  }

  async getPluginCapabilities(language: string): Promise<string[]> {
    const plugin = this.plugins.get(language);
    if (!plugin) {
      return [];
    }
    
    if (plugin instanceof BaseLanguagePlugin) {
      return plugin.getCapabilities();
    }
    
    return [];
  }

  async supportsFeature(language: string, feature: string): Promise<boolean> {
    const plugin = this.plugins.get(language);
    if (!plugin) {
      return false;
    }
    
    if (plugin instanceof BaseLanguagePlugin) {
      return plugin.supports(feature);
    }
    
    return false;
  }

  async validateCode(language: string, code: string): Promise<boolean> {
    const plugin = this.plugins.get(language);
    if (!plugin) {
      return false;
    }
    
    if (plugin instanceof BaseLanguagePlugin) {
      return plugin.validateCode(code);
    }
    
    return false;
  }

  async getLanguageInfo(language: string): Promise<any> {
    const plugin = this.plugins.get(language);
    if (!plugin) {
      return null;
    }
    
    if (plugin instanceof BaseLanguagePlugin) {
      return plugin.getLanguageInfo();
    }
    
    return null;
  }

  async getPluginInfo(): Promise<Array<{
    name: string;
    language: string;
    extensions: string[];
    capabilities: string[];
    version: string;
  }>> {
    const pluginInfo = [];
    
    for (const plugin of this.plugins.values()) {
      if (plugin instanceof BaseLanguagePlugin) {
        const info = await plugin.getLanguageInfo();
        pluginInfo.push({
          name: plugin.name,
          language: info.name,
          extensions: info.extensions,
          capabilities: info.features,
          version: info.version
        });
      }
    }
    
    return pluginInfo;
  }

  async detectLanguage(filePath: string, content?: string): Promise<string | null> {
    // First try by file extension
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (extension) {
      const plugin = this.getPluginByExtension(`.${extension}`);
      if (plugin) {
        return plugin.language;
      }
    }

    // If content is provided, try to detect by content
    if (content) {
      return this.detectLanguageByContent(content);
    }

    return null;
  }

  private async detectLanguageByContent(content: string): Promise<string | null> {
    const lines = content.split('\n');
    const firstLine = lines[0]?.trim().toLowerCase();

    // Check for shebang
    if (firstLine?.startsWith('#!')) {
      if (firstLine.includes('python')) {
        return 'python';
      } else if (firstLine.includes('node')) {
        return 'javascript';
      }
    }

    // Check for language-specific patterns
    const patterns = {
      typescript: [/interface\s+\w+/, /type\s+\w+\s*=/, /:\s*\w+/],
      javascript: [/function\s+\w+/, /const\s+\w+\s*=/, /let\s+\w+\s*=/],
      python: [/def\s+\w+/, /class\s+\w+/, /import\s+\w+/],
      java: [/public class/, /private\s+\w+/, /public\s+\w+/],
      go: [/func\s+\w+/, /package\s+\w+/, /import\s*\(/]
    };

    const scores = new Map<string, number>();

    for (const [language, languagePatterns] of Object.entries(patterns)) {
      let score = 0;
      for (const pattern of languagePatterns) {
        if (pattern.test(content)) {
          score++;
        }
      }
      if (score > 0) {
        scores.set(language, score);
      }
    }

    // Return language with highest score
    let bestLanguage = null;
    let bestScore = 0;
    
    for (const [language, score] of scores) {
      if (score > bestScore) {
        bestScore = score;
        bestLanguage = language;
      }
    }

    return bestLanguage;
  }

  async parseCode(language: string, code: string): Promise<any> {
    const plugin = this.plugins.get(language);
    if (!plugin || !plugin.parser) {
      throw new Error(`No parser available for language: ${language}`);
    }

    return plugin.parser.parse(code);
  }

  async generateCode(language: string, request: any): Promise<any> {
    const plugin = this.plugins.get(language);
    if (!plugin || !plugin.generator) {
      throw new Error(`No generator available for language: ${language}`);
    }

    return plugin.generator.generate(request);
  }

  async lintCode(language: string, code: string): Promise<any[]> {
    const plugin = this.plugins.get(language);
    if (!plugin || !plugin.linter) {
      return [];
    }

    return plugin.linter.lint(code, language);
  }

  async formatCode(language: string, code: string): Promise<string> {
    const plugin = this.plugins.get(language);
    if (!plugin || !plugin.formatter) {
      return code;
    }

    return plugin.formatter.format(code, language);
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async shutdown(): Promise<void> {
    // Cleanup resources if needed
    this.plugins.clear();
    this.extensions.clear();
    this.initialized = false;
    console.log('Plugin manager shutdown complete');
  }
}

// Global plugin manager instance
export const pluginManager = new PluginManager();