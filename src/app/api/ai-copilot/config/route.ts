import { NextRequest, NextResponse } from 'next/server';
import { configService } from '@/lib/ai-copilot/config/ConfigService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    if (type === 'user' && userId) {
      // Get user preferences
      const preferences = await configService.getUserPreferences(userId);
      return NextResponse.json({
        success: true,
        data: preferences,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'system') {
      // Get system configuration
      const config = await configService.getSystemConfig();
      return NextResponse.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'ai') {
      // Get AI configuration
      const config = await configService.getAIConfig();
      return NextResponse.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'templates') {
      // Get template configuration
      const config = await configService.getTemplateConfig();
      return NextResponse.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'context') {
      // Get context configuration
      const config = await configService.getContextConfig();
      return NextResponse.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'plugins') {
      // Get plugin configuration
      const config = await configService.getPluginConfig();
      return NextResponse.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'ui') {
      // Get UI configuration
      const config = await configService.getUIConfig();
      return NextResponse.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'providers') {
      // Get supported AI providers
      const providers = await configService.getSupportedAIProviders();
      return NextResponse.json({
        success: true,
        data: providers,
        timestamp: new Date().toISOString()
      });
    } else if (type === 'models') {
      // Get supported models for a provider
      const provider = searchParams.get('provider');
      if (!provider) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Provider parameter is required' 
          },
          { status: 400 }
        );
      }
      const models = await configService.getSupportedModels(provider);
      return NextResponse.json({
        success: true,
        data: models,
        timestamp: new Date().toISOString()
      });
    } else {
      // Get all configuration overview
      const [systemConfig, userConfig] = await Promise.all([
        configService.getSystemConfig(),
        userId ? configService.getUserPreferences(userId) : null
      ]);

      return NextResponse.json({
        success: true,
        data: {
          system: systemConfig,
          user: userConfig
        },
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Failed to get configuration:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get configuration',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, config } = body;

    if (!type || !config) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Type and config are required' 
        },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'user':
        if (!userId) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'User ID is required for user preferences' 
            },
            { status: 400 }
          );
        }
        result = await configService.updateUserPreferences(userId, config);
        break;

      case 'system':
        result = await configService.updateSystemConfig(config);
        break;

      case 'ai':
        result = await configService.updateAIConfig(config);
        break;

      case 'templates':
        result = await configService.updateTemplateConfig(config);
        break;

      case 'context':
        result = await configService.updateContextConfig(config);
        break;

      case 'plugins':
        result = await configService.updatePluginConfig(config);
        break;

      case 'ui':
        result = await configService.updateUIConfig(config);
        break;

      case 'validate':
        const isValid = await configService.validateSystemConfig(config);
        return NextResponse.json({
          success: true,
          data: { isValid },
          timestamp: new Date().toISOString()
        });

      case 'import':
        const importedConfig = await configService.importSystemConfig(config);
        return NextResponse.json({
          success: true,
          data: importedConfig,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: `Invalid configuration type: ${type}` 
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to update configuration:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update configuration',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'reset') {
      const resetConfig = await configService.resetSystemConfig();
      return NextResponse.json({
        success: true,
        data: resetConfig,
        message: 'Configuration reset to defaults',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid operation type' 
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Failed to reset configuration:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset configuration',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}