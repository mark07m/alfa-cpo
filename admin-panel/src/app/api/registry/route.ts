import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    console.log('Registry API Route: GET /api/registry', queryString ? `?${queryString}` : '')
    
    const response = await fetch(`${BACKEND_URL}/registry?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error:', errorText)
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    console.log('Backend response data:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying request to backend:', error)
    return NextResponse.json(
      { success: false, error: 'Backend unavailable', message: 'Не удалось получить данные реестра' },
      { status: 503 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Registry API Route: POST /api/registry')
    console.log('Authorization header:', request.headers.get('Authorization') ? 'Present' : 'Missing')
    
    const response = await fetch(`${BACKEND_URL}/registry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error:', errorText)
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying request to backend:', error)
    return NextResponse.json(
      { success: false, error: 'Backend unavailable', message: 'Не удалось создать арбитражного управляющего' },
      { status: 503 }
    )
  }
}

