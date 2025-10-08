import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function GET(request: NextRequest) {
  try {
    console.log('Registry API Route: GET /api/registry/statistics')
    
    const response = await fetch(`${BACKEND_URL}/registry/statistics`, {
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
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying request to backend:', error)
    
    // Возвращаем mock данные при ошибке
    return NextResponse.json(
      {
        success: true,
        data: {
          total: 0,
          active: 0,
          excluded: 0,
          suspended: 0,
          byRegion: [],
          byStatus: [],
          recentAdditions: 0,
          recentExclusions: 0
        },
        message: 'Mock data (backend unavailable)'
      }
    )
  }
}

