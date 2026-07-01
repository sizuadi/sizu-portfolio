/**
 * About & Skills Page
 * Edit paragraf about dan daftar skills
 */

import { useEffect, useState } from "react";
import { portfolioApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { TagInput } from "@/components/ui/TagInput";
import { useToast } from "@/components/ui/Toast";
import { Plus, Trash2 } from "lucide-react";

export function AboutPage() {
  const { toast } = useToast();
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [isSavingSkills, setIsSavingSkills] = useState(false);

  useEffect(() => {
    Promise.all([portfolioApi.getAbout(), portfolioApi.getSkills()]).then(([about, skills]) => {
      setParagraphs((about.data as string[]) ?? []);
      setSkills((skills.data as string[]) ?? []);
      setIsLoading(false);
    });
  }, []);

  const saveAbout = async () => {
    setIsSavingAbout(true);
    const res = await portfolioApi.updateAbout(paragraphs);
    setIsSavingAbout(false);
    if (res.success) toast("About berhasil disimpan");
    else toast(res.error ?? "Gagal menyimpan", "error");
  };

  const saveSkills = async () => {
    setIsSavingSkills(true);
    const res = await portfolioApi.updateSkills(skills);
    setIsSavingSkills(false);
    if (res.success) toast("Skills berhasil disimpan");
    else toast(res.error ?? "Gagal menyimpan", "error");
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-32 bg-gray-200 rounded-xl" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">About & Skills</h1>
        <p className="text-sm text-gray-500 mt-1">Edit deskripsi tentang diri dan daftar skill</p>
      </div>

      {/* ── About Paragraphs ─────────────── */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Paragraf About</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setParagraphs([...paragraphs, ""])}
          >
            <Plus size={14} /> Tambah Paragraf
          </Button>
        </div>

        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xs text-gray-400 pt-2.5 w-5 shrink-0">{i + 1}</span>
              <Textarea
                value={p}
                onChange={(e) => {
                  const next = [...paragraphs];
                  next[i] = e.target.value;
                  setParagraphs(next);
                }}
                rows={4}
                className="flex-1"
                placeholder="Tulis paragraf tentang diri kamu..."
              />
              <button
                onClick={() => setParagraphs(paragraphs.filter((_, j) => j !== i))}
                className="text-gray-300 hover:text-red-500 pt-2 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={saveAbout} isLoading={isSavingAbout}>
            Simpan About
          </Button>
        </div>
      </section>

      {/* ── Skills ───────────────────────── */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Skills</h2>

        <TagInput
          value={skills}
          onChange={setSkills}
          placeholder="Contoh: TypeScript, Go, Docker..."
        />

        <div className="flex justify-end">
          <Button onClick={saveSkills} isLoading={isSavingSkills}>
            Simpan Skills
          </Button>
        </div>
      </section>
    </div>
  );
}
