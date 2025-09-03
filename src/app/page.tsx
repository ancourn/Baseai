'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Play, Code, Brain, Settings, History, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedCode {
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

interface AnalysisResult {
  complexity: number;
  dependencies: string[];
  exports: string[];
  imports: string[];
  patterns: Array<{
    type: string;
    name: string;
    confidence: number;
  }>;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    severity: number;
    location: {
      line: number;
      column: number;
    };
    suggestion?: string;
  }>;
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [framework, setFramework] = useState('none');
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' }
  ];

  const frameworks = [
    { value: 'none', label: 'None' },
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'express', label: 'Express' },
    { value: 'fastapi', label: 'FastAPI' },
    { value: 'django', label: 'Django' },
    { value: 'flask', label: 'Flask' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-copilot/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          language,
          framework: framework !== 'none' ? framework : undefined,
          options: {
            includeTests: true,
            includeComments: true,
            complexity: 'medium'
          }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedCode(result.data);
        toast.success('Code generated successfully!');
      } else {
        toast.error(result.error || 'Failed to generate code');
      }
    } catch (error) {
      toast.error('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!generatedCode?.code) {
      toast.error('Please generate code first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai-copilot/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: generatedCode.code,
          language,
          filePath: 'generated.ts'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalysisResult(result.data);
        toast.success('Code analyzed successfully!');
      } else {
        toast.error(result.error || 'Failed to analyze code');
      }
    } catch (error) {
      toast.error('Failed to analyze code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadCode = () => {
    if (!generatedCode?.code) return;
    
    const blob = new Blob([generatedCode.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">AI Copilot</h1>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground text-center max-w-2xl">
            Generate, analyze, and optimize code with AI-powered assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Configure your code generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Framework (Optional)</label>
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map((fw) => (
                        <SelectItem key={fw.value} value={fw.value}>
                          {fw.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Prompt</label>
                  <Textarea
                    placeholder="Describe what you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Generated Code
                </CardTitle>
                <CardDescription>
                  AI-generated code with analysis and suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="generate">Code</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="tests">Tests</TabsTrigger>
                  </TabsList>

                  <TabsContent value="generate" className="space-y-4">
                    {generatedCode ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {language}
                            </Badge>
                            {framework && (
                              <Badge variant="outline">
                                {framework}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getConfidenceColor(generatedCode.confidence)}`}></div>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(generatedCode.confidence * 100)}% confidence
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(generatedCode.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={downloadCode}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAnalyze}
                              disabled={isAnalyzing}
                            >
                              {isAnalyzing ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              ) : (
                                <Brain className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <ScrollArea className="h-[400px] w-full">
                          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                            <code>{generatedCode.code}</code>
                          </pre>
                        </ScrollArea>

                        {generatedCode.explanation && (
                          <div>
                            <h4 className="font-medium mb-2">Explanation</h4>
                            <p className="text-sm text-muted-foreground">
                              {generatedCode.explanation}
                            </p>
                          </div>
                        )}

                        {generatedCode.metadata && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Model:</span>
                              <span className="text-muted-foreground ml-2">
                                {generatedCode.metadata.model}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Tokens:</span>
                              <span className="text-muted-foreground ml-2">
                                {generatedCode.metadata.tokensUsed}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Time:</span>
                              <span className="text-muted-foreground ml-2">
                                {generatedCode.metadata.processingTime}ms
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        <div className="text-center">
                          <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Generated code will appear here</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    {analysisResult ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium">Complexity:</span>
                            <span className="ml-2">{analysisResult.complexity}</span>
                          </div>
                          <div>
                            <span className="font-medium">Dependencies:</span>
                            <span className="ml-2">{analysisResult.dependencies.length}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Patterns</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.patterns.map((pattern, index) => (
                              <Badge key={index} variant="outline">
                                {pattern.type}: {pattern.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Issues</h4>
                          <ScrollArea className="h-[200px] w-full">
                            <div className="space-y-2">
                              {analysisResult.issues.map((issue, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <Badge variant={getIssueColor(issue.type)}>
                                    {issue.type}
                                  </Badge>
                                  <div className="flex-1">
                                    <p className="text-sm">{issue.message}</p>
                                    {issue.suggestion && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Suggestion: {issue.suggestion}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        <div className="text-center">
                          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Analysis results will appear here</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="suggestions" className="space-y-4">
                    {generatedCode?.suggestions ? (
                      <div className="space-y-2">
                        {generatedCode.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            <p className="text-sm">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        <div className="text-center">
                          <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Suggestions will appear here</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="tests" className="space-y-4">
                    {generatedCode?.tests ? (
                      <ScrollArea className="h-[400px] w-full">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{generatedCode.tests}</code>
                        </pre>
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        <div className="text-center">
                          <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Generated tests will appear here</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}