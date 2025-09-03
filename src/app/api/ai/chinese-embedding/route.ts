import { NextRequest, NextResponse } from 'next/server'

// Chinese AI Embedding Service
class ChineseEmbeddingService {
  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error occurred'
  }

  private async callBaiduEmbedding(text: string, model: string) {
    try {
      // Baidu Embedding API
      const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/embedding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BAIDU_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          input: text,
          model: model
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          embeddings: data.data[0].embedding
        }
      } else {
        throw new Error(data.error_msg || 'No response from Baidu Embedding')
      }
    } catch (error) {
      console.error('Baidu Embedding API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callAlibabaEmbedding(text: string, model: string) {
    try {
      // Alibaba Embedding API
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ALIBABA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          input: {
            texts: [text]
          }
        })
      })

      const data = await response.json()
      
      if (data.output && data.output.embeddings && data.output.embeddings.length > 0) {
        return {
          success: true,
          embeddings: data.output.embeddings[0].embedding
        }
      } else {
        throw new Error(data.error?.message || 'No response from Alibaba Embedding')
      }
    } catch (error) {
      console.error('Alibaba Embedding API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callZhipuEmbedding(text: string, model: string) {
    try {
      // Zhipu Embedding API
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          input: text
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          embeddings: data.data[0].embedding
        }
      } else {
        throw new Error(data.error?.message || 'No response from Zhipu Embedding')
      }
    } catch (error) {
      console.error('Zhipu Embedding API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callDeepSeekEmbedding(text: string, model: string) {
    try {
      // DeepSeek Embedding API
      const response = await fetch('https://api.deepseek.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          input: text
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          embeddings: data.data[0].embedding
        }
      } else {
        throw new Error(data.error?.message || 'No response from DeepSeek Embedding')
      }
    } catch (error) {
      console.error('DeepSeek Embedding API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callMoonshotEmbedding(text: string, model: string) {
    try {
      // Moonshot Embedding API
      const response = await fetch('https://api.moonshot.cn/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          input: text
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          embeddings: data.data[0].embedding
        }
      } else {
        throw new Error(data.error?.message || 'No response from Moonshot Embedding')
      }
    } catch (error) {
      console.error('Moonshot Embedding API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callYiEmbedding(text: string, model: string) {
    try {
      // Yi Embedding API
      const response = await fetch('https://api.lingyiwanwu.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.YI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          input: text
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          embeddings: data.data[0].embedding
        }
      } else {
        throw new Error(data.error?.message || 'No response from Yi Embedding')
      }
    } catch (error) {
      console.error('Yi Embedding API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callBGEEmbedding(text: string, model: string) {
    try {
      // BGE Embedding via HuggingFace
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text
        })
      })

      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        return {
          success: true,
          embeddings: data
        }
      } else {
        throw new Error('No response from BGE Embedding')
      }
    } catch (error) {
      console.error('BGE Embedding API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callText2VecEmbedding(text: string, model: string) {
    try {
      // Text2Vec Embedding via HuggingFace
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text
        })
      })

      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        return {
          success: true,
          embeddings: data
        }
      } else {
        throw new Error('No response from Text2Vec Embedding')
      }
    } catch (error) {
      console.error('Text2Vec Embedding API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  async generateEmbedding(text: string, model: string) {
    // Determine the provider based on the model ID
    if (model.startsWith('ernie-')) {
      return this.callBaiduEmbedding(text, model)
    } else if (model.startsWith('qwen-')) {
      return this.callAlibabaEmbedding(text, model)
    } else if (model.startsWith('glm-')) {
      return this.callZhipuEmbedding(text, model)
    } else if (model.startsWith('deepseek-')) {
      return this.callDeepSeekEmbedding(text, model)
    } else if (model.startsWith('moonshot-')) {
      return this.callMoonshotEmbedding(text, model)
    } else if (model.startsWith('yi-')) {
      return this.callYiEmbedding(text, model)
    } else if (model.includes('bge-')) {
      return this.callBGEEmbedding(text, model)
    } else if (model.includes('text2vec-')) {
      return this.callText2VecEmbedding(text, model)
    } else {
      return {
        success: false,
        error: `Unsupported Chinese AI embedding model: ${model}. Please check the model ID and try again.`
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, model } = await request.json()

    if (!text || !model) {
      return NextResponse.json(
        { success: false, error: 'Text and model are required' },
        { status: 400 }
      )
    }

    const chineseEmbeddingService = new ChineseEmbeddingService()
    const result = await chineseEmbeddingService.generateEmbedding(text, model)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Chinese AI embedding error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}