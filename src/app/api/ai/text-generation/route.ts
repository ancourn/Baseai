import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, temperature = 0.7, maxTokens = 1000 } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    let response = ''

    switch (model) {
      case 'gpt-4':
        if (!process.env.OPENAI_API_KEY) {
          return NextResponse.json(
            { success: false, error: 'OpenAI API key not configured' },
            { status: 500 }
          )
        }
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature,
          max_tokens: maxTokens,
        })
        
        response = completion.choices[0]?.message?.content || ''
        break

      case 'claude-3':
        if (!process.env.ANTHROPIC_API_KEY) {
          return NextResponse.json(
            { success: false, error: 'Anthropic API key not configured' },
            { status: 500 }
          )
        }
        
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: maxTokens,
          temperature,
          messages: [{ role: 'user', content: prompt }],
        })
        
        response = claudeResponse.content[0]?.text || ''
        break

      case 'gemini-pro':
        if (!process.env.GOOGLE_AI_API_KEY) {
          return NextResponse.json(
            { success: false, error: 'Google AI API key not configured' },
            { status: 500 }
          )
        }
        
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const geminiResult = await geminiModel.generateContent(prompt)
        response = geminiResult.response.text()
        break

      case 'llama-2':
      case 'mistral':
        // For demo purposes, using Z-AI SDK as fallback
        try {
          const ZAI = await import('z-ai-web-dev-sdk')
          const zai = await ZAI.create()
          
          const completion = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature,
            max_tokens: maxTokens,
          })

          response = completion.choices[0]?.message?.content || ''
        } catch (error) {
          return NextResponse.json(
            { success: false, error: 'Z-AI SDK error: ' + (error as Error).message },
            { status: 500 }
          )
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported model' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      response,
      model,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Text generation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}