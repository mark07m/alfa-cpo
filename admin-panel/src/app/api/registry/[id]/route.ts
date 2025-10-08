import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('Registry API Route: GET /api/registry/' + id)
    
    const response = await fetch(`${BACKEND_URL}/registry/${id}`, {
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
    return NextResponse.json(
      { success: false, error: 'Backend unavailable', message: 'Не удалось получить данные арбитражного управляющего' },
      { status: 503 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    console.log('Registry API Route: PATCH /api/registry/' + id)
    console.log('Authorization header:', request.headers.get('Authorization') ? 'Present' : 'Missing')
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const response = await fetch(`${BACKEND_URL}/registry/${id}`, {
      method: 'PATCH',
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
      
      // Специальная обработка ошибок авторизации
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unauthorized', 
            message: 'Ошибка авторизации. Пожалуйста, войдите в систему заново.' 
          },
          { status: response.status }
        )
      }
      
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying request to backend:', error)
    return NextResponse.json(
      { success: false, error: 'Backend unavailable', message: 'Не удалось обновить данные арбитражного управляющего' },
      { status: 503 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('Registry API Route: DELETE /api/registry/' + id)
    console.log('Authorization header:', request.headers.get('Authorization') ? 'Present' : 'Missing')
    
    const response = await fetch(`${BACKEND_URL}/registry/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error:', errorText)
      
      // Специальная обработка ошибок авторизации
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unauthorized', 
            message: 'Ошибка авторизации. Пожалуйста, войдите в систему заново.' 
          },
          { status: response.status }
        )
      }
      
      throw new Error(`Backend responded with ${response.status}`)
    }

    // DELETE может вернуть пустой ответ
    if (response.status === 204) {
      return NextResponse.json({ success: true, message: 'Арбитражный управляющий успешно удален' })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying request to backend:', error)
    return NextResponse.json(
      { success: false, error: 'Backend unavailable', message: 'Не удалось удалить арбитражного управляющего' },
      { status: 503 }
    )
  }
}

