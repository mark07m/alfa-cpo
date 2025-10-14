'use client'

import React, { useMemo } from 'react'

type EventCalendarItem = {
  id: string
  title: string
  startDate: string
  endDate?: string
  location?: string
  status?: 'draft' | 'published' | 'cancelled' | 'completed'
  featured?: boolean
  type?: { name?: string; color?: string; slug?: string }
}

interface EventsCalendarProps {
  items: EventCalendarItem[]
  loading?: boolean
  year: number
  monthIndex: number // 0-11
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export function EventsCalendar({ items, loading = false, year, monthIndex, onPrevMonth, onNextMonth, onToday }: EventsCalendarProps) {
  const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
  const dayNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

  const { days, firstWeekdayIndex } = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const totalDays = lastDay.getDate()
    // JS getDay(): 0 (Sun) .. 6 (Sat); transform so Monday=0
    const dow = firstDay.getDay()
    const firstIdx = (dow + 6) % 7
    return { days: Array.from({ length: totalDays }, (_, i) => new Date(year, monthIndex, i + 1)), firstWeekdayIndex: firstIdx }
  }, [year, monthIndex])

  const itemsByDate = useMemo(() => {
    const map = new Map<string, EventCalendarItem[]>()
    for (const it of items || []) {
      const d = new Date(it.startDate)
      const key = d.toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(it)
    }
    return map
  }, [items])

  const isToday = (d: Date) => {
    const t = new Date()
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onPrevMonth} className="px-2 py-1 text-sm border rounded-lg hover:bg-gray-50">Назад</button>
          <button onClick={onToday} className="px-2 py-1 text-sm border rounded-lg hover:bg-gray-50">Сегодня</button>
          <button onClick={onNextMonth} className="px-2 py-1 text-sm border rounded-lg hover:bg-gray-50">Вперёд</button>
        </div>
        <div className="text-lg font-semibold">{monthNames[monthIndex]} {year}</div>
        <div />
      </div>

      {loading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-7 text-xs font-medium text-gray-500 mb-2">
            {dayNames.map((d) => (
              <div key={d} className="px-2 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstWeekdayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded border border-dashed border-gray-200" />
            ))}
            {days.map((date) => {
              const key = date.toDateString()
              const dayItems = itemsByDate.get(key) || []
              return (
                <div key={key} className={`h-24 rounded border ${isToday(date) ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'} p-1 overflow-hidden`}>
                  <div className="text-xs font-medium text-gray-700 mb-1">{date.getDate()}</div>
                  <div className="space-y-1 overflow-y-auto max-h-16 pr-1">
                    {dayItems.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="text-[11px] leading-tight truncate px-1 py-0.5 rounded" style={{ backgroundColor: ev.type?.color ? `${ev.type.color}22` : '#eef2ff', color: '#111827' }}>
                        {ev.title}
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <div className="text-[11px] text-gray-500">+{dayItems.length - 3} ещё</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsCalendar


