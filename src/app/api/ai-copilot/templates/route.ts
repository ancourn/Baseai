import { NextRequest, NextResponse } from 'next/server';
import { TemplateEngine } from '@/lib/ai-copilot/templates/TemplateEngine';
import { CodeTemplate } from '@/lib/ai-copilot/core/types';

const templateEngine = new TemplateEngine();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    // Get templates
    const templates = templateEngine.getTemplates(language || undefined);

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to get templates:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get templates',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template } = body;

    // Validate request
    if (!template) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: template is required' 
        },
        { status: 400 }
      );
    }

    // Validate template structure
    const requiredFields = ['id', 'name', 'description', 'language', 'template'];
    for (const field of requiredFields) {
      if (!template[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        );
      }
    }

    // Add template
    templateEngine.addTemplate(template as CodeTemplate);

    return NextResponse.json({
      success: true,
      message: 'Template added successfully',
      data: template,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to add template:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add template',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');
    const language = searchParams.get('language');

    // Validate request
    if (!templateId || !language) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters: templateId and language are required' 
        },
        { status: 400 }
      );
    }

    // Remove template
    const success = templateEngine.removeTemplate(templateId, language);

    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Template not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template removed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to remove template:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove template',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}