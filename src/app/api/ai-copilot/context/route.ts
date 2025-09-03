import { NextRequest, NextResponse } from 'next/server';
import { CopilotEngine } from '@/lib/ai-copilot/core/CopilotEngine';
import { CopilotConfig } from '@/lib/ai-copilot/core/types';

// Default configuration
const defaultConfig: CopilotConfig = {
  aiProvider: 'local',
  model: 'gpt-3.5-turbo',
  maxTokens: 2000,
  temperature: 0.7,
  contextWindow: 4000
};

const copilotEngine = new CopilotEngine(defaultConfig);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectPath, context } = body;

    // Validate request
    if (!projectPath) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: projectPath is required' 
        },
        { status: 400 }
      );
    }

    // Get project context
    const result = await copilotEngine.getProjectContext(projectPath);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to get project context:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get project context',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Copilot Context API',
    endpoints: {
      'POST /api/ai-copilot/context': 'Get project context and analysis',
      features: [
        'Project structure analysis',
        'Language detection',
        'Framework identification',
        'Dependency analysis',
        'File indexing',
        'Context caching'
      ]
    },
    timestamp: new Date().toISOString()
  });
}