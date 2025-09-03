import { NextRequest, NextResponse } from 'next/server'

// Chinese AI Image Generation Service
class ChineseImageGenerationService {
  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error occurred'
  }

  private async callBaiduERNIEImage(prompt: string, options?: any) {
    try {
      // Baidu ERNIE Image Generation API
      const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/text2image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BAIDU_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          text: prompt,
          resolution: options?.resolution || '1024x1024',
          style: options?.style || 'realistic',
          num: options?.num || 1
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          images: data.data.map((item: any) => item.image)
        }
      } else {
        throw new Error(data.error_msg || 'No response from Baidu ERNIE Image')
      }
    } catch (error) {
      console.error('Baidu ERNIE Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callAlibabaQianwenImage(prompt: string, options?: any) {
    try {
      // Alibaba Qianwen Image Generation API
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ALIBABA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'stable-diffusion-xl',
          input: {
            prompt: prompt
          },
          parameters: {
            size: options?.size || '1024x1024',
            n: options?.n || 1,
            steps: options?.steps || 20
          }
        })
      })

      const data = await response.json()
      
      if (data.output && data.output.results) {
        return {
          success: true,
          images: data.output.results.map((item: any) => item.url)
        }
      } else {
        throw new Error(data.error?.message || 'No response from Alibaba Qianwen Image')
      }
    } catch (error) {
      console.error('Alibaba Qianwen Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callTencentHunyuanImage(prompt: string, options?: any) {
    try {
      // Tencent Hunyuan Image Generation API
      const response = await fetch('https://hunyuan.tencentcloudapi.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TC-Action': 'TextToImage',
          'X-TC-Version': '2023-09-01',
          'X-TC-Region': 'ap-beijing',
          'Authorization': `TC3-HMAC-SHA256 Credential=${process.env.TENCENT_SECRET_ID}`
        },
        body: JSON.stringify({
          Prompt: prompt,
          Resolution: options?.resolution || '1024x1024',
          Style: options?.style || 'realistic',
          Num: options?.num || 1
        })
      })

      const data = await response.json()
      
      if (data.Response && data.Response.ResultUrl) {
        return {
          success: true,
          images: [data.Response.ResultUrl]
        }
      } else {
        throw new Error(data.Response?.Error?.Message || 'No response from Tencent Hunyuan Image')
      }
    } catch (error) {
      console.error('Tencent Hunyuan Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callZhipuGLMImage(prompt: string, options?: any) {
    try {
      // Zhipu GLM Image Generation API
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'cogview-3',
          prompt: prompt,
          n: options?.n || 1,
          size: options?.size || '1024x1024',
          quality: options?.quality || 'standard'
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          images: data.data.map((item: any) => item.url)
        }
      } else {
        throw new Error(data.error?.message || 'No response from Zhipu GLM Image')
      }
    } catch (error) {
      console.error('Zhipu GLM Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callMiniMaxImage(prompt: string, options?: any) {
    try {
      // MiniMax Image Generation API
      const response = await fetch('https://api.minimax.chat/v1/image_generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'abab6.5s-image',
          prompt: prompt,
          size: options?.size || '1024x1024',
          n: options?.n || 1,
          group_id: process.env.MINIMAX_GROUP_ID
        })
      })

      const data = await response.json()
      
      if (data.images && data.images.length > 0) {
        return {
          success: true,
          images: data.images
        }
      } else {
        throw new Error(data.error || 'No response from MiniMax Image')
      }
    } catch (error) {
      console.error('MiniMax Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callSenseTimeImage(prompt: string, options?: any) {
    try {
      // SenseTime Image Generation API
      const response = await fetch('https://api.sensetime.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENSETIME_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sensetime-image',
          prompt: prompt,
          n: options?.n || 1,
          size: options?.size || '1024x1024',
          quality: options?.quality || 'standard'
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          images: data.data.map((item: any) => item.url)
        }
      } else {
        throw new Error(data.error?.message || 'No response from SenseTime Image')
      }
    } catch (error) {
      console.error('SenseTime Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callDeepSeekImage(prompt: string, options?: any) {
    try {
      // DeepSeek Image Generation API
      const response = await fetch('https://api.deepseek.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-image',
          prompt: prompt,
          n: options?.n || 1,
          size: options?.size || '1024x1024',
          quality: options?.quality || 'standard'
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          images: data.data.map((item: any) => item.url)
        }
      } else {
        throw new Error(data.error?.message || 'No response from DeepSeek Image')
      }
    } catch (error) {
      console.error('DeepSeek Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callMoonshotImage(prompt: string, options?: any) {
    try {
      // Moonshot Image Generation API
      const response = await fetch('https://api.moonshot.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'moonshot-image',
          prompt: prompt,
          n: options?.n || 1,
          size: options?.size || '1024x1024',
          quality: options?.quality || 'standard'
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          images: data.data.map((item: any) => item.url)
        }
      } else {
        throw new Error(data.error?.message || 'No response from Moonshot Image')
      }
    } catch (error) {
      console.error('Moonshot Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callYiImage(prompt: string, options?: any) {
    try {
      // Yi Image Generation API
      const response = await fetch('https://api.lingyiwanwu.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.YI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'yi-image',
          prompt: prompt,
          n: options?.n || 1,
          size: options?.size || '1024x1024',
          quality: options?.quality || 'standard'
        })
      })

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return {
          success: true,
          images: data.data.map((item: any) => item.url)
        }
      } else {
        throw new Error(data.error?.message || 'No response from Yi Image')
      }
    } catch (error) {
      console.error('Yi Image API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  async generateImage(prompt: string, model: string, options?: any) {
    // Determine the provider based on the model ID
    if (model.startsWith('ernie-')) {
      return this.callBaiduERNIEImage(prompt, options)
    } else if (model.startsWith('qwen-') || model.startsWith('qwen1.5-') || model === 'qwen-72b') {
      return this.callAlibabaQianwenImage(prompt, options)
    } else if (model.startsWith('hunyuan-')) {
      return this.callTencentHunyuanImage(prompt, options)
    } else if (model.startsWith('glm-')) {
      return this.callZhipuGLMImage(prompt, options)
    } else if (model.startsWith('minimax-')) {
      return this.callMiniMaxImage(prompt, options)
    } else if (model.startsWith('sensechat-')) {
      return this.callSenseTimeImage(prompt, options)
    } else if (model.startsWith('deepseek-')) {
      return this.callDeepSeekImage(prompt, options)
    } else if (model.startsWith('moonshot-')) {
      return this.callMoonshotImage(prompt, options)
    } else if (model.startsWith('yi-')) {
      return this.callYiImage(prompt, options)
    } else if (model.includes('taiyi')) {
      return this.callBaiduERNIEImage(prompt, options) // Fallback for Taiyi
    } else if (model.includes('kolors')) {
      return this.callAlibabaQianwenImage(prompt, options) // Fallback for Kolors
    } else if (model.includes('pangu')) {
      return this.callTencentHunyuanImage(prompt, options) // Fallback for Pangu
    } else {
      return {
        success: false,
        error: `Unsupported Chinese AI image model: ${model}. Please check the model ID and try again.`
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, size, quality, n } = await request.json()

    if (!prompt || !model) {
      return NextResponse.json(
        { success: false, error: 'Prompt and model are required' },
        { status: 400 }
      )
    }

    const chineseImageService = new ChineseImageGenerationService()
    const result = await chineseImageService.generateImage(prompt, model, {
      size,
      quality,
      n
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Chinese AI image generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}