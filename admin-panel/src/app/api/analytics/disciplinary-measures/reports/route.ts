import { NextRequest, NextResponse } from 'next/server'

const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:3002'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    const response = await fetch(`${ANALYTICS_URL}/disciplinary-measures/reports${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Analytics disciplinary reports error:', errorText)
      return NextResponse.json({ success: false, message: 'Analytics backend error' }, { status: response.status })
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying disciplinary measures reports:', error)
    return NextResponse.json({ success: false, message: 'Analytics backend unavailable' }, { status: 503 })
  }
}


