import { 
  CodeTemplate, 
  TemplateMatch, 
  CodeGenerationRequest,
  TemplateVariable,
  TemplateExample 
} from '../core/types';

export class TemplateEngine {
  private templates: Map<string, CodeTemplate[]>;
  private matcher: TemplateMatcher;
  private renderer: TemplateRenderer;

  constructor() {
    this.templates = new Map();
    this.matcher = new TemplateMatcher();
    this.renderer = new TemplateRenderer();
    this.loadTemplates();
  }

  async match(request: CodeGenerationRequest): Promise<TemplateMatch | null> {
    const languageTemplates = this.templates.get(request.language) || [];
    
    for (const template of languageTemplates) {
      const match = await this.matcher.match(request.prompt, template);
      if (match.confidence > 0.8) {
        return match;
      }
    }
    
    return null;
  }

  async render(match: TemplateMatch): Promise<string> {
    return this.renderer.render(match.template, match.variables);
  }

  addTemplate(template: CodeTemplate): void {
    if (!this.templates.has(template.language)) {
      this.templates.set(template.language, []);
    }
    
    const languageTemplates = this.templates.get(template.language)!;
    languageTemplates.push(template);
  }

  removeTemplate(templateId: string, language: string): boolean {
    const languageTemplates = this.templates.get(language);
    if (!languageTemplates) return false;
    
    const index = languageTemplates.findIndex(t => t.id === templateId);
    if (index === -1) return false;
    
    languageTemplates.splice(index, 1);
    return true;
  }

  getTemplates(language?: string): CodeTemplate[] {
    if (language) {
      return this.templates.get(language) || [];
    }
    
    const allTemplates: CodeTemplate[] = [];
    for (const templates of this.templates.values()) {
      allTemplates.push(...templates);
    }
    
    return allTemplates;
  }

  private loadTemplates(): void {
    // Load built-in templates
    this.loadJavaScriptTemplates();
    this.loadTypeScriptTemplates();
    this.loadPythonTemplates();
    this.loadReactTemplates();
    this.loadNextJSTemplates();
  }

  private loadJavaScriptTemplates(): void {
    const templates: CodeTemplate[] = [
      {
        id: 'js-function-basic',
        name: 'Basic Function',
        description: 'A basic JavaScript function template',
        language: 'javascript',
        pattern: 'create.*function|write.*function',
        template: `function {{functionName}}({{parameters}}) {
  {{functionBody}}
}`,
        variables: [
          {
            name: 'functionName',
            type: 'string',
            description: 'Name of the function',
            required: true
          },
          {
            name: 'parameters',
            type: 'string',
            description: 'Function parameters',
            required: false,
            defaultValue: ''
          },
          {
            name: 'functionBody',
            type: 'string',
            description: 'Function implementation',
            required: true
          }
        ],
        examples: [
          {
            description: 'Simple greeting function',
            variables: {
              functionName: 'greet',
              parameters: 'name',
              functionBody: 'return `Hello, ${name}!`;'
            },
            output: `function greet(name) {
  return \`Hello, \${name}!\`;
}`
          }
        ]
      },
      {
        id: 'js-class-basic',
        name: 'Basic Class',
        description: 'A basic JavaScript class template',
        language: 'javascript',
        pattern: 'create.*class|write.*class',
        template: `class {{className}} {
  constructor({{constructorParams}}) {
    {{constructorBody}}
  }

  {{methods}}
}`,
        variables: [
          {
            name: 'className',
            type: 'string',
            description: 'Name of the class',
            required: true
          },
          {
            name: 'constructorParams',
            type: 'string',
            description: 'Constructor parameters',
            required: false,
            defaultValue: ''
          },
          {
            name: 'constructorBody',
            type: 'string',
            description: 'Constructor implementation',
            required: false,
            defaultValue: ''
          },
          {
            name: 'methods',
            type: 'string',
            description: 'Class methods',
            required: false,
            defaultValue: ''
          }
        ]
      }
    ];

    templates.forEach(template => this.addTemplate(template));
  }

  private loadTypeScriptTemplates(): void {
    const templates: CodeTemplate[] = [
      {
        id: 'ts-interface-basic',
        name: 'Basic Interface',
        description: 'A basic TypeScript interface template',
        language: 'typescript',
        pattern: 'create.*interface|define.*interface',
        template: `interface {{interfaceName}} {
  {{properties}}
}`,
        variables: [
          {
            name: 'interfaceName',
            type: 'string',
            description: 'Name of the interface',
            required: true
          },
          {
            name: 'properties',
            type: 'string',
            description: 'Interface properties',
            required: true
          }
        ]
      },
      {
        id: 'ts-type-basic',
        name: 'Basic Type',
        description: 'A basic TypeScript type template',
        language: 'typescript',
        pattern: 'create.*type|define.*type',
        template: `type {{typeName}} = {{typeDefinition}};`,
        variables: [
          {
            name: 'typeName',
            type: 'string',
            description: 'Name of the type',
            required: true
          },
          {
            name: 'typeDefinition',
            type: 'string',
            description: 'Type definition',
            required: true
          }
        ]
      }
    ];

    templates.forEach(template => this.addTemplate(template));
  }

  private loadPythonTemplates(): void {
    const templates: CodeTemplate[] = [
      {
        id: 'py-function-basic',
        name: 'Basic Function',
        description: 'A basic Python function template',
        language: 'python',
        pattern: 'create.*function|write.*function',
        template: `def {{functionName}}({{parameters}}):
    \"\"\"{{functionDocstring}}\"\"\"
    {{functionBody}}`,
        variables: [
          {
            name: 'functionName',
            type: 'string',
            description: 'Name of the function',
            required: true
          },
          {
            name: 'parameters',
            type: 'string',
            description: 'Function parameters',
            required: false,
            defaultValue: ''
          },
          {
            name: 'functionDocstring',
            type: 'string',
            description: 'Function docstring',
            required: false,
            defaultValue: ''
          },
          {
            name: 'functionBody',
            type: 'string',
            description: 'Function implementation',
            required: true
          }
        ]
      }
    ];

    templates.forEach(template => this.addTemplate(template));
  }

  private loadReactTemplates(): void {
    const templates: CodeTemplate[] = [
      {
        id: 'react-component-basic',
        name: 'Basic React Component',
        description: 'A basic React functional component template',
        language: 'typescript',
        framework: 'react',
        pattern: 'create.*component|write.*component',
        template: `import React from 'react';

interface {{componentName}}Props {
  {{props}}
}

export const {{componentName}}: React.FC<{{componentName}}Props> = ({{propsDestructured}}) => {
  return (
    <div>
      {{componentBody}}
    </div>
  );
};

export default {{componentName}};`,
        variables: [
          {
            name: 'componentName',
            type: 'string',
            description: 'Name of the component',
            required: true
          },
          {
            name: 'props',
            type: 'string',
            description: 'Component props interface',
            required: false,
            defaultValue: ''
          },
          {
            name: 'propsDestructured',
            type: 'string',
            description: 'Destructured props',
            required: false,
            defaultValue: ''
          },
          {
            name: 'componentBody',
            type: 'string',
            description: 'Component JSX content',
            required: true
          }
        ]
      }
    ];

    templates.forEach(template => this.addTemplate(template));
  }

  private loadNextJSTemplates(): void {
    const templates: CodeTemplate[] = [
      {
        id: 'nextjs-page-basic',
        name: 'Basic Next.js Page',
        description: 'A basic Next.js page component template',
        language: 'typescript',
        framework: 'nextjs',
        pattern: 'create.*page|write.*page',
        template: `import { NextPage } from 'next';

interface {{pageName}}Props {
  {{props}}
}

const {{pageName}}: NextPage<{{pageName}}Props> = ({{propsDestructured}}) => {
  return (
    <div className="container mx-auto px-4">
      <h1>{{pageTitle}}</h1>
      {{pageContent}}
    </div>
  );
};

export default {{pageName}};`,
        variables: [
          {
            name: 'pageName',
            type: 'string',
            description: 'Name of the page',
            required: true
          },
          {
            name: 'props',
            type: 'string',
            description: 'Page props interface',
            required: false,
            defaultValue: ''
          },
          {
            name: 'propsDestructured',
            type: 'string',
            description: 'Destructured props',
            required: false,
            defaultValue: ''
          },
          {
            name: 'pageTitle',
            type: 'string',
            description: 'Page title',
            required: true
          },
          {
            name: 'pageContent',
            type: 'string',
            description: 'Page content',
            required: true
          }
        ]
      }
    ];

    templates.forEach(template => this.addTemplate(template));
  }
}

class TemplateMatcher {
  async match(prompt: string, template: CodeTemplate): Promise<TemplateMatch> {
    const confidence = this.calculateConfidence(prompt, template);
    const variables = this.extractVariables(prompt, template);
    
    return {
      template,
      confidence,
      variables
    };
  }

  private calculateConfidence(prompt: string, template: CodeTemplate): number {
    let confidence = 0;
    
    // Check if prompt matches template pattern
    if (template.pattern) {
      const patternRegex = new RegExp(template.pattern, 'i');
      if (patternRegex.test(prompt)) {
        confidence += 0.6;
      }
    }
    
    // Check for keyword matches
    const keywords = this.extractKeywords(template.name, template.description);
    const keywordMatches = keywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    
    confidence += (keywordMatches / keywords.length) * 0.4;
    
    return Math.min(confidence, 1.0);
  }

  private extractKeywords(name: string, description: string): string[] {
    const text = `${name} ${description}`.toLowerCase();
    const keywords = text.split(/\s+/).filter(word => word.length > 2);
    return [...new Set(keywords)];
  }

  private extractVariables(prompt: string, template: CodeTemplate): Record<string, string> {
    const variables: Record<string, string> = {};
    
    // Simple variable extraction based on prompt content
    template.variables.forEach(variable => {
      // Try to extract variable value from prompt
      const value = this.extractVariableValue(prompt, variable.name, variable.type);
      if (value) {
        variables[variable.name] = value;
      } else if (variable.defaultValue !== undefined) {
        variables[variable.name] = variable.defaultValue;
      }
    });
    
    return variables;
  }

  private extractVariableValue(prompt: string, variableName: string, type: string): string | null {
    // Simple extraction logic - in a real implementation, this would be more sophisticated
    const patterns = [
      `${variableName}:\\s*([^\\s,]+)`,
      `${variableName}\\s*=\\s*([^\\s,]+)`,
      `${variableName}\\s+([^\\s,]+)`
    ];
    
    for (const pattern of patterns) {
      const match = prompt.match(new RegExp(pattern, 'i'));
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }
}

class TemplateRenderer {
  render(template: CodeTemplate, variables: Record<string, string>): string {
    let rendered = template.template;
    
    // Replace variables in template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
    }
    
    // Handle conditional blocks
    rendered = this.handleConditionals(rendered, variables);
    
    // Handle loops
    rendered = this.handleLoops(rendered, variables);
    
    return rendered.trim();
  }

  private handleConditionals(template: string, variables: Record<string, string>): string {
    // Handle {{#if variable}}...{{/if}} blocks
    const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
    
    return template.replace(ifRegex, (match, variable, content) => {
      const value = variables[variable];
      if (value && value !== 'false' && value !== '0' && value !== '') {
        return content;
      }
      return '';
    });
  }

  private handleLoops(template: string, variables: Record<string, string>): string {
    // Handle {{#each variable}}...{{/each}} blocks
    const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
    
    return template.replace(eachRegex, (match, variable, content) => {
      const value = variables[variable];
      if (value && Array.isArray(value)) {
        return (value as any[]).map(item => {
          let itemContent = content;
          // Replace {{this}} with current item
          itemContent = itemContent.replace(/{{this}}/g, item);
          return itemContent;
        }).join('\n');
      }
      return '';
    });
  }
}