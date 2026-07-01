/**
 * usePortfolioData Hook
 *
 * Fetch data portfolio dari API saat mount.
 * Fallback ke data statis (portfolio.ts) jika API tidak tersedia.
 *
 * Ini memungkinkan portfolio tetap bekerja saat backend down
 * dan secara otomatis menggunakan data terbaru jika backend aktif.
 */

import { useState, useEffect } from "react";
import { portfolio as staticPortfolio } from "@/data/portfolio";
import { portfolioApiClient } from "@/lib/api";
import type { PortfolioData } from "@/types/portfolio";

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(staticPortfolio);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromApi, setIsFromApi] = useState(false);

  useEffect(() => {
    portfolioApiClient.getAll()
      .then((apiData) => {
        if (apiData) {
          // Map snake_case dari API ke camelCase sesuai PortfolioData
          const mapped = mapApiToPortfolioData(apiData as ApiPortfolioData);
          setData(mapped);
          setIsFromApi(true);
        }
        // Jika null → tetap pakai static data (sudah jadi default state)
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, isFromApi };
}

// ─────────────────────────────────────────
// API response type (dari backend)
// ─────────────────────────────────────────

interface ApiPortfolioData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  resumeLink: string;
  about: string[];
  skills: string[];
  experience: ApiExperience[];
  education: ApiEducation[];
  projects: ApiProject[];
  socials: ApiSocial[];
}

interface ApiExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  impact: string[];
  tech: string[];
}

interface ApiEducation {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  achievements: string[];
}

interface ApiProject {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tech: string[];
  highlights: string[];
}

interface ApiSocial {
  id: number;
  label: string;
  url: string;
  icon: string;
}

function mapApiToPortfolioData(api: ApiPortfolioData): PortfolioData {
  return {
    name: api.name,
    title: api.title,
    tagline: api.tagline,
    email: api.email,
    resumeLink: api.resumeLink,
    about: api.about,
    skills: api.skills,
    experience: api.experience.map((exp) => ({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      impact: exp.impact,
      tech: exp.tech,
    })),
    education: api.education.map((edu) => ({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      description: edu.description,
      achievements: edu.achievements,
    })),
    projects: api.projects.map((proj) => ({
      id: proj.id,
      title: proj.title,
      description: proj.description,
      image: proj.image,
      link: proj.link,
      github: proj.github,
      tech: proj.tech,
      highlights: proj.highlights,
    })),
    socials: api.socials.map((s) => ({
      label: s.label,
      url: s.url,
      icon: s.icon,
    })),
  };
}
