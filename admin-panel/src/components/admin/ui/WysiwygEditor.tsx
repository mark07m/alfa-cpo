'use client';

import React, { useRef, useEffect, useState } from 'react';
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
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const pendingSyncRef = useRef<string | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Ensure visual editor is hydrated when toggling back from HTML mode
  useEffect(() => {
    if (!isHtmlMode && editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [isHtmlMode]);

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

  const decodeHtml = (str: string) => {
    const el = document.createElement('textarea');
    el.innerHTML = str;
    return el.value;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (isHtmlMode) return; // no-op in HTML mode
    const html = e.clipboardData?.getData('text/html');
    const text = e.clipboardData?.getData('text/plain') || '';

    if (html || /&lt;|&gt;|<[^>]+>/.test(text)) {
      e.preventDefault();
      const toInsert = html || decodeHtml(text);
      document.execCommand('insertHTML', false, toInsert);
      onChange(editorRef.current?.innerHTML || '');
    }
  };

  // When switching to HTML mode, sync the latest visual DOM content to the controlled value
  useEffect(() => {
    if (isHtmlMode && pendingSyncRef.current !== null) {
      const nextValue = pendingSyncRef.current;
      pendingSyncRef.current = null;
      // Defer to avoid updating parent during render of this component
      queueMicrotask(() => onChange(nextValue));
    }
  }, [isHtmlMode, onChange]);

  return (
    <div className={cn('w-full', className)}>
      {/* Toolbar */}
      <div className="border border-neutral-300 rounded-t-md bg-neutral-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm font-bold hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Жирный"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm italic hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Курсив"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm underline hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Подчеркнутый"
        >
          U
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Маркированный список"
        >
          • Список
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Нумерованный список"
        >
          1. Список
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Выровнять по левому краю"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Выровнять по центру"
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Выровнять по правому краю"
        >
          →
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          disabled={disabled || isHtmlMode}
          className={cn('px-2 py-1 text-sm hover:bg-neutral-200 rounded', (disabled || isHtmlMode) && 'opacity-50 cursor-not-allowed')}
          title="Убрать форматирование"
        >
          Очистить
        </button>

        <button
          type="button"
          onClick={() => {
            if (disabled || isHtmlMode) return;
            const html = prompt('Вставьте HTML');
            if (html) {
              document.execCommand('insertHTML', false, html);
              onChange(editorRef.current?.innerHTML || '');
              editorRef.current?.focus();
            }
          }}
          className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
          title="Вставить HTML"
        >
          HTML
        </button>

        <button
          type="button"
          onClick={() => {
            if (disabled || isHtmlMode) return;
            document.execCommand('insertHorizontalRule');
            onChange(editorRef.current?.innerHTML || '');
            editorRef.current?.focus();
          }}
          className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
          title="Разделитель"
        >
          ─
        </button>

        <div className="ml-auto flex items-center gap-1">
          <span className="text-xs text-neutral-600">Режим:</span>
          <button
            type="button"
            onClick={() => {
              if (!isHtmlMode) {
                // Visual -> HTML: capture current DOM, then toggle
                pendingSyncRef.current = editorRef.current?.innerHTML || '';
                setIsHtmlMode(true);
              } else {
                // HTML -> Visual
                setIsHtmlMode(false);
              }
            }}
            className="px-2 py-1 text-sm hover:bg-neutral-200 rounded"
            title={isHtmlMode ? 'Переключить на визуальный режим' : 'Переключить на HTML режим'}
          >
            {isHtmlMode ? 'Визуально' : 'HTML'}
          </button>
        </div>
      </div>
      
      {/* Editor */}
      {!isHtmlMode ? (
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={cn(
            'w-full min-h-[200px] p-3 border border-neutral-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-beige-500',
            disabled && 'bg-neutral-100 cursor-not-allowed'
          )}
          style={{ minHeight: '200px' }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full min-h-[200px] p-3 border border-neutral-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-beige-500 font-mono text-sm',
            disabled && 'bg-neutral-100 cursor-not-allowed'
          )}
          style={{ minHeight: '200px' }}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      
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