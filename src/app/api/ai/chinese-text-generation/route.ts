import { NextRequest, NextResponse } from 'next/server'

// Chinese AI Service Handlers
class ChineseAIService {
  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error occurred'
  }

  private async callBaiduERNIE(prompt: string, model: string, options?: any) {
    try {
      // For ERNIE bot, we need to use the appropriate API
      const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BAIDU_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000
        })
      })

      const data = await response.json()
      
      if (data.result) {
        return {
          success: true,
          response: data.result
        }
      } else {
        throw new Error(data.error_msg || 'No response from Baidu ERNIE')
      }
    } catch (error) {
      console.error('Baidu ERNIE API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callAlibabaQianwen(prompt: string, model: string, options?: any) {
    try {
      // Alibaba Qianwen API call
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ALIBABA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          input: {
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          parameters: {
            temperature: options?.temperature || 0.7,
            max_tokens: options?.maxTokens || 1000
          }
        })
      })

      const data = await response.json()
      
      if (data.output && data.output.text) {
        return {
          success: true,
          response: data.output.text
        }
      } else {
        throw new Error(data.error?.message || 'No response from Alibaba Qianwen')
      }
    } catch (error) {
      console.error('Alibaba Qianwen API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callTencentHunyuan(prompt: string, model: string, options?: any) {
    try {
      // Tencent Hunyuan API call
      const response = await fetch('https://hunyuan.tencentcloudapi.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TC-Action': 'ChatCompletion',
          'X-TC-Version': '2023-09-01',
          'X-TC-Region': 'ap-beijing',
          'Authorization': `TC3-HMAC-SHA256 Credential=${process.env.TENCENT_SECRET_ID}`
        },
        body: JSON.stringify({
          Model: model,
          Messages: [
            {
              Role: 'user',
              Content: prompt
            }
          ],
          Temperature: options?.temperature || 0.7,
          MaxTokens: options?.maxTokens || 1000
        })
      })

      const data = await response.json()
      
      if (data.Response && data.Response.Choices && data.Response.Choices[0]) {
        return {
          success: true,
          response: data.Response.Choices[0].Message.Content
        }
      } else {
        throw new Error(data.Response?.Error?.Message || 'No response from Tencent Hunyuan')
      }
    } catch (error) {
      console.error('Tencent Hunyuan API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callZhipuGLM(prompt: string, model: string, options?: any) {
    try {
      // Zhipu GLM API call
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          success: true,
          response: data.choices[0].message.content
        }
      } else {
        throw new Error(data.error?.message || 'No response from Zhipu GLM')
      }
    } catch (error) {
      console.error('Zhipu GLM API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callMiniMax(prompt: string, model: string, options?: any) {
    try {
      // MiniMax API call
      const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              sender_type: 'USER',
              sender_name: 'user',
              text: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          tokens_to_generate: options?.maxTokens || 1000,
          group_id: process.env.MINIMAX_GROUP_ID
        })
      })

      const data = await response.json()
      
      if (data.reply && data.reply) {
        return {
          success: true,
          response: data.reply
        }
      } else {
        throw new Error(data.error || 'No response from MiniMax')
      }
    } catch (error) {
      console.error('MiniMax API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callSenseTime(prompt: string, model: string, options?: any) {
    try {
      // SenseTime API call
      const response = await fetch('https://api.sensetime.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENSETIME_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          success: true,
          response: data.choices[0].message.content
        }
      } else {
        throw new Error(data.error?.message || 'No response from SenseTime')
      }
    } catch (error) {
      console.error('SenseTime API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callDeepSeek(prompt: string, model: string, options?: any) {
    try {
      // DeepSeek API call
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          success: true,
          response: data.choices[0].message.content
        }
      } else {
        throw new Error(data.error?.message || 'No response from DeepSeek')
      }
    } catch (error) {
      console.error('DeepSeek API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callMoonshot(prompt: string, model: string, options?: any) {
    try {
      // Moonshot API call
      const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          success: true,
          response: data.choices[0].message.content
        }
      } else {
        throw new Error(data.error?.message || 'No response from Moonshot')
      }
    } catch (error) {
      console.error('Moonshot API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  private async callYi(prompt: string, model: string, options?: any) {
    try {
      // Yi API call
      const response = await fetch('https://api.lingyiwanwu.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.YI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          success: true,
          response: data.choices[0].message.content
        }
      } else {
        throw new Error(data.error?.message || 'No response from Yi')
      }
    } catch (error) {
      console.error('Yi API error:', error)
      return {
        success: false,
        error: this.getErrorMessage(error)
      }
    }
  }

  async generateText(prompt: string, model: string, options?: any) {
    // Determine the provider based on the model ID
    if (model.startsWith('ernie-')) {
      return this.callBaiduERNIE(prompt, model, options)
    } else if (model.startsWith('qwen-') || model.startsWith('qwen1.5-') || model === 'qwen-72b') {
      return this.callAlibabaQianwen(prompt, model, options)
    } else if (model.startsWith('hunyuan-')) {
      return this.callTencentHunyuan(prompt, model, options)
    } else if (model.startsWith('glm-')) {
      return this.callZhipuGLM(prompt, model, options)
    } else if (model.startsWith('minimax-')) {
      return this.callMiniMax(prompt, model, options)
    } else if (model.startsWith('sensechat-')) {
      return this.callSenseTime(prompt, model, options)
    } else if (model.startsWith('deepseek-')) {
      return this.callDeepSeek(prompt, model, options)
    } else if (model.startsWith('moonshot-')) {
      return this.callMoonshot(prompt, model, options)
    } else if (model.startsWith('yi-')) {
      return this.callYi(prompt, model, options)
    } else if (model.includes('internlm')) {
      return this.callZhipuGLM(prompt, model, options) // Fallback to GLM for InternLM
    } else if (model.includes('chatglm')) {
      return this.callZhipuGLM(prompt, model, options) // Fallback to GLM for ChatGLM
    } else if (model.includes('baichuan')) {
      return this.callAlibabaQianwen(prompt, model, options) // Fallback to Qwen for Baichuan
    } else if (model.includes('xverse')) {
      return this.callDeepSeek(prompt, model, options) // Fallback to DeepSeek for XVERSE
    } else if (model.includes('skywork')) {
      return this.callAlibabaQianwen(prompt, model, options) // Fallback to Qwen for Skywork
    } else if (model.includes('telechat')) {
      return this.callTencentHunyuan(prompt, model, options) // Fallback to Hunyuan for TeleChat
    } else {
      return {
        success: false,
        error: `Unsupported Chinese AI model: ${model}. Please check the model ID and try again.`
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, temperature, maxTokens, systemPrompt } = await request.json()

    if (!prompt || !model) {
      return NextResponse.json(
        { success: false, error: 'Prompt and model are required' },
        { status: 400 }
      )
    }

    const chineseAIService = new ChineseAIService()
    const result = await chineseAIService.generateText(prompt, model, {
      temperature,
      maxTokens,
      systemPrompt
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Chinese AI text generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}