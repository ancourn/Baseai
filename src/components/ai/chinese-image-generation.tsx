"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send, Download, Sparkles, Filter, Globe, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AI_MODELS, getModelsByType } from "@/lib/ai-registry"

type ChineseImageGenerationProps = Record<string, never>

export function ChineseAIImageGeneration({}: ChineseImageGenerationProps) {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("ernie-image")
  const [size, setSize] = useState("1024x1024")
  const [quality, setQuality] = useState("standard")
  const [n, setN] = useState(1)
  const [response, setResponse] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [availableModels, setAvailableModels] = useState(getChineseImageModels())
  const [filterProvider, setFilterProvider] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const { toast } = useToast()

  function getChineseImageModels() {
    return AI_MODELS.filter(model => 
      model.type === 'image' && 
      (model.provider === 'Baidu' || 
       model.provider === 'Alibaba' || 
       model.provider === 'Tencent' || 
       model.provider === 'Zhipu AI' || 
       model.provider === 'MiniMax' || 
       model.provider === 'SenseTime' || 
       model.provider === 'DeepSeek' || 
       model.provider === 'Moonshot' || 
       model.provider === '01.AI' ||
       model.provider === 'Taiyi AI' ||
       model.provider === 'Kolors' ||
       model.provider === 'Pangu')
    )
  }

  useEffect(() => {
    // Filter models based on selected filters
    let filtered = getChineseImageModels()
    
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
      const res = await fetch("/api/ai/chinese-image-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          size,
          quality,
          n
        }),
      })

      const data = await res.json()
      if (data.success) {
        setResponse(data.images || [])
      } else {
        throw new Error(data.error || "生成失败")
      }
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "生成图像失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `chinese-ai-image-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getUniqueProviders = () => {
    const providers = [...new Set(getChineseImageModels().map(m => m.provider))]
    return providers
  }

  const getUniqueCategories = () => {
    const categories = [...new Set(getChineseImageModels().map(m => m.category))]
    return categories
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Input Section */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            中文AI图像生成
          </CardTitle>
          <CardDescription>
            使用中国AI模型生成图像 - 支持百度、阿里、腾讯等
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
            <label className="text-sm font-medium mb-2 block">尺寸</label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="512x512">512x512</SelectItem>
                <SelectItem value="768x768">768x768</SelectItem>
                <SelectItem value="1024x1024">1024x1024</SelectItem>
                <SelectItem value="1024x768">1024x768</SelectItem>
                <SelectItem value="768x1024">768x1024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">质量</label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">标准</SelectItem>
                <SelectItem value="hd">高清</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">生成数量: {n}</label>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">提示词</label>
            <Textarea
              placeholder="请输入图像描述..."
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
          <CardTitle>生成的图像</CardTitle>
          <CardDescription>
            {response.length > 0 ? `生成了 ${response.length} 张图像` : "生成的图像将显示在这里"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {response.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {response.map((imageUrl, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(imageUrl, index)}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载图像 {index + 1}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-slate-400">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>生成的图像将显示在这里</p>
                <p className="text-sm mt-2">选择模型并输入提示词开始</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}