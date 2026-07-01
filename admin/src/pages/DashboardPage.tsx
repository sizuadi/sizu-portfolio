import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { portfolioApi, postsApi } from "@/lib/api";
import { User, Briefcase, FolderKanban, FileText, ArrowRight } from "lucide-react";

interface Stats {
  experiences: number;
  projects: number;
  posts: number;
  skills: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      portfolioApi.getExperiences(),
      portfolioApi.getProjects(),
      postsApi.getAll(),
      portfolioApi.getSkills(),
    ]).then(([exp, proj, posts, skills]) => {
      setStats({
        experiences: (exp.data as unknown[])?.length ?? 0,
        projects: (proj.data as unknown[])?.length ?? 0,
        posts: (posts.data as unknown[])?.length ?? 0,
        skills: (skills.data as unknown[])?.length ?? 0,
      });
    });
  }, []);

  const cards = [
    { label: "Experiences", value: stats?.experiences, icon: Briefcase, href: "/experience", color: "text-blue-600 bg-blue-50" },
    { label: "Projects", value: stats?.projects, icon: FolderKanban, href: "/projects", color: "text-purple-600 bg-purple-50" },
    { label: "Blog Posts", value: stats?.posts, icon: FileText, href: "/posts", color: "text-emerald-600 bg-emerald-50" },
    { label: "Skills", value: stats?.skills, icon: User, href: "/about", color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Ringkasan konten portfolio Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            to={href}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all group"
          >
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {value ?? <span className="text-gray-300 text-lg">—</span>}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-500">{label}</p>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { href: "/posts?new=1", label: "✍️ Tulis Post Baru" },
            { href: "/projects?new=1", label: "➕ Tambah Project" },
            { href: "/experience?new=1", label: "💼 Tambah Experience" },
            { href: "/about", label: "📝 Edit About" },
            { href: "/settings", label: "🔐 Ganti Password" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="px-4 py-3 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
