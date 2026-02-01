import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

interface TiptapRichTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function TiptapRichTextArea({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 6,
}: TiptapRichTextAreaProps) {
  const minHeight = rows * 1.5 * 16; // примерно 1.5em * 16px

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-4',
          },
        },
      }),
      Underline,
      TaskList.configure({
        HTMLAttributes: {
          class: 'list-none',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start ml-0',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Введите текст...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  // Синхронизация внешнего value с редактором, если оно поменялось снаружи
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const handleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const handleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const handleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const handleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const handleTaskList = useCallback(() => {
    editor?.chain().focus().toggleTaskList().run();
  }, [editor]);

  const handleHeading = useCallback((level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={className}>
      {/* Тулбар */}
      <div className="mb-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <span className="mr-2">Форматирование:</span>
        <button
          type="button"
          onClick={handleBold}
          className={`inline-flex items-center rounded border px-2 py-1 text-xs font-semibold ${
            editor.isActive('bold')
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className={`inline-flex items-center rounded border px-2 py-1 text-xs italic ${
            editor.isActive('italic')
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={handleUnderline}
          className={`inline-flex items-center rounded border px-2 py-1 text-xs underline ${
            editor.isActive('underline')
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          U
        </button>
        <button
          type="button"
          onClick={handleBulletList}
          className={`inline-flex items-center rounded border px-2 py-1 text-xs ${
            editor.isActive('bulletList')
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          • Список
        </button>
        <button
          type="button"
          onClick={handleOrderedList}
          className={`inline-flex items-center rounded border px-2 py-1 text-xs ${
            editor.isActive('orderedList')
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          1. Список
        </button>
        <button
          type="button"
          onClick={handleTaskList}
          className={`inline-flex items-center rounded border px-2 py-1 text-xs ${
            editor.isActive('taskList')
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          ☐ Чекбокс
        </button>
        <div className="relative group">
          <button
            type="button"
            className={`inline-flex items-center rounded border px-2 py-1 text-xs ${
              editor.isActive('heading')
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Заголовок ▼
          </button>
          <div className="absolute left-0 mt-1 w-32 rounded-md bg-background border border-input shadow-lg py-1 hidden group-hover:block z-10">
            {[1, 2, 3].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => handleHeading(level as 1 | 2 | 3)}
                className={`block w-full text-left px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground ${
                  editor.isActive('heading', { level }) ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                Заголовок {level}
              </button>
            ))}
          </div>
        </div>
        <span className="ml-auto text-[10px] text-muted-foreground/70">
          Ctrl/Cmd+B, Ctrl/Cmd+I, Ctrl/Cmd+U
        </span>
      </div>

      {/* Само поле ввода */}
      <div
        className="w-full rounded-lg border border-input bg-input-background px-4 py-3 text-foreground outline-none transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 min-h-[4rem]"
        style={{ minHeight }}
      >
        <EditorContent 
          editor={editor} 
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[2rem] [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-input [&_blockquote]:pl-4 [&_blockquote]:my-2 [&_blockquote]:text-muted-foreground [&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']_li]:flex [&_ul[data-type='taskList']_li]:items-start [&_ul[data-type='taskList']_li]:ml-0"
        />
      </div>
    </div>
  );
}