'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = 'Введите текст...',
  className,
  disabled = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          break;
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Toolbar */}
      <div className="border border-neutral-300 rounded-t-md bg-neutral-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="px-2 py-1 text-sm font-bold hover:bg-neutral-200 rounded"
          title="Жирный"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="px-2 py-1 text-sm italic hover:bg-neutral-200 rounded"
          title="Курсив"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="px-2 py-1 text-sm underline hover:bg-neutral-200 rounded"
          title="Подчеркнутый"
        >
          U
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
          title="Маркированный список"
        >
          • Список
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
          title="Нумерованный список"
        >
          1. Список
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
          title="Выровнять по левому краю"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
          title="Выровнять по центру"
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
          title="Выровнять по правому краю"
        >
          →
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
          title="Убрать форматирование"
        >
          Очистить
        </button>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          'min-h-[200px] p-3 border border-neutral-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-beige-500',
          disabled && 'bg-neutral-100 cursor-not-allowed'
        )}
        style={{ minHeight: '200px' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      {/* Placeholder */}
      {!value && (
        <div className="absolute top-3 left-3 text-neutral-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default WysiwygEditor;