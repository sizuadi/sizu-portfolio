import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PostsSection } from "@/components/sections/PostsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PostPage } from "@/pages/PostPage";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { StarfallCanvas } from "@/components/ui/StarfallCanvas";
import { usePortfolioData } from "@/hooks/usePortfolioData";

function HomePage() {
  // Data portfolio diambil dari API; fallback ke data statis jika backend down
  const { data: portfolio } = usePortfolioData();

  return (
    <div className="bg-white dark:bg-black text-neutral-900 dark:text-white font-[Space_Grotesk,Inter,system-ui,sans-serif] min-h-screen transition-colors duration-300">
      <SEO
        title={`${portfolio.name} — Fullstack Engineer`}
        description="Sizu Dev — Fullstack Engineer. Building systems that scale and interfaces that feel right."
        name={portfolio.name}
        type="website"
        url="https://sizuwano.com/"
      />
      <Navbar name={portfolio.name} />
      <HeroSection data={portfolio} />
      <AboutSection data={portfolio} />
      <WorkSection data={portfolio} />
      <EducationSection data={portfolio} />
      <ProjectsSection data={portfolio} />
      <PostsSection />
      <ContactSection email={portfolio.email} />
      <Footer name={portfolio.name} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StarfallCanvas />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:slug" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  );
}
