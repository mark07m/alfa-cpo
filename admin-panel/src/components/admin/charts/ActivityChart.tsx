'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card'

interface ActivityData {
  date: string
  news: number
  events: number
  documents: number
  users: number
}

interface ActivityChartProps {
  data: ActivityData[]
  title?: string
  className?: string
}

export function ActivityChart({ data, title = 'Активность за 30 дней', className }: ActivityChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader title={title} />
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="news"
                stackId="1"
                stroke="#3b82f6"
                fill="#dbeafe"
                name="Новости"
              />
              <Area
                type="monotone"
                dataKey="events"
                stackId="1"
                stroke="#10b981"
                fill="#d1fae5"
                name="Мероприятия"
              />
              <Area
                type="monotone"
                dataKey="documents"
                stackId="1"
                stroke="#f59e0b"
                fill="#fef3c7"
                name="Документы"
              />
              <Area
                type="monotone"
                dataKey="users"
                stackId="1"
                stroke="#8b5cf6"
                fill="#ede9fe"
                name="Пользователи"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Компонент для простого линейного графика
export function SimpleLineChart({ data, title, className }: ActivityChartProps) {
  return (
    <Card className={className}>
      <CardHeader title={title} />
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#D97706"
                strokeWidth={2}
                dot={{ fill: '#D97706', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#D97706', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
