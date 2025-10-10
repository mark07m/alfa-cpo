import { NextRequest, NextResponse } from 'next/server'

const ANALYTICS_URL = process.env.ANALYTICS_API_URL || process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:3002'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const { searchParams } = requestUrl
    const queryString = searchParams.toString()

    // Avoid self-proxy loops in development when ANALYTICS_URL points to the same origin
    const analyticsOrigin = ANALYTICS_URL.replace(/\/$/, '')
    const requestOrigin = requestUrl.origin.replace(/\/$/, '')
    const allowFallback = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_FALLBACK === 'true'
    if (allowFallback && analyticsOrigin === requestOrigin) {
      const section = searchParams.get('section') || 'stats'
      const days = Number(searchParams.get('days') || '30')
      const limit = Number(searchParams.get('limit') || '10')
      const fallback = buildFallback(section, { days, limit })
      return NextResponse.json(fallback)
    }

    const response = await fetch(`${ANALYTICS_URL}/dashboard${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      cache: 'no-store',
    })

    const contentType = response.headers.get('content-type') || ''

    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Fallback to mock data when enabled and upstream fails or returns non-JSON
    if (allowFallback) {
      const section = searchParams.get('section') || 'stats'
      const days = Number(searchParams.get('days') || '30')
      const limit = Number(searchParams.get('limit') || '10')
      const fallback = buildFallback(section, { days, limit })
      return NextResponse.json(fallback)
    }

    // Upstream failed and fallback disabled
    const status = response.status || 502
    return NextResponse.json({ success: false, message: 'Analytics backend error' }, { status })
  } catch (error) {
    console.error('Error proxying analytics dashboard:', error)
    const allowFallback = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_FALLBACK === 'true'
    if (allowFallback) {
      const url = new URL(request.url)
      const section = url.searchParams.get('section') || 'stats'
      const days = Number(url.searchParams.get('days') || '30')
      const limit = Number(url.searchParams.get('limit') || '10')
      const fallback = buildFallback(section, { days, limit })
      return NextResponse.json(fallback)
    }
    return NextResponse.json({ success: false, message: 'Analytics backend unavailable' }, { status: 503 })
  }
}


function buildFallback(section: string, opts: { days: number; limit: number }) {
  if (section === 'activity-chart') {
    return generateMockActivityData(opts.days)
  }
  if (section === 'activities') {
    return [
      {
        id: '1',
        type: 'news',
        action: 'created',
        title: 'Новая статья о банкротстве',
        user: { name: 'Иван Петров', id: '1' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        details: 'Статья о новых изменениях в законодательстве'
      },
      {
        id: '2',
        type: 'arbitrator',
        action: 'updated',
        title: 'Обновлены данные управляющего',
        user: { name: 'Мария Сидорова', id: '2' },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        details: 'Изменены контактные данные'
      },
      {
        id: '3',
        type: 'event',
        action: 'created',
        title: 'Семинар по новому законодательству',
        user: { name: 'Алексей Козлов', id: '3' },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        details: 'Планируется на 15 января 2025'
      },
      {
        id: '4',
        type: 'document',
        action: 'published',
        title: 'Новый регламент СРО',
        user: { name: 'Елена Волкова', id: '4' },
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        details: 'Опубликован обновленный регламент работы'
      },
      {
        id: '5',
        type: 'inspection',
        action: 'created',
        title: 'Планируется проверка',
        user: { name: 'Дмитрий Соколов', id: '5' },
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        details: 'Запланирована проверка деятельности СРО'
      }
    ].slice(0, opts.limit)
  }
  // Default: stats
  return {
    newsCount: 24,
    newsChange: { value: '+12%', type: 'increase' },
    eventsCount: 8,
    eventsChange: { value: '+5%', type: 'increase' },
    documentsCount: 156,
    documentsChange: { value: '+8%', type: 'increase' },
    usersCount: 342,
    usersChange: { value: '+3%', type: 'increase' },
    inspectionsCount: 12,
    disciplinaryMeasuresCount: 3,
    compensationFundCount: 45
  }
}

function generateMockActivityData(days: number) {
  const data: Array<{ date: string; value: number }> = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 20) + 5
    })
  }
  return data
}

