import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ inn: string }> }
) {
  try {
    const { inn } = await params
    
    console.log('Registry API Route: GET /api/registry/inn/' + inn)
    
    const response = await fetch(`${BACKEND_URL}/registry/inn/${inn}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    })

    console.log('Backend response status:', response.status)

    // 404 - это нормальный ответ для проверки уникальности
    if (response.status === 404) {
      return NextResponse.json(
        { success: false, data: null, message: 'Не найдено' },
        { status: 404 }
      )
    }

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
      { success: false, error: 'Backend unavailable', message: 'Не удалось выполнить поиск по ИНН' },
      { status: 503 }
    )
  }
}

