import { NextRequest, NextResponse } from 'next/server'
import { mockNews } from '@/data/mockData'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export async function GET(request: NextRequest) {
  // If mock data is enabled, return mock response
  if (USE_MOCK_DATA) {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''
    const category = url.searchParams.get('category') || ''
    
    // Filter mock data based on search parameters
    let filteredNews = mockNews
    
    if (search) {
      filteredNews = filteredNews.filter(news => 
        news.title.toLowerCase().includes(search.toLowerCase()) ||
        news.content.toLowerCase().includes(search.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (status) {
      filteredNews = filteredNews.filter(news => news.status === status)
    }
    
    if (category) {
      filteredNews = filteredNews.filter(news => news.category?.slug === category)
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNews = filteredNews.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: paginatedNews,
      pagination: {
        page,
        limit,
        total: filteredNews.length,
        totalPages: Math.ceil(filteredNews.length / limit)
      },
      message: 'Mock data'
    })
  }

  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    
    const response = await fetch(`${BACKEND_URL}/news?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying request to backend:', error)
    return NextResponse.json(
      { success: false, error: 'Backend unavailable' },
      { status: 503 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch(`${BACKEND_URL}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying request to backend:', error)
    return NextResponse.json(
      { success: false, error: 'Backend unavailable' },
      { status: 503 }
    )
  }
}