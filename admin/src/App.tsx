import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { AboutPage } from "@/pages/AboutPage";
import { ExperiencePage } from "@/pages/ExperiencePage";
import { EducationPage } from "@/pages/EducationPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { PostsPage } from "@/pages/PostsPage";
import { SocialsPage } from "@/pages/SocialsPage";
import { SettingsPage } from "@/pages/SettingsPage";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AdminLayout><DashboardPage /></AdminLayout>} />
            <Route path="/about" element={<AdminLayout><AboutPage /></AdminLayout>} />
            <Route path="/experience" element={<AdminLayout><ExperiencePage /></AdminLayout>} />
            <Route path="/education" element={<AdminLayout><EducationPage /></AdminLayout>} />
            <Route path="/projects" element={<AdminLayout><ProjectsPage /></AdminLayout>} />
            <Route path="/posts" element={<AdminLayout><PostsPage /></AdminLayout>} />
            <Route path="/socials" element={<AdminLayout><SocialsPage /></AdminLayout>} />
            <Route path="/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
