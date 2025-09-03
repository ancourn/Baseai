import { 
  CodeFile, 
  AnalysisResult, 
  Pattern, 
  CodeIssue, 
  ProjectAnalysis,
  CodeParser 
} from '../core/types';

export class CodeAnalyzer {
  private parsers: Map<string, CodeParser>;
  private supportedLanguages: Set<string>;

  constructor() {
    this.parsers = new Map();
    this.supportedLanguages = new Set();
    this.initializeParsers();
  }

  async analyzeFile(file: CodeFile): Promise<AnalysisResult> {
    try {
      const parser = this.parsers.get(file.language);
      if (!parser) {
        throw new Error(`No parser found for language: ${file.language}`);
      }

      const ast = await parser.parse(file.content);
      const dependencies = this.extractDependencies(file.content, file.language);
      const exports = this.extractExports(file.content, file.language);
      const imports = this.extractImports(file.content, file.language);
      const complexity = this.calculateComplexity(ast);
      const patterns = this.identifyPatterns(ast);
      const issues = this.identifyIssues(file.content, file.language);

      return {
        ast,
        dependencies,
        exports,
        imports,
        complexity,
        patterns,
        issues
      };
    } catch (error) {
      console.error(`Failed to analyze file ${file.path}:`, error);
      throw error;
    }
  }

  async analyzeProject(files: CodeFile[]): Promise<ProjectAnalysis> {
    try {
      const analyses = await Promise.all(
        files.map(file => this.analyzeFile(file))
      );

      return {
        files: analyses,
        structure: this.buildProjectStructure(analyses),
        patterns: this.identifyProjectPatterns(analyses),
        dependencies: this.buildDependencyGraph(analyses),
        metrics: this.calculateProjectMetrics(analyses)
      };
    } catch (error) {
      console.error('Failed to analyze project:', error);
      throw error;
    }
  }

  private initializeParsers(): void {
    // Initialize parsers for different languages
    this.initializeJavaScriptParser();
    this.initializeTypeScriptParser();
    this.initializePythonParser();
    this.initializeJavaParser();
    this.initializeGoParser();
  }

  private initializeJavaScriptParser(): void {
    const language = 'javascript';
    const extensions = ['.js', '.jsx', '.mjs', '.cjs'];
    
    const parser: CodeParser = {
      parse: async (content: string) => {
        // Simple AST parsing for JavaScript
        // In a real implementation, this would use a proper parser like acorn or babel
        return {
          type: 'Program',
          body: this.parseJavaScriptBody(content),
          sourceType: 'module'
        };
      },
      getLanguage: () => language,
      getExtensions: () => extensions
    };

    this.parsers.set(language, parser);
    extensions.forEach(ext => this.supportedLanguages.add(ext));
  }

  private initializeTypeScriptParser(): void {
    const language = 'typescript';
    const extensions = ['.ts', '.tsx'];
    
    const parser: CodeParser = {
      parse: async (content: string) => {
        // Simple AST parsing for TypeScript
        return {
          type: 'Program',
          body: this.parseTypeScriptBody(content),
          sourceType: 'module'
        };
      },
      getLanguage: () => language,
      getExtensions: () => extensions
    };

    this.parsers.set(language, parser);
    extensions.forEach(ext => this.supportedLanguages.add(ext));
  }

  private initializePythonParser(): void {
    const language = 'python';
    const extensions = ['.py'];
    
    const parser: CodeParser = {
      parse: async (content: string) => {
        // Simple AST parsing for Python
        return {
          type: 'Module',
          body: this.parsePythonBody(content)
        };
      },
      getLanguage: () => language,
      getExtensions: () => extensions
    };

    this.parsers.set(language, parser);
    extensions.forEach(ext => this.supportedLanguages.add(ext));
  }

  private initializeJavaParser(): void {
    const language = 'java';
    const extensions = ['.java'];
    
    const parser: CodeParser = {
      parse: async (content: string) => {
        // Simple AST parsing for Java
        return {
          type: 'CompilationUnit',
          types: this.parseJavaBody(content)
        };
      },
      getLanguage: () => language,
      getExtensions: () => extensions
    };

    this.parsers.set(language, parser);
    extensions.forEach(ext => this.supportedLanguages.add(ext));
  }

  private initializeGoParser(): void {
    const language = 'go';
    const extensions = ['.go'];
    
    const parser: CodeParser = {
      parse: async (content: string) => {
        // Simple AST parsing for Go
        return {
          type: 'File',
          declarations: this.parseGoBody(content)
        };
      },
      getLanguage: () => language,
      getExtensions: () => extensions
    };

    this.parsers.set(language, parser);
    extensions.forEach(ext => this.supportedLanguages.add(ext));
  }

  private parseJavaScriptBody(content: string): any[] {
    // Simple JavaScript parsing logic
    const lines = content.split('\n');
    const body = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('function ')) {
        body.push({
          type: 'FunctionDeclaration',
          id: { name: trimmed.split(' ')[1].split('(')[0] },
          params: [],
          body: { body: [] }
        });
      } else if (trimmed.startsWith('const ') || trimmed.startsWith('let ') || trimmed.startsWith('var ')) {
        body.push({
          type: 'VariableDeclaration',
          kind: trimmed.split(' ')[0],
          declarations: []
        });
      } else if (trimmed.startsWith('class ')) {
        body.push({
          type: 'ClassDeclaration',
          id: { name: trimmed.split(' ')[1].split(' ')[0] },
          body: { body: [] }
        });
      }
    }
    
    return body;
  }

  private parseTypeScriptBody(content: string): any[] {
    // Simple TypeScript parsing logic (similar to JS but with types)
    return this.parseJavaScriptBody(content);
  }

  private parsePythonBody(content: string): any[] {
    // Simple Python parsing logic
    const lines = content.split('\n');
    const body = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('def ')) {
        body.push({
          type: 'FunctionDef',
          name: trimmed.split(' ')[1].split('(')[0],
          args: { args: [] },
          body: []
        });
      } else if (trimmed.startsWith('class ')) {
        body.push({
          type: 'ClassDef',
          name: trimmed.split(' ')[1].split(':')[0],
          body: []
        });
      }
    }
    
    return body;
  }

  private parseJavaBody(content: string): any[] {
    // Simple Java parsing logic
    const lines = content.split('\n');
    const types = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('public class ') || trimmed.startsWith('class ')) {
        types.push({
          type: 'ClassOrInterfaceType',
          name: trimmed.split('class ')[1].split(' ')[0],
          members: []
        });
      }
    }
    
    return types;
  }

  private parseGoBody(content: string): any[] {
    // Simple Go parsing logic
    const lines = content.split('\n');
    const declarations = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('func ')) {
        declarations.push({
          type: 'FuncDecl',
          name: { name: trimmed.split(' ')[1].split('(')[0] },
          type: { params: [], results: [] }
        });
      } else if (trimmed.startsWith('type ')) {
        declarations.push({
          type: 'TypeSpec',
          name: { name: trimmed.split(' ')[1] },
          type: {}
        });
      }
    }
    
    return declarations;
  }

  private extractDependencies(content: string, language: string): string[] {
    const dependencies: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (language === 'javascript' || language === 'typescript') {
        if (trimmed.startsWith('import ') && trimmed.includes('from')) {
          const match = trimmed.match(/from\s+['"]([^'"]+)['"]/);
          if (match) {
            dependencies.push(match[1]);
          }
        } else if (trimmed.startsWith('require(')) {
          const match = trimmed.match(/require\(['"]([^'"]+)['"]\)/);
          if (match) {
            dependencies.push(match[1]);
          }
        }
      } else if (language === 'python') {
        if (trimmed.startsWith('import ')) {
          dependencies.push(trimmed.split(' ')[1]);
        } else if (trimmed.startsWith('from ')) {
          const parts = trimmed.split(' ');
          if (parts.length >= 4) {
            dependencies.push(parts[1]);
          }
        }
      } else if (language === 'java') {
        if (trimmed.startsWith('import ')) {
          const match = trimmed.match(/import\s+([^;]+);/);
          if (match) {
            dependencies.push(match[1]);
          }
        }
      } else if (language === 'go') {
        if (trimmed.startsWith('import ')) {
          const match = trimmed.match(/import\s+["`]([^"`]+)["`]/);
          if (match) {
            dependencies.push(match[1]);
          }
        }
      }
    }
    
    return dependencies;
  }

  private extractExports(content: string, language: string): string[] {
    const exports: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (language === 'javascript' || language === 'typescript') {
        if (trimmed.startsWith('export ')) {
          if (trimmed.includes('function ')) {
            const match = trimmed.match(/function\s+(\w+)/);
            if (match) exports.push(match[1]);
          } else if (trimmed.includes('class ')) {
            const match = trimmed.match(/class\s+(\w+)/);
            if (match) exports.push(match[1]);
          } else if (trimmed.includes('const ') || trimmed.includes('let ') || trimmed.includes('var ')) {
            const match = trimmed.match(/export\s+(?:const|let|var)\s+(\w+)/);
            if (match) exports.push(match[1]);
          }
        }
      }
    }
    
    return exports;
  }

  private extractImports(content: string, language: string): string[] {
    // Similar to dependencies but more specific
    return this.extractDependencies(content, language);
  }

  private calculateComplexity(ast: any): number {
    // Simple complexity calculation based on AST structure
    let complexity = 1;
    
    const traverse = (node: any) => {
      if (!node || typeof node !== 'object') return;
      
      if (node.type === 'IfStatement' || node.type === 'WhileStatement' || 
          node.type === 'ForStatement' || node.type === 'SwitchStatement') {
        complexity++;
      }
      
      for (const key in node) {
        if (typeof node[key] === 'object') {
          traverse(node[key]);
        }
      }
    };
    
    traverse(ast);
    return complexity;
  }

  private identifyPatterns(ast: any): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Identify common patterns
    const traverse = (node: any, path: string = '') => {
      if (!node || typeof node !== 'object') return;
      
      if (node.type === 'FunctionDeclaration') {
        patterns.push({
          type: 'function',
          name: node.id?.name || 'anonymous',
          confidence: 0.9,
          location: { start: 0, end: 0 }
        });
      } else if (node.type === 'ClassDeclaration') {
        patterns.push({
          type: 'class',
          name: node.id?.name || 'anonymous',
          confidence: 0.9,
          location: { start: 0, end: 0 }
        });
      }
      
      for (const key in node) {
        if (typeof node[key] === 'object') {
          traverse(node[key], `${path}.${key}`);
        }
      }
    };
    
    traverse(ast);
    return patterns;
  }

  private identifyIssues(content: string, language: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Basic linting rules
      if (trimmed.length > 100) {
        issues.push({
          type: 'warning',
          message: 'Line too long',
          severity: 1,
          location: { line: i + 1, column: 0 },
          suggestion: 'Consider breaking this line into multiple lines'
        });
      }
      
      if (language === 'javascript' || language === 'typescript') {
        if (trimmed.includes('var ')) {
          issues.push({
            type: 'warning',
            message: 'Use of var detected',
            severity: 2,
            location: { line: i + 1, column: 0 },
            suggestion: 'Consider using const or let instead'
          });
        }
      }
    }
    
    return issues;
  }

  private buildProjectStructure(analyses: AnalysisResult[]): any {
    // Build project structure from analysis results
    return {
      totalFiles: analyses.length,
      totalLines: analyses.reduce((sum, analysis) => sum + (analysis.ast?.body?.length || 0), 0),
      languages: [...new Set(analyses.map(a => a.dependencies?.join(',') || ''))].filter(Boolean)
    };
  }

  private identifyProjectPatterns(analyses: AnalysisResult[]): Pattern[] {
    const patterns: Pattern[] = [];
    const patternCounts = new Map<string, number>();
    
    analyses.forEach(analysis => {
      analysis.patterns.forEach(pattern => {
        const key = `${pattern.type}:${pattern.name}`;
        patternCounts.set(key, (patternCounts.get(key) || 0) + 1);
      });
    });
    
    patternCounts.forEach((count, key) => {
      const [type, name] = key.split(':');
      patterns.push({
        type,
        name,
        confidence: Math.min(count / analyses.length, 1),
        location: { start: 0, end: 0 }
      });
    });
    
    return patterns;
  }

  private buildDependencyGraph(analyses: AnalysisResult[]): any {
    const dependencies = new Set<string>();
    
    analyses.forEach(analysis => {
      analysis.dependencies.forEach(dep => dependencies.add(dep));
    });
    
    return {
      totalDependencies: dependencies.size,
      dependencies: Array.from(dependencies)
    };
  }

  private calculateProjectMetrics(analyses: AnalysisResult[]): any {
    const totalComplexity = analyses.reduce((sum, analysis) => sum + analysis.complexity, 0);
    const averageComplexity = totalComplexity / analyses.length;
    
    return {
      totalComplexity,
      averageComplexity,
      fileCount: analyses.length,
      totalIssues: analyses.reduce((sum, analysis) => sum + analysis.issues.length, 0)
    };
  }

  getSupportedLanguages(): string[] {
    return Array.from(this.supportedLanguages);
  }

  isLanguageSupported(language: string): boolean {
    return this.parsers.has(language);
  }
}