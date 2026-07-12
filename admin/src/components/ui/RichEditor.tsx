/**
 * RichEditor — Medium-like WYSIWYG editor pakai TipTap
 * Floating toolbar muncul saat teks diselect
 */

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Link as LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type BtnProps = { onClick: () => void; active?: boolean; title: string; children: React.ReactNode; dark?: boolean };

function Btn({ onClick, active, title, children, dark }: BtnProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        dark
          ? active ? "bg-white text-gray-900" : "text-gray-300 hover:text-white hover:bg-white/10"
          : active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

// Detect apakah string adalah Markdown (bukan HTML)
function isMarkdown(str: string): boolean {
  if (!str) return false;
  if (str.trimStart().startsWith("<")) return false; // sudah HTML
  return /^#{1,6}\s|^\*\*|^__|\*[^*]|`[^`]|^\s*[-*+]\s|^\s*\d+\.\s|^\s*>/m.test(str);
}

async function toHTML(content: string): Promise<string> {
  if (!content) return "";
  if (isMarkdown(content)) return await marked(content) as string;
  return content;
}

export function RichEditor({ value, onChange, placeholder = "Tulis artikel kamu di sini..." }: RichEditorProps) {
  const [showFloating, setShowFloating] = useState(false);
  const [floatingPos, setFloatingPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Typography,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-indigo-600 underline" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    onSelectionUpdate({ editor }) {
      const { empty } = editor.state.selection;
      if (empty) { setShowFloating(false); return; }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      setFloatingPos({
        top: rect.top - containerRect.top - 48,
        left: Math.max(0, rect.left - containerRect.left + rect.width / 2 - 150),
      });
      setShowFloating(true);
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg prose-neutral max-w-none min-h-[500px] px-8 py-6 focus:outline-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-950 prose-pre:text-gray-100",
      },
    },
  });

  useEffect(() => {
    const hide = () => setShowFloating(false);
    document.addEventListener("mousedown", hide);
    return () => document.removeEventListener("mousedown", hide);
  }, []);

  // Load + convert content (Markdown → HTML jika perlu)
  useEffect(() => {
    if (!editor) return;
    toHTML(value).then((html) => {
      if (editor.getHTML() !== html) {
        editor.commands.setContent(html || "", false);
      }
    });
  }, [editor, value]);

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("URL:", editor.getAttributes("link").href ?? "");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div ref={containerRef} className="relative border border-gray-200 rounded-xl overflow-visible bg-white">
      {/* Static toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="H1"><Heading1 size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="H3"><Heading3 size={15} /></Btn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough size={15} /></Btn>
        <Btn onClick={setLink} active={editor.isActive("link")} title="Link"><LinkIcon size={15} /></Btn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Left"><AlignLeft size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Center"><AlignCenter size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Right"><AlignRight size={15} /></Btn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List"><ListOrdered size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote size={15} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Code"><Code size={15} /></Btn>
      </div>

      {/* Floating toolbar — muncul saat teks diselect */}
      {showFloating && (
        <div
          className="absolute z-50 flex items-center gap-0.5 bg-gray-900 rounded-lg px-2 py-1 shadow-xl"
          style={{ top: floatingPos.top, left: floatingPos.left }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Btn dark onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={13} /></Btn>
          <Btn dark onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={13} /></Btn>
          <Btn dark onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={13} /></Btn>
          <Btn dark onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strike"><Strikethrough size={13} /></Btn>
          <Btn dark onClick={setLink} active={editor.isActive("link")} title="Link"><LinkIcon size={13} /></Btn>
          <Btn dark onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 size={13} /></Btn>
          <Btn dark onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote size={13} /></Btn>
        </div>
      )}

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
