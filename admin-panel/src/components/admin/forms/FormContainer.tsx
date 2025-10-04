import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/admin/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card';
import { Alert } from '@/components/admin/ui/Alert';

interface FormContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  success?: string;
  submitLabel?: string;
  cancelLabel?: string;
  showActions?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function FormContainer({
  title,
  description,
  children,
  onSubmit,
  onCancel,
  loading = false,
  error,
  success,
  submitLabel = 'Сохранить',
  cancelLabel = 'Отмена',
  showActions = true,
  className,
  size = 'md'
}: FormContainerProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !loading) {
      onSubmit(e);
    }
  };

  return (
    <div className={cn('mx-auto', sizeClasses[size], className)}>
      <Card>
        {(title || description) && (
          <CardHeader>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </CardHeader>
        )}
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Сообщения об ошибках и успехе */}
            {error && (
              <Alert variant="error" title="Ошибка">
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" title="Успешно">
                {success}
              </Alert>
            )}
            
            {/* Содержимое формы */}
            <div className="space-y-4">
              {children}
            </div>
            
            {/* Действия */}
            {showActions && (
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="sm:order-2"
                >
                  {submitLabel}
                </Button>
                
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                    className="sm:order-1"
                  >
                    {cancelLabel}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

// Компонент для группировки полей формы
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Компонент для сетки полей
interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn('grid gap-4', gridClasses[columns], className)}>
      {children}
    </div>
  );
}
