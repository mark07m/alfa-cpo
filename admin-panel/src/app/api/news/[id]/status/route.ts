import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // If mock data is enabled, return mock response
  if (USE_MOCK_DATA) {
    const { id } = await params
    const body = await request.json()
    
    // Return a successful mock response
    return NextResponse.json({
      success: true,
      data: {
        _id: id,
        status: body.status,
        updatedAt: new Date().toISOString()
      },
      message: 'News status updated successfully (mock)'
    })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const response = await fetch(`${BACKEND_URL}/news/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    if (!response.ok) {
      // Return the backend response with the same status code
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying request to backend:', error)
    return NextResponse.json(
      { success: false, error: 'Backend unavailable' },
      { status: 503 }
    )
  }
}
