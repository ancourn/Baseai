import { db } from '@/lib/db';
import { configManager } from './ConfigManager';
import { CopilotSystemConfig } from './ConfigManager';

export class ConfigService {
  async getUserPreferences(userId: string) {
    try {
      const preferences = await db.userPreference.findUnique({
        where: { userId }
      });

      if (!preferences) {
        // Create default preferences
        return await this.createUserPreferences(userId);
      }

      return preferences;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId: string, preferences: any) {
    try {
      const updatedPreferences = await db.userPreference.upsert({
        where: { userId },
        update: preferences,
        create: {
          userId,
          ...preferences
        }
      });

      return updatedPreferences;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      throw error;
    }
  }

  async getSystemConfig(): Promise<CopilotSystemConfig> {
    try {
      await configManager.loadConfig();
      return configManager.getConfig();
    } catch (error) {
      console.error('Failed to get system config:', error);
      throw error;
    }
  }

  async updateSystemConfig(config: Partial<CopilotSystemConfig>): Promise<CopilotSystemConfig> {
    try {
      configManager.updateConfig(config);
      await configManager.saveConfig();
      return configManager.getConfig();
    } catch (error) {
      console.error('Failed to update system config:', error);
      throw error;
    }
  }

  async getAIConfig() {
    try {
      await configManager.loadConfig();
      return configManager.getConfig().ai;
    } catch (error) {
      console.error('Failed to get AI config:', error);
      throw error;
    }
  }

  async updateAIConfig(aiConfig: any) {
    try {
      configManager.updateAIConfig(aiConfig);
      await configManager.saveConfig();
      return configManager.getConfig().ai;
    } catch (error) {
      console.error('Failed to update AI config:', error);
      throw error;
    }
  }

  async getTemplateConfig() {
    try {
      await configManager.loadConfig();
      return configManager.getConfig().templates;
    } catch (error) {
      console.error('Failed to get template config:', error);
      throw error;
    }
  }

  async updateTemplateConfig(templateConfig: any) {
    try {
      configManager.updateTemplateConfig(templateConfig);
      await configManager.saveConfig();
      return configManager.getConfig().templates;
    } catch (error) {
      console.error('Failed to update template config:', error);
      throw error;
    }
  }

  async getContextConfig() {
    try {
      await configManager.loadConfig();
      return configManager.getConfig().context;
    } catch (error) {
      console.error('Failed to get context config:', error);
      throw error;
    }
  }

  async updateContextConfig(contextConfig: any) {
    try {
      configManager.updateContextConfig(contextConfig);
      await configManager.saveConfig();
      return configManager.getConfig().context;
    } catch (error) {
      console.error('Failed to update context config:', error);
      throw error;
    }
  }

  async getPluginConfig() {
    try {
      await configManager.loadConfig();
      return configManager.getConfig().plugins;
    } catch (error) {
      console.error('Failed to get plugin config:', error);
      throw error;
    }
  }

  async updatePluginConfig(pluginConfig: any) {
    try {
      configManager.updatePluginConfig(pluginConfig);
      await configManager.saveConfig();
      return configManager.getConfig().plugins;
    } catch (error) {
      console.error('Failed to update plugin config:', error);
      throw error;
    }
  }

  async getUIConfig() {
    try {
      await configManager.loadConfig();
      return configManager.getConfig().ui;
    } catch (error) {
      console.error('Failed to get UI config:', error);
      throw error;
    }
  }

  async updateUIConfig(uiConfig: any) {
    try {
      configManager.updateUIConfig(uiConfig);
      await configManager.saveConfig();
      return configManager.getConfig().ui;
    } catch (error) {
      console.error('Failed to update UI config:', error);
      throw error;
    }
  }

  async validateSystemConfig(config: CopilotSystemConfig): Promise<boolean> {
    try {
      configManager.updateConfig(config);
      return configManager.validateConfig();
    } catch (error) {
      console.error('Failed to validate system config:', error);
      return false;
    }
  }

  async resetSystemConfig(): Promise<CopilotSystemConfig> {
    try {
      configManager.resetToDefaults();
      await configManager.saveConfig();
      return configManager.getConfig();
    } catch (error) {
      console.error('Failed to reset system config:', error);
      throw error;
    }
  }

  async exportSystemConfig(): Promise<string> {
    try {
      await configManager.loadConfig();
      return configManager.exportConfig();
    } catch (error) {
      console.error('Failed to export system config:', error);
      throw error;
    }
  }

  async importSystemConfig(configJson: string): Promise<CopilotSystemConfig> {
    try {
      configManager.importConfig(configJson);
      await configManager.saveConfig();
      return configManager.getConfig();
    } catch (error) {
      console.error('Failed to import system config:', error);
      throw error;
    }
  }

  async getSupportedAIProviders(): Promise<string[]> {
    try {
      return configManager.getSupportedAIProviders();
    } catch (error) {
      console.error('Failed to get supported AI providers:', error);
      throw error;
    }
  }

  async getSupportedModels(provider: string): Promise<string[]> {
    try {
      return configManager.getSupportedModels(provider);
    } catch (error) {
      console.error('Failed to get supported models:', error);
      throw error;
    }
  }

  private async createUserPreferences(userId: string) {
    const defaultPreferences = {
      preferredLanguage: 'typescript',
      codeStyle: 'functional',
      commentStyle: 'detailed',
      testingFramework: 'jest',
      linter: 'eslint',
      aiProvider: 'local',
      aiModel: 'gpt-3.5-turbo',
      maxTokens: 2000,
      temperature: 0.7
    };

    return await db.userPreference.create({
      data: {
        userId,
        ...defaultPreferences
      }
    });
  }
}

// Global configuration service instance
export const configService = new ConfigService();