export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link?: string;
  github?: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  impact: string[];
  tech: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  achievements?: string[];
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  resumeLink: string;
  tagline: string;
  about: string[];
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  socials: SocialLink[];
  email: string;
}

export type Theme = "light" | "dark" | "system";
