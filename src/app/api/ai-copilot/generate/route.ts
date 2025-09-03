import { NextRequest, NextResponse } from 'next/server';
import { CopilotEngine } from '@/lib/ai-copilot/core/CopilotEngine';
import { CopilotConfig, CodeGenerationRequest } from '@/lib/ai-copilot/core/types';

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
    const { prompt, language, framework, context, options } = body;

    // Validate request
    if (!prompt || !language) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: prompt and language are required' 
        },
        { status: 400 }
      );
    }

    // Build generation request
    const generationRequest: CodeGenerationRequest = {
      prompt,
      language,
      framework: framework || undefined,
      context: context || undefined,
      options: options || undefined
    };

    // Generate code
    const result = await copilotEngine.generateCode(generationRequest);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Code generation failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate code',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Copilot Code Generation API',
    endpoints: {
      'POST /api/ai-copilot/generate': 'Generate code from prompt',
      supportedLanguages: [
        'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'cpp', 'c'
      ],
      supportedFrameworks: [
        'react', 'nextjs', 'vue', 'angular', 'express', 'fastapi', 'django', 'flask'
      ]
    },
    timestamp: new Date().toISOString()
  });
}