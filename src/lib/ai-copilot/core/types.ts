export interface CopilotConfig {
  aiProvider: 'openai' | 'anthropic' | 'local';
  model: string;
  maxTokens: number;
  temperature: number;
  contextWindow: number;
}

export interface CodeGenerationRequest {
  prompt: string;
  language: string;
  framework?: string;
  context?: CodeContext;
  options?: GenerationOptions;
}

export interface CodeContext {
  currentFile?: string;
  relatedFiles?: string[];
  projectStructure?: ProjectStructure;
  userPreferences?: UserPreferences;
}

export interface GenerationOptions {
  includeTests?: boolean;
  includeComments?: boolean;
  styleGuide?: string;
  complexity?: 'simple' | 'medium' | 'complex';
}

export interface ProjectStructure {
  root: string;
  files: ProjectFile[];
  dependencies: ProjectDependency[];
  config: ProjectConfig;
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
  size: number;
  lastModified: Date;
}

export interface ProjectDependency {
  name: string;
  version: string;
  type: 'dev' | 'prod';
}

export interface ProjectConfig {
  packageJson?: any;
  tsConfig?: any;
  tailwindConfig?: any;
  otherConfigs?: Record<string, any>;
}

export interface UserPreferences {
  preferredLanguage: string;
  codeStyle: 'functional' | 'object-oriented' | 'procedural';
  commentStyle: 'detailed' | 'minimal' | 'none';
  testingFramework?: string;
  linter?: string;
}

export interface GeneratedCode {
  code: string;
  explanation?: string;
  confidence: number;
  suggestions?: string[];
  tests?: string;
  metadata?: {
    model: string;
    tokensUsed: number;
    processingTime: number;
  };
}

export interface AnalysisResult {
  ast?: any;
  dependencies: string[];
  exports: string[];
  imports: string[];
  complexity: number;
  patterns: Pattern[];
  issues: CodeIssue[];
}

export interface Pattern {
  type: string;
  name: string;
  confidence: number;
  location: {
    start: number;
    end: number;
  };
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  severity: number;
  location: {
    line: number;
    column: number;
  };
  suggestion?: string;
}

export interface AIRequest {
  prompt: string;
  system: string;
  options?: GenerationOptions;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  framework?: string;
  pattern: string;
  template: string;
  variables: TemplateVariable[];
  examples: TemplateExample[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface TemplateExample {
  description: string;
  variables: Record<string, any>;
  output: string;
}

export interface TemplateMatch {
  template: CodeTemplate;
  confidence: number;
  variables: Record<string, string>;
}

export interface ContextWindow {
  currentFile: string;
  surroundingCode: string;
  relatedFiles: string[];
  projectContext: ProjectContext;
  userHistory: UserHistory;
}

export interface ProjectContext {
  language: string;
  framework?: string;
  dependencies: string[];
  structure: ProjectStructure;
}

export interface UserHistory {
  recentPrompts: string[];
  preferredPatterns: string[];
  commonMistakes: string[];
}

export interface LanguagePlugin {
  name: string;
  language: string;
  extensions: string[];
  parser: CodeParser;
  generator?: LanguageGenerator;
  linter?: CodeLinter;
  formatter?: CodeFormatter;
}

export interface CodeParser {
  parse(content: string): Promise<any>;
  getLanguage(): string;
  getExtensions(): string[];
}

export interface LanguageGenerator {
  generate(request: AIRequest): Promise<GeneratedCode>;
  getLanguage(): string;
}

export interface CodeLinter {
  lint(code: string, language: string): Promise<CodeIssue[]>;
  getLanguage(): string;
}

export interface CodeFormatter {
  format(code: string, language: string): Promise<string>;
  getLanguage(): string;
}