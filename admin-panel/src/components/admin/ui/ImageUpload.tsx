'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  onFileSelected?: (file: File) => Promise<string> | string;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  placeholder = 'Загрузить изображение',
  className,
  disabled = false,
  accept = 'image/*',
  maxSize = 10, // 10MB
  onFileSelected,
  helperText
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Файл слишком большой. Максимальный размер: ${maxSize}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // If custom upload handler provided, use it to get URL
    if (onFileSelected) {
      try {
        const maybe = onFileSelected(file) as any;
        if (maybe && typeof maybe.then === 'function') {
          (maybe as Promise<string>)
            .then((url) => onChange(url))
            .catch(() => setError('Ошибка загрузки файла'));
        } else {
          onChange(maybe as string);
        }
      } catch (e) {
        setError('Ошибка загрузки файла');
      }
      return;
    }

    // Fallback: convert to base64 (preview-only)
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.onerror = () => {
      setError('Ошибка при чтении файла');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-beige-500 bg-beige-50'
            : 'border-neutral-300 hover:border-neutral-400',
          disabled && 'opacity-50 cursor-not-allowed',
          value && 'border-solid border-neutral-300'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {value ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={value}
                alt="Preview"
                className="max-h-48 max-w-full rounded-lg object-cover"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-neutral-600">
              Нажмите для замены изображения
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <div className="text-sm text-neutral-600">
              <p className="font-medium">{placeholder}</p>
              <p className="text-xs text-neutral-500 mt-1">
                PNG, JPG, GIF до {maxSize}MB
              </p>
              {helperText && (
                <p className="text-xs text-neutral-500 mt-1">{helperText}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;