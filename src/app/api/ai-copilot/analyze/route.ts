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
    const { code, language, filePath } = body;

    // Validate request
    if (!code || !language) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: code and language are required' 
        },
        { status: 400 }
      );
    }

    // Analyze code
    const result = await copilotEngine.analyzeCode(code, language, filePath);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Code analysis failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze code',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Copilot Code Analysis API',
    endpoints: {
      'POST /api/ai-copilot/analyze': 'Analyze code and return insights',
      supportedLanguages: [
        'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'cpp', 'c'
      ],
      analysisFeatures: [
        'AST parsing',
        'Dependency extraction',
        'Complexity calculation',
        'Pattern identification',
        'Code issues detection',
        'Import/Export analysis'
      ]
    },
    timestamp: new Date().toISOString()
  });
}