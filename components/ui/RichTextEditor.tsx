"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Enter content...",
  maxLength = 2000,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
      },
    },
  });

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg p-3 min-h-[160px] bg-gray-50 animate-pulse" />
    );
  }

  const charCount = editor.getText().length;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 shrink-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bold")
              ? "bg-gray-200 text-blue-600"
              : "text-gray-600"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("italic")
              ? "bg-gray-200 text-blue-600"
              : "text-gray-600"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList")
              ? "bg-gray-200 text-blue-600"
              : "text-gray-600"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("orderedList")
              ? "bg-gray-200 text-blue-600"
              : "text-gray-600"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Character count */}
      <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <p
          className={`text-xs ${charCount > maxLength ? "text-red-500" : "text-gray-500"}`}
        >
          {charCount}/{maxLength} characters
        </p>
      </div>
    </div>
  );
}
