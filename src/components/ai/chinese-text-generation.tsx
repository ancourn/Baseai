"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send, Copy, Download, Sparkles, Filter, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AI_MODELS, getModelsByType } from "@/lib/ai-registry"

type ChineseTextGenerationProps = Record<string, never>

export function ChineseAITextGeneration({}: ChineseTextGenerationProps) {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("glm-4")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [systemPrompt, setSystemPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [availableModels, setAvailableModels] = useState(getChineseTextModels())
  const [filterProvider, setFilterProvider] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const { toast } = useToast()

  function getChineseTextModels() {
    return AI_MODELS.filter(model => 
      model.type === 'text' && 
      (model.provider === 'Baidu' || 
       model.provider === 'Alibaba' || 
       model.provider === 'Tencent' || 
       model.provider === 'Zhipu AI' || 
       model.provider === 'MiniMax' || 
       model.provider === 'SenseTime' || 
       model.provider === 'DeepSeek' || 
       model.provider === 'Moonshot' || 
       model.provider === '01.AI' ||
       model.provider === 'Shanghai AI Lab' ||
       model.provider === 'Baichuan AI' ||
       model.provider === 'XVERSE' ||
       model.provider === 'Skywork AI' ||
       model.provider === 'TeleAI')
    )
  }

  useEffect(() => {
    // Filter models based on selected filters
    let filtered = getChineseTextModels()
    
    if (filterProvider !== "all") {
      filtered = filtered.filter(m => m.provider === filterProvider)
    }
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(m => m.category === filterCategory)
    }
    
    setAvailableModels(filtered)
  }, [filterProvider, filterCategory])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "错误",
        description: "请输入提示词",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/ai/chinese-text-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          temperature,
          maxTokens,
          systemPrompt
        }),
      })

      const data = await res.json()
      if (data.success) {
        setResponse(data.response)
      } else {
        throw new Error(data.error || "生成失败")
      }
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "生成文本失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    toast({
      title: "成功",
      description: "文本已复制到剪贴板",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([response], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated-text-chinese.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getUniqueProviders = () => {
    const providers = [...new Set(getChineseTextModels().map(m => m.provider))]
    return providers
  }

  const getUniqueCategories = () => {
    const categories = [...new Set(getChineseTextModels().map(m => m.category))]
    return categories
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Input Section */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            中文AI文本生成
          </CardTitle>
          <CardDescription>
            使用中国AI模型生成文本 - 支持百度、阿里、腾讯等
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">筛选</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium mb-1 block">提供商</label>
                <Select value={filterProvider} onValueChange={setFilterProvider}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部提供商</SelectItem>
                    {getUniqueProviders().map(provider => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1 block">类别</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类别</SelectItem>
                    {getUniqueCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'proprietary' ? '专有' : '开源'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">模型 ({availableModels.length} 可用)</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="选择一个模型" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {availableModels.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{m.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {m.provider}
                        </Badge>
                        <Badge variant={m.category === 'proprietary' ? 'default' : 'secondary'} className="text-xs">
                          {m.category === 'proprietary' ? '专有' : '开源'}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500">
                        {m.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">温度: {temperature}</label>
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
              <span>保守</span>
              <span>创意</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">最大令牌: {maxTokens}</label>
            <input
              type="range"
              min="100"
              max="8000"
              step="100"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">系统提示词 (可选)</label>
            <Textarea
              placeholder="你是一个有帮助的助手..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">提示词</label>
            <Textarea
              placeholder="请输入您的提示词..."
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
                生成中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                生成
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>生成的文本</CardTitle>
          <CardDescription>
            {response ? "AI生成的响应" : "响应将显示在这里"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {response ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg min-h-[400px] max-h-[600px] overflow-y-auto">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{response}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-slate-400">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>生成的文本将显示在这里</p>
                <p className="text-sm mt-2">选择模型并输入提示词开始</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}