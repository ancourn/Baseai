import { 
  CodeContext, 
  ContextWindow, 
  ProjectStructure, 
  ProjectContext,
  UserHistory,
  UserPreferences 
} from '../core/types';

export class ContextManager {
  private cache: ContextCache;
  private indexer: CodeIndexer;
  private projectContexts: Map<string, ProjectContext>;
  private userHistories: Map<string, UserHistory>;

  constructor() {
    this.cache = new ContextCache();
    this.indexer = new CodeIndexer();
    this.projectContexts = new Map();
    this.userHistories = new Map();
  }

  async buildContext(request: any): Promise<ContextWindow> {
    const currentFile = request.context?.currentFile;
    const relatedFiles = await this.findRelatedFiles(currentFile);
    const projectContext = await this.getProjectContext(currentFile);
    const userHistory = await this.getUserHistory('default-user');
    
    return {
      currentFile: currentFile || '',
      surroundingCode: await this.getSurroundingCode(currentFile),
      relatedFiles,
      projectContext,
      userHistory
    };
  }

  async enrich(context?: CodeContext): Promise<CodeContext> {
    if (!context) {
      return {
        currentFile: '',
        relatedFiles: [],
        projectStructure: undefined,
        userPreferences: undefined
      };
    }

    const enrichedContext = { ...context };

    // Enhance with surrounding code
    if (context.currentFile) {
      enrichedContext.surroundingCode = await this.getSurroundingCode(context.currentFile);
    }

    // Enhance with related files
    if (context.currentFile) {
      enrichedContext.relatedFiles = await this.findRelatedFiles(context.currentFile);
    }

    // Enhance with project structure
    if (!context.projectStructure && context.currentFile) {
      enrichedContext.projectStructure = await this.getProjectStructure(context.currentFile);
    }

    // Enhance with user preferences
    if (!context.userPreferences) {
      enrichedContext.userPreferences = await this.getUserPreferences('default-user');
    }

    return enrichedContext;
  }

  async getProjectContext(projectPath: string): Promise<ProjectContext> {
    // Check cache first
    const cached = this.cache.get(`project:${projectPath}`);
    if (cached) {
      return cached;
    }

    // Build project context
    const projectContext = await this.buildProjectContext(projectPath);
    
    // Cache the result
    this.cache.set(`project:${projectPath}`, projectContext);
    
    return projectContext;
  }

  async getUserHistory(userId: string): Promise<UserHistory> {
    // Check cache first
    const cached = this.cache.get(`user:${userId}`);
    if (cached) {
      return cached;
    }

    // Get or create user history
    let userHistory = this.userHistories.get(userId);
    if (!userHistory) {
      userHistory = {
        recentPrompts: [],
        preferredPatterns: [],
        commonMistakes: []
      };
      this.userHistories.set(userId, userHistory);
    }
    
    // Cache the result
    this.cache.set(`user:${userId}`, userHistory);
    
    return userHistory;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    // Check cache first
    const cached = this.cache.get(`preferences:${userId}`);
    if (cached) {
      return cached;
    }

    // Default user preferences
    const preferences: UserPreferences = {
      preferredLanguage: 'typescript',
      codeStyle: 'functional',
      commentStyle: 'detailed',
      testingFramework: 'jest',
      linter: 'eslint'
    };
    
    // Cache the result
    this.cache.set(`preferences:${userId}`, preferences);
    
    return preferences;
  }

  async addUserPrompt(userId: string, prompt: string): Promise<void> {
    const userHistory = await this.getUserHistory(userId);
    
    // Add to recent prompts (keep last 10)
    userHistory.recentPrompts.unshift(prompt);
    if (userHistory.recentPrompts.length > 10) {
      userHistory.recentPrompts = userHistory.recentPrompts.slice(0, 10);
    }
    
    // Update cache
    this.cache.set(`user:${userId}`, userHistory);
  }

  async addPreferredPattern(userId: string, pattern: string): Promise<void> {
    const userHistory = await this.getUserHistory(userId);
    
    // Add to preferred patterns (keep last 5)
    if (!userHistory.preferredPatterns.includes(pattern)) {
      userHistory.preferredPatterns.unshift(pattern);
      if (userHistory.preferredPatterns.length > 5) {
        userHistory.preferredPatterns = userHistory.preferredPatterns.slice(0, 5);
      }
    }
    
    // Update cache
    this.cache.set(`user:${userId}`, userHistory);
  }

  async addCommonMistake(userId: string, mistake: string): Promise<void> {
    const userHistory = await this.getUserHistory(userId);
    
    // Add to common mistakes (keep last 5)
    if (!userHistory.commonMistakes.includes(mistake)) {
      userHistory.commonMistakes.unshift(mistake);
      if (userHistory.commonMistakes.length > 5) {
        userHistory.commonMistakes = userHistory.commonMistakes.slice(0, 5);
      }
    }
    
    // Update cache
    this.cache.set(`user:${userId}`, userHistory);
  }

  private async findRelatedFiles(currentFile?: string): Promise<string[]> {
    if (!currentFile) return [];
    
    // Use semantic search to find related files
    return await this.indexer.findRelated(currentFile);
  }

  private async getSurroundingCode(filePath?: string): Promise<string> {
    if (!filePath) return '';
    
    // Get code around the cursor or current position
    return await this.cache.getFileContent(filePath);
  }

  private async getProjectStructure(currentFile: string): Promise<ProjectStructure> {
    // Extract project root from file path
    const projectRoot = this.extractProjectRoot(currentFile);
    
    return {
      root: projectRoot,
      files: await this.getProjectFiles(projectRoot),
      dependencies: await this.getProjectDependencies(projectRoot),
      config: await this.getProjectConfig(projectRoot)
    };
  }

  private async buildProjectContext(projectPath: string): Promise<ProjectContext> {
    const structure = await this.getProjectStructure(projectPath);
    
    return {
      language: this.detectPrimaryLanguage(structure),
      framework: this.detectFramework(structure),
      dependencies: structure.dependencies.map(d => d.name),
      structure
    };
  }

  private extractProjectRoot(filePath: string): string {
    // Simple extraction - in a real implementation, this would be more sophisticated
    const parts = filePath.split('/');
    return parts.slice(0, -1).join('/');
  }

  private async getProjectFiles(projectRoot: string): Promise<any[]> {
    // In a real implementation, this would read the file system
    return [];
  }

  private async getProjectDependencies(projectRoot: string): Promise<any[]> {
    // In a real implementation, this would read package.json or similar
    return [];
  }

  private async getProjectConfig(projectRoot: string): Promise<any> {
    // In a real implementation, this would read config files
    return {};
  }

  private detectPrimaryLanguage(structure: ProjectStructure): string {
    // Simple language detection based on file extensions
    const extensionCounts = new Map<string, number>();
    
    structure.files.forEach(file => {
      const extension = file.path.split('.').pop()?.toLowerCase();
      if (extension) {
        extensionCounts.set(extension, (extensionCounts.get(extension) || 0) + 1);
      }
    });
    
    const mostCommon = Array.from(extensionCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];
    
    if (!mostCommon) return 'javascript';
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'go': 'go',
      'rs': 'rust',
      'cpp': 'cpp',
      'c': 'c'
    };
    
    return languageMap[mostCommon[0]] || 'javascript';
  }

  private detectFramework(structure: ProjectStructure): string | undefined {
    // Simple framework detection based on dependencies and file structure
    const dependencies = structure.dependencies.map(d => d.name.toLowerCase());
    
    if (dependencies.includes('react')) return 'react';
    if (dependencies.includes('next')) return 'nextjs';
    if (dependencies.includes('vue')) return 'vue';
    if (dependencies.includes('angular')) return 'angular';
    if (dependencies.includes('express')) return 'express';
    if (dependencies.includes('fastapi')) return 'fastapi';
    if (dependencies.includes('django')) return 'django';
    if (dependencies.includes('flask')) return 'flask';
    
    return undefined;
  }

  clearCache(): void {
    this.cache.clear();
    this.projectContexts.clear();
    this.userHistories.clear();
  }
}

class ContextCache {
  private cache: Map<string, any>;
  private timestamps: Map<string, number>;
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds

  constructor(maxSize: number = 1000, ttl: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.timestamps = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): any {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return null;
    
    // Check if expired
    if (Date.now() - timestamp > this.ttl) {
      this.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    // Check if we need to evict
    if (this.cache.size >= this.maxSize) {
      this.evict();
    }
    
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  private evict(): void {
    // Simple LRU eviction
    const oldestKey = Array.from(this.timestamps.entries())
      .sort((a, b) => a[1] - b[1])[0]?.[0];
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  async getFileContent(filePath: string): Promise<string> {
    // Check cache first
    const cached = this.get(`file:${filePath}`);
    if (cached) {
      return cached;
    }
    
    // In a real implementation, this would read from the file system
    const content = '';
    
    // Cache the result
    this.set(`file:${filePath}`, content);
    
    return content;
  }
}

class CodeIndexer {
  private index: Map<string, string[]>;
  private fileContents: Map<string, string>;

  constructor() {
    this.index = new Map();
    this.fileContents = new Map();
  }

  async findRelated(filePath: string): Promise<string[]> {
    // Simple related file finding based on file names and content
    const related: string[] = [];
    const fileName = filePath.split('/').pop()?.toLowerCase() || '';
    
    // Find files with similar names
    for (const [indexedPath] of this.index) {
      if (indexedPath === filePath) continue;
      
      const indexedFileName = indexedPath.split('/').pop()?.toLowerCase() || '';
      
      // Check for similar file names
      if (this.isSimilarFileName(fileName, indexedFileName)) {
        related.push(indexedPath);
      }
    }
    
    return related.slice(0, 5); // Return top 5 related files
  }

  async indexFile(filePath: string, content: string): Promise<void> {
    // Store file content
    this.fileContents.set(filePath, content);
    
    // Extract keywords and index them
    const keywords = this.extractKeywords(content);
    
    keywords.forEach(keyword => {
      if (!this.index.has(keyword)) {
        this.index.set(keyword, []);
      }
      
      const files = this.index.get(keyword)!;
      if (!files.includes(filePath)) {
        files.push(filePath);
      }
    });
  }

  private isSimilarFileName(name1: string, name2: string): boolean {
    // Simple similarity check
    const base1 = name1.split('.')[0];
    const base2 = name2.split('.')[0];
    
    return base1 === base2 || 
           base1.includes(base2) || 
           base2.includes(base1) ||
           this.calculateSimilarity(base1, base2) > 0.7;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private extractKeywords(content: string): string[] {
    // Simple keyword extraction
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    return [...new Set(words)];
  }

  clearIndex(): void {
    this.index.clear();
    this.fileContents.clear();
  }
}