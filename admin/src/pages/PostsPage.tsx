/**
 * Posts CRUD Page — dengan Markdown editor
 */

import { useEffect, useState } from "react";
import { postsApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TagInput } from "@/components/ui/TagInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  published: boolean;
}

const today = new Date().toISOString().split("T")[0]!;

const EMPTY: Omit<Post, "id" | "slug"> = {
  title: "",
  excerpt: "",
  content: "",
  date: today,
  readTime: "5 min",
  tags: [],
  published: false,
};

export function PostsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null | false>(false);
  const [form, setForm] = useState<Omit<Post, "id" | "slug">>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const load = async () => {
    const res = await postsApi.getAll();
    if (res.success) setItems((res.data as Post[]) ?? []);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...EMPTY, date: today }); };
  const openEdit = async (p: Post) => {
    const res = await postsApi.getById(p.id);
    if (res.success && res.data) {
      const full = res.data as Post;
      setEditing(full);
      setForm({ title: full.title, excerpt: full.excerpt, content: full.content, date: full.date, readTime: full.readTime, tags: [...full.tags], published: full.published });
    }
  };
  const cancel = () => { setEditing(false); setForm(EMPTY); };

  const submit = async () => {
    if (!form.title || !form.content) {
      toast("Judul dan content wajib diisi", "error");
      return;
    }
    setIsSubmitting(true);

    const res = editing
      ? await postsApi.update((editing as Post).id, form)
      : await postsApi.create(form);

    setIsSubmitting(false);

    if (res.success) {
      toast(editing ? "Post diperbarui" : "Post dibuat");
      cancel();
      load();
    } else {
      toast(res.error ?? "Gagal menyimpan", "error");
    }
  };

  const togglePublish = async (post: Post) => {
    await postsApi.update(post.id, { published: !post.published });
    toast(post.published ? "Post disembunyikan" : "Post dipublish");
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await postsApi.delete(deleteTarget);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (res.success) { toast("Post dihapus"); load(); }
    else toast(res.error ?? "Gagal menghapus", "error");
  };

  const isFormOpen = editing !== false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} post · {items.filter(p => p.published).length} published</p>
        </div>
        <Button onClick={openNew}><Plus size={15} /> Tulis Post</Button>
      </div>

      {/* ── Editor ───────────────────────── */}
      {isFormOpen && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{editing ? "Edit Post" : "Post Baru"}</h2>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-indigo-600"
              />
              Publish langsung
            </label>
          </div>

          <Input label="Judul*" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul artikel..." />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Tanggal*" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input label="Read Time" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} placeholder="5 min" />
          </div>

          <Textarea label="Excerpt (ringkasan)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Deskripsi singkat artikel..." />

          <TagInput label="Tags" value={form.tags} onChange={(tags) => setForm({ ...form, tags })} />

          {/* Content editor dengan tab write/preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Content (Markdown)*</label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
                <button onClick={() => setActiveTab("write")} className={`px-3 py-1.5 font-medium transition-colors ${activeTab === "write" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"}`}>Write</button>
                <button onClick={() => setActiveTab("preview")} className={`px-3 py-1.5 font-medium transition-colors ${activeTab === "preview" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"}`}>Preview</button>
              </div>
            </div>
            {activeTab === "write" ? (
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={18}
                className="w-full px-3 py-2 bg-gray-950 text-gray-100 border border-gray-200 rounded-lg text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="# Judul&#10;&#10;Isi artikel dalam format Markdown..."
              />
            ) : (
              <div className="min-h-[400px] px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 prose prose-sm max-w-none overflow-auto">
                {form.content ? (
                  <pre className="whitespace-pre-wrap font-sans">{form.content}</pre>
                ) : (
                  <p className="text-gray-400 italic">Tidak ada konten...</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={submit} isLoading={isSubmitting}>Simpan</Button>
            <Button variant="secondary" onClick={cancel}>Batal</Button>
          </div>
        </div>
      )}

      {/* ── List ─────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Belum ada post.</div>
      ) : (
        <div className="space-y-3">
          {items.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${post.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={11} />{post.date}</span>
                  <span>{post.readTime}</span>
                  {post.tags.map((t) => <span key={t} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => togglePublish(post)} title={post.published ? "Sembunyikan" : "Publish"}>
                  {post.published ? <EyeOff size={13} /> : <Eye size={13} />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(post)}>
                  <Pencil size={13} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(post.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Post?" message="Tindakan ini tidak dapat dibatalkan." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} isLoading={isDeleting} />
    </div>
  );
}
