import { NextRequest, NextResponse } from 'next/server'

interface SearchResult {
  url: string
  name: string
  snippet: string
  host_name: string
  rank: number
  date: string
  favicon: string
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    let results: SearchResult[] = []

    // Use Z-AI SDK for web search
    try {
      const ZAI = await import('z-ai-web-dev-sdk')
      const zai = await ZAI.create()

      const searchResult = await zai.functions.invoke("web_search", {
        query: query,
        num: 10
      })

      results = searchResult as SearchResult[]
    } catch (error) {
      console.error('Web search error:', error)
      return NextResponse.json(
        { success: false, error: 'Web search failed: ' + (error as Error).message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      results,
      query,
      count: results.length,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Web search API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}