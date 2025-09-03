"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send, Copy, Download, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type TextGenerationProps = Record<string, never>

export function TextGeneration({}: TextGenerationProps) {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("gpt-4")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const models = [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "claude-3", name: "Claude 3", provider: "Anthropic" },
    { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
    { id: "llama-2", name: "Llama 2", provider: "Meta" },
    { id: "mistral", name: "Mistral", provider: "Mistral AI" },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/ai/text-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          temperature,
          maxTokens,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setResponse(data.response)
      } else {
        throw new Error(data.error || "Generation failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate text",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    toast({
      title: "Success",
      description: "Text copied to clipboard",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([response], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated-text.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Text Generation
          </CardTitle>
          <CardDescription>
            Generate text using advanced AI models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Model</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <span>{m.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {m.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Temperature: {temperature}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Conservative</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Max Tokens: {maxTokens}</label>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Prompt</label>
            <Textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Text</CardTitle>
          <CardDescription>
            AI-generated response will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {response ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg min-h-[300px] max-h-[400px] overflow-y-auto">
                <p className="whitespace-pre-wrap text-sm">{response}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Generated text will appear here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}