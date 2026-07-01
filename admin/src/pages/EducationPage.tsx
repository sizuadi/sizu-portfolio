/**
 * Education CRUD Page
 */

import { useEffect, useState } from "react";
import { portfolioApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  achievements: string[];
}

const EMPTY: Omit<Education, "id"> = {
  degree: "",
  institution: "",
  period: "",
  description: "",
  achievements: [],
};

export function EducationPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null | false>(false);
  const [form, setForm] = useState<Omit<Education, "id">>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = async () => {
    const res = await portfolioApi.getEducations();
    if (res.success) setItems((res.data as Education[]) ?? []);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); };
  const openEdit = (edu: Education) => {
    setEditing(edu);
    setForm({ degree: edu.degree, institution: edu.institution, period: edu.period, description: edu.description, achievements: [...edu.achievements] });
  };
  const cancel = () => { setEditing(false); setForm(EMPTY); };

  const submit = async () => {
    if (!form.degree || !form.institution || !form.period) {
      toast("Degree, institution, dan period wajib diisi", "error");
      return;
    }
    setIsSubmitting(true);

    const res = editing
      ? await portfolioApi.updateEducation((editing as Education).id, form)
      : await portfolioApi.createEducation(form);

    setIsSubmitting(false);

    if (res.success) {
      toast(editing ? "Education diperbarui" : "Education ditambahkan");
      cancel();
      load();
    } else {
      toast(res.error ?? "Gagal menyimpan", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await portfolioApi.deleteEducation(deleteTarget);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (res.success) { toast("Education dihapus"); load(); }
    else toast(res.error ?? "Gagal", "error");
  };

  const isFormOpen = editing !== false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Education</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} riwayat pendidikan</p>
        </div>
        <Button onClick={openNew}><Plus size={15} /> Tambah</Button>
      </div>

      {isFormOpen && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-900">{editing ? "Edit Education" : "Tambah Education"}</h2>
          <Input label="Gelar / Degree*" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Bachelor of Engineering" />
          <Input label="Institusi*" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Universitas..." />
          <Input label="Periode*" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="2021 — 2026" />
          <Textarea label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Prestasi / Achievements</label>
            {form.achievements.map((a, i) => (
              <div key={i} className="flex gap-2">
                <Input value={a} onChange={(e) => { const next = [...form.achievements]; next[i] = e.target.value; setForm({ ...form, achievements: next }); }} className="flex-1" placeholder="Prestasi..." />
                <button onClick={() => setForm({ ...form, achievements: form.achievements.filter((_, j) => j !== i) })} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, achievements: [...form.achievements, ""] })}>
              <Plus size={13} /> Tambah
            </Button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={submit} isLoading={isSubmitting}>Simpan</Button>
            <Button variant="secondary" onClick={cancel}>Batal</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Belum ada data pendidikan.</div>
      ) : (
        <div className="space-y-3">
          {items.map((edu) => (
            <div key={edu.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                <p className="text-sm text-gray-500">{edu.institution} · {edu.period}</p>
                {edu.achievements.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {edu.achievements.map((a, i) => (
                      <li key={i} className="text-xs text-gray-500 flex gap-1.5"><span className="text-blue-400">✦</span>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => openEdit(edu)}><Pencil size={13} /></Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(edu.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Education?" message="Tindakan ini tidak dapat dibatalkan." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} isLoading={isDeleting} />
    </div>
  );
}
