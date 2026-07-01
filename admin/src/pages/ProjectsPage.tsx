/**
 * Projects CRUD Page
 */

import { useEffect, useState } from "react";
import { portfolioApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TagInput } from "@/components/ui/TagInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, ExternalLink, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tech: string[];
  highlights: string[];
}

const EMPTY: Omit<Project, "id"> = {
  title: "",
  description: "",
  image: "",
  link: "",
  github: "",
  tech: [],
  highlights: [],
};

export function ProjectsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null | false>(false);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = async () => {
    const res = await portfolioApi.getProjects();
    if (res.success) setItems((res.data as Project[]) ?? []);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, image: p.image, link: p.link ?? "", github: p.github ?? "", tech: [...p.tech], highlights: [...p.highlights] });
  };
  const cancel = () => { setEditing(false); setForm(EMPTY); };

  const submit = async () => {
    if (!form.title || !form.description) {
      toast("Title dan description wajib diisi", "error");
      return;
    }
    setIsSubmitting(true);

    const payload = {
      ...form,
      link: form.link || undefined,
      github: form.github || undefined,
    };

    const res = editing
      ? await portfolioApi.updateProject((editing as Project).id, payload)
      : await portfolioApi.createProject(payload);

    setIsSubmitting(false);

    if (res.success) {
      toast(editing ? "Project diperbarui" : "Project ditambahkan");
      cancel();
      load();
    } else {
      toast(res.error ?? "Gagal menyimpan", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await portfolioApi.deleteProject(deleteTarget);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (res.success) { toast("Project dihapus"); load(); }
    else toast(res.error ?? "Gagal menghapus", "error");
  };

  const isFormOpen = editing !== false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} project</p>
        </div>
        <Button onClick={openNew}><Plus size={15} /> Tambah</Button>
      </div>

      {/* ── Form ─────────────────────────── */}
      {isFormOpen && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-900">{editing ? "Edit Project" : "Tambah Project"}</h2>

          <Input label="Judul Project*" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Deskripsi*" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          <Input label="Image Path" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/nama-project.webp" hint="Path relatif ke folder public/" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="URL Live Demo" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
            <Input label="URL GitHub" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
          </div>

          <TagInput label="Tech Stack*" value={form.tech} onChange={(tech) => setForm({ ...form, tech })} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Highlights</label>
            {form.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input value={h} onChange={(e) => { const next = [...form.highlights]; next[i] = e.target.value; setForm({ ...form, highlights: next }); }} className="flex-1" placeholder="Hal menarik tentang project ini..." />
                <button onClick={() => setForm({ ...form, highlights: form.highlights.filter((_, j) => j !== i) })} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, highlights: [...form.highlights, ""] })}>
              <Plus size={13} /> Tambah Highlight
            </Button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={submit} isLoading={isSubmitting}>Simpan</Button>
            <Button variant="secondary" onClick={cancel}>Batal</Button>
          </div>
        </div>
      )}

      {/* ── Grid ─────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Belum ada project.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((proj) => (
            <div key={proj.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{proj.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{proj.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-indigo-500 p-1"><ExternalLink size={13} /></a>}
                  {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-gray-700 p-1"><Github size={13} /></a>}
                  <Button size="sm" variant="ghost" onClick={() => openEdit(proj)}><Pencil size={13} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(proj.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {proj.tech.slice(0, 5).map((t) => <span key={t} className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">{t}</span>)}
                {proj.tech.length > 5 && <span className="text-xs text-gray-400">+{proj.tech.length - 5}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Project?" message="Tindakan ini tidak dapat dibatalkan." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} isLoading={isDeleting} />
    </div>
  );
}
