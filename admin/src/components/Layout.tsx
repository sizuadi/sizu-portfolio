/**
 * Admin Layout — sidebar + main content
 */

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  FolderKanban,
  FileText,
  Share2,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/about", label: "About & Skills", icon: User },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/education", label: "Education", icon: GraduationCap },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/posts", label: "Blog Posts", icon: FileText },
  { href: "/socials", label: "Social Links", icon: Share2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ─────────────────────── */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-10">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Sizu Admin</p>
              <p className="text-xs text-gray-500">Portfolio CMS</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={16} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────── */}
      <main className="flex-1 ml-60">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
