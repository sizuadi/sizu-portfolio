/**
 * Experience CRUD Page
 */

import { useEffect, useState } from "react";
import { portfolioApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TagInput } from "@/components/ui/TagInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  impact: string[];
  tech: string[];
}

const EMPTY: Omit<Experience, "id"> = {
  role: "",
  company: "",
  period: "",
  description: "",
  impact: [""],
  tech: [],
};

export function ExperiencePage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    const res = await portfolioApi.getExperiences();
    if (res.success) setItems((res.data as Experience[]) ?? []);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({ role: exp.role, company: exp.company, period: exp.period, description: exp.description, impact: [...exp.impact], tech: [...exp.tech] });
  };

  const cancel = () => { setEditing(null); setForm(EMPTY); };

  const submit = async () => {
    if (!form.role || !form.company || !form.period || !form.description) {
      toast("Role, company, period, dan description wajib diisi", "error");
      return;
    }
    setIsSubmitting(true);

    const res = editing
      ? await portfolioApi.updateExperience(editing.id, form)
      : await portfolioApi.createExperience(form);

    setIsSubmitting(false);

    if (res.success) {
      toast(editing ? "Experience diperbarui" : "Experience ditambahkan");
      cancel();
      load();
    } else {
      toast(res.error ?? "Gagal menyimpan", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await portfolioApi.deleteExperience(deleteTarget);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (res.success) { toast("Experience dihapus"); load(); }
    else toast(res.error ?? "Gagal menghapus", "error");
  };

  const showForm = editing !== null || (editing === null && form.role === "" && items.length === 0);
  const isFormVisible = editing !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} pengalaman kerja</p>
        </div>
        <Button onClick={openNew}>
          <Plus size={15} /> Tambah
        </Button>
      </div>

      {/* ── Form Modal (slide panel) ────── */}
      {isFormVisible && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            {editing ? "Edit Experience" : "Tambah Experience"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Role / Jabatan*" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <Input label="Perusahaan*" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <Input label="Periode*" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="2022 — Present (Fulltime)" />
          <Textarea label="Deskripsi*" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />

          {/* Impact / Bullet points */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Impact / Pencapaian</label>
            {form.impact.map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-xs text-gray-400 pt-2.5 w-5 shrink-0">•</span>
                <Input
                  value={item}
                  onChange={(e) => {
                    const next = [...form.impact];
                    next[i] = e.target.value;
                    setForm({ ...form, impact: next });
                  }}
                  className="flex-1"
                  placeholder="Apa yang kamu capai..."
                />
                <button
                  onClick={() => setForm({ ...form, impact: form.impact.filter((_, j) => j !== i) })}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, impact: [...form.impact, ""] })}>
              <Plus size={13} /> Tambah Bullet
            </Button>
          </div>

          <TagInput label="Tech Stack" value={form.tech} onChange={(tech) => setForm({ ...form, tech })} />

          <div className="flex gap-3 pt-2">
            <Button onClick={submit} isLoading={isSubmitting}>Simpan</Button>
            <Button variant="secondary" onClick={cancel}>Batal</Button>
          </div>
        </div>
      )}

      {/* ── List ─────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Belum ada experience. Klik "Tambah" untuk memulai.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((exp) => (
            <div key={exp.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
              >
                <GripVertical size={15} className="text-gray-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{exp.role}</p>
                  <p className="text-sm text-gray-500">{exp.company} · {exp.period}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(exp); setEditing(exp); }}>
                    <Pencil size={13} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setDeleteTarget(exp.id); }}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 size={13} />
                  </Button>
                  {expanded === exp.id ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded */}
              {expanded === exp.id && (
                <div className="px-5 pb-5 border-t border-gray-100 space-y-3 pt-4">
                  <p className="text-sm text-gray-600">{exp.description}</p>
                  {exp.impact.length > 0 && (
                    <ul className="space-y-1">
                      {exp.impact.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-indigo-400 shrink-0">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.tech.map((t) => (
                      <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Experience?"
        message="Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
