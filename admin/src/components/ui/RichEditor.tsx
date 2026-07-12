/**
 * RichEditor — Medium-like WYSIWYG editor pakai TipTap
 * BubbleMenu muncul saat teks diselect (bold, italic, link, dll)
 */

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
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

export function RichEditor({ value, onChange, placeholder = "Tulis artikel kamu di sini..." }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Typography,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-indigo-600 underline" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none min-h-[500px] px-6 py-4 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("URL:", editor.getAttributes("link").href);
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const ToolbarBtn = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Static toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="H1"><Heading1 size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="H3"><Heading3 size={15} /></ToolbarBtn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Link"><LinkIcon size={15} /></ToolbarBtn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left"><AlignLeft size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center"><AlignCenter size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right"><AlignRight size={15} /></ToolbarBtn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List"><ListOrdered size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code"><Code size={15} /></ToolbarBtn>
      </div>

      {/* BubbleMenu — muncul saat teks diselect */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-0.5 bg-gray-900 text-white rounded-lg px-2 py-1 shadow-xl">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={13} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={13} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={13} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strike"><Strikethrough size={13} /></ToolbarBtn>
          <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Link"><LinkIcon size={13} /></ToolbarBtn>
        </div>
      </BubbleMenu>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
