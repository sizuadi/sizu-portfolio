/**
 * Settings Page — ganti password & update meta portfolio
 */

import { useEffect, useState } from "react";
import { authApi, portfolioApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";

interface Meta {
  name: string;
  title: string;
  tagline: string;
  email: string;
  resume_link: string;
}

export function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();

  // ── Meta ─────────────────────────────────
  const [meta, setMeta] = useState<Meta>({ name: "", title: "", tagline: "", email: "", resume_link: "" });
  const [isSavingMeta, setIsSavingMeta] = useState(false);

  // ── Password ──────────────────────────────
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [isSavingPw, setIsSavingPw] = useState(false);

  useEffect(() => {
    portfolioApi.getMeta().then((res) => {
      if (res.success && res.data) setMeta(res.data as Meta);
    });
  }, []);

  const saveMeta = async () => {
    setIsSavingMeta(true);
    const res = await portfolioApi.updateMeta({
      name: meta.name,
      title: meta.title,
      tagline: meta.tagline,
      email: meta.email,
      resumeLink: meta.resume_link,
    });
    setIsSavingMeta(false);
    if (res.success) toast("Meta portfolio diperbarui");
    else toast(res.error ?? "Gagal", "error");
  };

  const changePassword = async () => {
    if (!pwForm.current || !pwForm.next) { toast("Semua field password wajib diisi", "error"); return; }
    if (pwForm.next !== pwForm.confirm) { toast("Password baru dan konfirmasi tidak cocok", "error"); return; }
    if (pwForm.next.length < 8) { toast("Password baru minimal 8 karakter", "error"); return; }

    setIsSavingPw(true);
    const res = await authApi.changePassword(pwForm.current, pwForm.next);
    setIsSavingPw(false);

    if (res.success) {
      toast("Password berhasil diubah. Silakan login ulang.");
      setPwForm({ current: "", next: "", confirm: "" });
    } else {
      toast(res.error ?? "Gagal mengubah password", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Konfigurasi portfolio dan akun</p>
      </div>

      {/* ── Portfolio Meta ────────────────── */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Informasi Portfolio</h2>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Nama" value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} />
          <Input label="Title / Jabatan" value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} />
        </div>

        <Input label="Tagline" value={meta.tagline} onChange={(e) => setMeta({ ...meta, tagline: e.target.value })} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Email" type="email" value={meta.email} onChange={(e) => setMeta({ ...meta, email: e.target.value })} />
          <Input label="Link Resume" value={meta.resume_link} onChange={(e) => setMeta({ ...meta, resume_link: e.target.value })} placeholder="https://drive.google.com/..." />
        </div>

        <div className="flex justify-end">
          <Button onClick={saveMeta} isLoading={isSavingMeta}>Simpan Meta</Button>
        </div>
      </section>

      {/* ── Change Password ───────────────── */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-900">Ganti Password</h2>
          <p className="text-sm text-gray-500 mt-0.5">Akun: <span className="text-gray-700">{user?.email}</span></p>
        </div>

        <Input label="Password Saat Ini" type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} autoComplete="current-password" />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Password Baru" type="password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} autoComplete="new-password" hint="Minimal 8 karakter" />
          <Input label="Konfirmasi Password Baru" type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} autoComplete="new-password" />
        </div>

        <div className="flex justify-end">
          <Button onClick={changePassword} isLoading={isSavingPw}>Ganti Password</Button>
        </div>
      </section>

      {/* ── Info ─────────────────────────── */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-500 space-y-1">
        <p className="font-medium text-gray-700">Info Keamanan</p>
        <p>• Token disimpan sebagai HttpOnly cookie — tidak bisa diakses JavaScript</p>
        <p>• Access token berlaku selama 15 menit; diperbarui otomatis oleh browser</p>
        <p>• Ganti password akan me-logout semua session aktif</p>
      </section>
    </div>
  );
}
