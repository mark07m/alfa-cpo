'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { CompensationFundStatistics as StatisticsType } from '@/types/admin';
import { 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '@/lib/utils';

interface CompensationFundStatisticsProps {
  statistics: StatisticsType;
}

export function CompensationFundStatistics({ statistics }: CompensationFundStatisticsProps) {
  const formatChange = (value: number, isPositive: boolean) => {
    const prefix = isPositive ? '+' : '';
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    const icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    const Icon = icon;
    
    return (
      <div className={`flex items-center ${color}`}>
        <Icon className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">{prefix}{formatCurrency(value, statistics.currency)}</span>
      </div>
    );
  };

  const getChangeType = (value: number) => {
    if (value > 0) return 'increase';
    if (value < 0) return 'decrease';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая сумма</CardTitle>
            <CurrencyDollarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statistics.totalAmount, statistics.currency)}</div>
            <p className="text-xs text-muted-foreground">
              Текущий баланс фонда
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Месячные поступления</CardTitle>
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(statistics.monthlyContributions, statistics.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              За текущий месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Месячные расходы</CardTitle>
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(statistics.monthlyExpenses, statistics.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              За текущий месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Чистое изменение</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatChange(statistics.netChange, statistics.netChange >= 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              За текущий месяц
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Детальная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Статистика операций</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Количество поступлений</span>
              <span className="text-sm font-semibold">{statistics.contributionCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Количество расходов</span>
              <span className="text-sm font-semibold">{statistics.expenseCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Последняя операция</span>
              <span className="text-sm font-semibold">{formatDate(statistics.lastOperationDate)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Средние показатели</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Среднее поступление в месяц</span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(statistics.averageMonthlyContribution, statistics.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Средний расход в месяц</span>
              <span className="text-sm font-semibold text-red-600">
                {formatCurrency(statistics.averageMonthlyExpense, statistics.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Валюта</span>
              <span className="text-sm font-semibold">{statistics.currency}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* График изменений (заглушка) */}
      <Card>
        <CardHeader>
          <CardTitle>Динамика изменений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">График будет добавлен в следующих версиях</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Сводка по периодам */}
      <Card>
        <CardHeader>
          <CardTitle>Сводка по периодам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(statistics.monthlyContributions, statistics.currency)}
              </div>
              <div className="text-sm text-green-700">Поступления за месяц</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(statistics.monthlyExpenses, statistics.currency)}
              </div>
              <div className="text-sm text-red-700">Расходы за месяц</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              statistics.netChange >= 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`text-2xl font-bold ${
                statistics.netChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(statistics.netChange, statistics.currency)}
              </div>
              <div className={`text-sm ${
                statistics.netChange >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                Чистое изменение
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
