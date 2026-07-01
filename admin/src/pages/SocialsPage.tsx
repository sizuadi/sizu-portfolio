/**
 * Social Links CRUD Page
 */

import { useEffect, useState } from "react";
import { portfolioApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

interface Social {
  id: number;
  label: string;
  url: string;
  icon: string;
}

const EMPTY = { label: "", url: "", icon: "" };

export function SocialsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Social[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Social | null | false>(false);
  const [form, setForm] = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = async () => {
    const res = await portfolioApi.getSocials();
    if (res.success) setItems((res.data as Social[]) ?? []);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); };
  const openEdit = (s: Social) => { setEditing(s); setForm({ label: s.label, url: s.url, icon: s.icon }); };
  const cancel = () => { setEditing(false); setForm(EMPTY); };

  const submit = async () => {
    if (!form.label || !form.url) { toast("Label dan URL wajib diisi", "error"); return; }
    setIsSubmitting(true);

    const res = editing
      ? await portfolioApi.updateSocial((editing as Social).id, form)
      : await portfolioApi.createSocial(form);

    setIsSubmitting(false);
    if (res.success) { toast(editing ? "Social diperbarui" : "Social ditambahkan"); cancel(); load(); }
    else toast(res.error ?? "Gagal", "error");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await portfolioApi.deleteSocial(deleteTarget);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (res.success) { toast("Social dihapus"); load(); }
    else toast(res.error ?? "Gagal", "error");
  };

  const isFormOpen = editing !== false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Links</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} link sosial</p>
        </div>
        <Button onClick={openNew}><Plus size={15} /> Tambah</Button>
      </div>

      {isFormOpen && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-900">{editing ? "Edit Social" : "Tambah Social"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Label*" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="GitHub" />
            <Input label="Icon*" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="github" hint="Nama icon: github, linkedin, twitter, dll" />
          </div>
          <Input label="URL*" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://github.com/..." />

          <div className="flex gap-3 pt-2">
            <Button onClick={submit} isLoading={isSubmitting}>Simpan</Button>
            <Button variant="secondary" onClick={cancel}>Batal</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">{[1,2].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Belum ada social link.</div>
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 uppercase shrink-0">
                {s.icon.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900">{s.label}</p>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
                  {s.url} <ExternalLink size={10} />
                </a>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil size={13} /></Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(s.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Social Link?" message="Tindakan ini tidak dapat dibatalkan." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} isLoading={isDeleting} />
    </div>
  );
}
