/**
 * Portfolio Service
 *
 * Business logic untuk assembling data portfolio.
 * Repository hanya returns "flat" rows — service mengassemble ke shape yang dibutuhkan.
 */

import { PortfolioRepository } from "./portfolio.repository";
import { generateId } from "@/shared/utils/id";

// ─────────────────────────────────────────
// Domain Types (untuk response ke client)
// ─────────────────────────────────────────

export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  resumeLink: string;
  about: string[];
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  socials: Social[];
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
  achievements: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tech: string[];
  highlights: string[];
}

export interface Social {
  id: number;
  label: string;
  url: string;
  icon: string;
}

// ─────────────────────────────────────────
// Service
// ─────────────────────────────────────────

export class PortfolioService {
  constructor(private readonly repo: PortfolioRepository) {}

  /** Ambil semua data portfolio sekaligus (untuk public endpoint) */
  getAll(): PortfolioData | null {
    const meta = this.repo.getMeta();
    if (!meta) return null;

    return {
      name: meta.name,
      title: meta.title,
      tagline: meta.tagline,
      email: meta.email,
      resumeLink: meta.resume_link,
      about: this.repo.getAbouts().map((a) => a.content),
      skills: this.repo.getSkills().map((s) => s.name),
      experience: this.getExperiences(),
      education: this.getEducations(),
      projects: this.getProjects(),
      socials: this.repo.getSocials().map((s) => ({
        id: s.id,
        label: s.label,
        url: s.url,
        icon: s.icon,
      })),
    };
  }

  // ── Meta ─────────────────────────────────

  getMeta() {
    return this.repo.getMeta();
  }

  updateMeta(data: {
    name?: string;
    title?: string;
    tagline?: string;
    email?: string;
    resumeLink?: string;
  }) {
    const dbData: Record<string, string> = {};
    if (data.name) dbData.name = data.name;
    if (data.title) dbData.title = data.title;
    if (data.tagline) dbData.tagline = data.tagline;
    if (data.email) dbData.email = data.email;
    if (data.resumeLink) dbData.resume_link = data.resumeLink;

    this.repo.updateMeta(dbData);
  }

  // ── About ─────────────────────────────────

  getAbout(): string[] {
    return this.repo.getAbouts().map((a) => a.content);
  }

  updateAbout(paragraphs: string[]): void {
    this.repo.replaceAbouts(paragraphs);
  }

  // ── Skills ────────────────────────────────

  getSkills(): string[] {
    return this.repo.getSkills().map((s) => s.name);
  }

  updateSkills(skills: string[]): void {
    this.repo.replaceSkills(skills);
  }

  // ── Experiences ───────────────────────────

  getExperiences(): Experience[] {
    return this.repo.getExperiences().map((exp) => ({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      impact: this.repo.getExperienceImpacts(exp.id),
      tech: this.repo.getExperienceTechs(exp.id),
    }));
  }

  getExperienceById(id: string): Experience | null {
    const exp = this.repo.getExperienceById(id);
    if (!exp) return null;
    return {
      id: exp.id,
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      impact: this.repo.getExperienceImpacts(exp.id),
      tech: this.repo.getExperienceTechs(exp.id),
    };
  }

  createExperience(data: Omit<Experience, "id">): Experience {
    const id = generateId("exp");
    const sortOrder = this.repo.getExperiences().length;
    this.repo.createExperience(
      id,
      { ...data, sort_order: sortOrder, role: data.role, company: data.company, period: data.period, description: data.description },
      data.impact,
      data.tech
    );
    return { id, ...data };
  }

  updateExperience(
    id: string,
    data: Partial<Omit<Experience, "id">>
  ): Experience | null {
    const existing = this.repo.getExperienceById(id);
    if (!existing) return null;

    const { impact, tech, ...dbFields } = data;
    const mappedFields: Record<string, unknown> = {};
    if (dbFields.role) mappedFields.role = dbFields.role;
    if (dbFields.company) mappedFields.company = dbFields.company;
    if (dbFields.period) mappedFields.period = dbFields.period;
    if (dbFields.description) mappedFields.description = dbFields.description;

    this.repo.updateExperience(id, mappedFields, impact, tech);
    return this.getExperienceById(id);
  }

  deleteExperience(id: string): boolean {
    const existing = this.repo.getExperienceById(id);
    if (!existing) return false;
    this.repo.deleteExperience(id);
    return true;
  }

  // ── Educations ────────────────────────────

  getEducations(): Education[] {
    return this.repo.getEducations().map((edu) => ({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      description: edu.description,
      achievements: this.repo.getEducationAchievements(edu.id),
    }));
  }

  getEducationById(id: string): Education | null {
    const edu = this.repo.getEducationById(id);
    if (!edu) return null;
    return {
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      description: edu.description,
      achievements: this.repo.getEducationAchievements(edu.id),
    };
  }

  createEducation(data: Omit<Education, "id">): Education {
    const id = generateId("edu");
    const sortOrder = this.repo.getEducations().length;
    this.repo.createEducation(
      id,
      { degree: data.degree, institution: data.institution, period: data.period, description: data.description, sort_order: sortOrder },
      data.achievements
    );
    return { id, ...data };
  }

  updateEducation(id: string, data: Partial<Omit<Education, "id">>): Education | null {
    const existing = this.repo.getEducationById(id);
    if (!existing) return null;

    const { achievements, ...dbFields } = data;
    const mappedFields: Record<string, unknown> = {};
    if (dbFields.degree) mappedFields.degree = dbFields.degree;
    if (dbFields.institution) mappedFields.institution = dbFields.institution;
    if (dbFields.period) mappedFields.period = dbFields.period;
    if (dbFields.description) mappedFields.description = dbFields.description;

    this.repo.updateEducation(id, mappedFields, achievements);
    return this.getEducationById(id);
  }

  deleteEducation(id: string): boolean {
    const existing = this.repo.getEducationById(id);
    if (!existing) return false;
    this.repo.deleteEducation(id);
    return true;
  }

  // ── Projects ──────────────────────────────

  getProjects(): Project[] {
    return this.repo.getProjects().map((proj) => ({
      id: proj.id,
      title: proj.title,
      description: proj.description,
      image: proj.image,
      link: proj.link ?? undefined,
      github: proj.github ?? undefined,
      tech: this.repo.getProjectTechs(proj.id),
      highlights: this.repo.getProjectHighlights(proj.id),
    }));
  }

  getProjectById(id: string): Project | null {
    const proj = this.repo.getProjectById(id);
    if (!proj) return null;
    return {
      id: proj.id,
      title: proj.title,
      description: proj.description,
      image: proj.image,
      link: proj.link ?? undefined,
      github: proj.github ?? undefined,
      tech: this.repo.getProjectTechs(proj.id),
      highlights: this.repo.getProjectHighlights(proj.id),
    };
  }

  createProject(data: Omit<Project, "id">): Project {
    const id = generateId("proj");
    const sortOrder = this.repo.getProjects().length;
    this.repo.createProject(
      id,
      {
        title: data.title,
        description: data.description,
        image: data.image,
        link: data.link ?? null,
        github: data.github ?? null,
        sort_order: sortOrder,
      },
      data.tech,
      data.highlights
    );
    return { id, ...data };
  }

  updateProject(id: string, data: Partial<Omit<Project, "id">>): Project | null {
    const existing = this.repo.getProjectById(id);
    if (!existing) return null;

    const { tech, highlights, ...dbFields } = data;
    const mappedFields: Record<string, unknown> = {};
    if (dbFields.title !== undefined) mappedFields.title = dbFields.title;
    if (dbFields.description !== undefined) mappedFields.description = dbFields.description;
    if (dbFields.image !== undefined) mappedFields.image = dbFields.image;
    if ("link" in dbFields) mappedFields.link = dbFields.link ?? null;
    if ("github" in dbFields) mappedFields.github = dbFields.github ?? null;

    this.repo.updateProject(id, mappedFields, tech, highlights);
    return this.getProjectById(id);
  }

  deleteProject(id: string): boolean {
    const existing = this.repo.getProjectById(id);
    if (!existing) return false;
    this.repo.deleteProject(id);
    return true;
  }

  // ── Socials ───────────────────────────────

  getSocials(): Social[] {
    return this.repo.getSocials().map((s) => ({
      id: s.id,
      label: s.label,
      url: s.url,
      icon: s.icon,
    }));
  }

  createSocial(data: Omit<Social, "id">): void {
    const sortOrder = this.repo.getSocials().length;
    this.repo.createSocial({ ...data, sort_order: sortOrder });
  }

  updateSocial(id: number, data: Partial<Omit<Social, "id">>): void {
    this.repo.updateSocial(id, data);
  }

  deleteSocial(id: number): void {
    this.repo.deleteSocial(id);
  }
}
