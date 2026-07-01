/**
 * Portfolio Repository
 *
 * Akses data untuk semua entitas portfolio.
 * SOLID: Single Responsibility — hanya query DB, tidak ada business logic.
 */

import { db } from "@/shared/database/client";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export interface PortfolioMetaRow {
  name: string;
  title: string;
  tagline: string;
  email: string;
  resume_link: string;
}

export interface AboutRow {
  id: number;
  content: string;
  sort_order: number;
}

export interface SkillRow {
  id: number;
  name: string;
  sort_order: number;
}

export interface ExperienceRow {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  sort_order: number;
}

export interface EducationRow {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  sort_order: number;
}

export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string | null;
  github: string | null;
  sort_order: number;
}

export interface SocialRow {
  id: number;
  label: string;
  url: string;
  icon: string;
  sort_order: number;
}

// ─────────────────────────────────────────
// Repository Class
// ─────────────────────────────────────────

export class PortfolioRepository {
  // ── Meta ─────────────────────────────────

  getMeta(): PortfolioMetaRow | null {
    return db.query<PortfolioMetaRow, []>(
      "SELECT name, title, tagline, email, resume_link FROM portfolio_meta WHERE id = 1"
    ).get();
  }

  updateMeta(data: Partial<PortfolioMetaRow>): void {
    const keys = Object.keys(data);
    if (keys.length === 0) return;
    const fields = keys.map((k) => `${k} = ?`).join(", ");
    const values = [...Object.values(data)];
    db.run(`UPDATE portfolio_meta SET ${fields}, updated_at = datetime('now') WHERE id = 1`, values);
  }

  // ── About ─────────────────────────────────

  getAbouts(): AboutRow[] {
    return db.query<AboutRow, []>(
      "SELECT id, content, sort_order FROM about_paragraphs ORDER BY sort_order ASC"
    ).all();
  }

  replaceAbouts(paragraphs: string[]): void {
    db.run("DELETE FROM about_paragraphs");
    paragraphs.forEach((content, i) => {
      db.run("INSERT INTO about_paragraphs (content, sort_order) VALUES (?, ?)", [content, i]);
    });
  }

  // ── Skills ────────────────────────────────

  getSkills(): SkillRow[] {
    return db.query<SkillRow, []>(
      "SELECT id, name, sort_order FROM skills ORDER BY sort_order ASC"
    ).all();
  }

  replaceSkills(skills: string[]): void {
    db.run("DELETE FROM skills");
    skills.forEach((name, i) => {
      db.run("INSERT INTO skills (name, sort_order) VALUES (?, ?)", [name, i]);
    });
  }

  // ── Experiences ───────────────────────────

  getExperiences(): ExperienceRow[] {
    return db.query<ExperienceRow, []>(
      "SELECT id, role, company, period, description, sort_order FROM experiences ORDER BY sort_order ASC"
    ).all();
  }

  getExperienceById(id: string): ExperienceRow | null {
    return db.query<ExperienceRow, [string]>(
      "SELECT id, role, company, period, description, sort_order FROM experiences WHERE id = ?"
    ).get(id);
  }

  getExperienceImpacts(experienceId: string): string[] {
    return db.query<{ content: string }, [string]>(
      "SELECT content FROM experience_impacts WHERE experience_id = ? ORDER BY sort_order ASC"
    ).all(experienceId).map((r) => r.content);
  }

  getExperienceTechs(experienceId: string): string[] {
    return db.query<{ name: string }, [string]>(
      "SELECT name FROM experience_techs WHERE experience_id = ? ORDER BY sort_order ASC"
    ).all(experienceId).map((r) => r.name);
  }

  createExperience(id: string, data: Omit<ExperienceRow, "id">, impacts: string[], techs: string[]): void {
    db.transaction(() => {
      db.run(
        "INSERT INTO experiences (id, role, company, period, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
        [id, data.role, data.company, data.period, data.description, data.sort_order]
      );
      this._replaceExperienceRelations(id, impacts, techs);
    })();
  }

  updateExperience(id: string, data: Partial<Omit<ExperienceRow, "id">>, impacts?: string[], techs?: string[]): void {
    db.transaction(() => {
      if (Object.keys(data).length > 0) {
        const fields = Object.keys(data).map((k) => `${k} = ?`).join(", ");
        const values = [...Object.values(data), id];
        db.run(`UPDATE experiences SET ${fields}, updated_at = datetime('now') WHERE id = ?`, values);
      }
      if (impacts) this._replaceImpacts(id, impacts);
      if (techs) this._replaceExperienceTechs(id, techs);
    })();
  }

  deleteExperience(id: string): void {
    db.run("DELETE FROM experiences WHERE id = ?", [id]);
  }

  private _replaceExperienceRelations(id: string, impacts: string[], techs: string[]): void {
    this._replaceImpacts(id, impacts);
    this._replaceExperienceTechs(id, techs);
  }

  private _replaceImpacts(experienceId: string, impacts: string[]): void {
    db.run("DELETE FROM experience_impacts WHERE experience_id = ?", [experienceId]);
    impacts.forEach((content, i) => {
      db.run("INSERT INTO experience_impacts (experience_id, content, sort_order) VALUES (?, ?, ?)", [experienceId, content, i]);
    });
  }

  private _replaceExperienceTechs(experienceId: string, techs: string[]): void {
    db.run("DELETE FROM experience_techs WHERE experience_id = ?", [experienceId]);
    techs.forEach((name, i) => {
      db.run("INSERT INTO experience_techs (experience_id, name, sort_order) VALUES (?, ?, ?)", [experienceId, name, i]);
    });
  }

  // ── Educations ────────────────────────────

  getEducations(): EducationRow[] {
    return db.query<EducationRow, []>(
      "SELECT id, degree, institution, period, description, sort_order FROM educations ORDER BY sort_order ASC"
    ).all();
  }

  getEducationById(id: string): EducationRow | null {
    return db.query<EducationRow, [string]>(
      "SELECT id, degree, institution, period, description, sort_order FROM educations WHERE id = ?"
    ).get(id);
  }

  getEducationAchievements(educationId: string): string[] {
    return db.query<{ content: string }, [string]>(
      "SELECT content FROM education_achievements WHERE education_id = ? ORDER BY sort_order ASC"
    ).all(educationId).map((r) => r.content);
  }

  createEducation(id: string, data: Omit<EducationRow, "id">, achievements: string[]): void {
    db.transaction(() => {
      db.run(
        "INSERT INTO educations (id, degree, institution, period, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
        [id, data.degree, data.institution, data.period, data.description, data.sort_order]
      );
      this._replaceAchievements(id, achievements);
    })();
  }

  updateEducation(id: string, data: Partial<Omit<EducationRow, "id">>, achievements?: string[]): void {
    db.transaction(() => {
      if (Object.keys(data).length > 0) {
        const fields = Object.keys(data).map((k) => `${k} = ?`).join(", ");
        const values = [...Object.values(data), id];
        db.run(`UPDATE educations SET ${fields}, updated_at = datetime('now') WHERE id = ?`, values);
      }
      if (achievements) this._replaceAchievements(id, achievements);
    })();
  }

  deleteEducation(id: string): void {
    db.run("DELETE FROM educations WHERE id = ?", [id]);
  }

  private _replaceAchievements(educationId: string, achievements: string[]): void {
    db.run("DELETE FROM education_achievements WHERE education_id = ?", [educationId]);
    achievements.forEach((content, i) => {
      db.run("INSERT INTO education_achievements (education_id, content, sort_order) VALUES (?, ?, ?)", [educationId, content, i]);
    });
  }

  // ── Projects ──────────────────────────────

  getProjects(): ProjectRow[] {
    return db.query<ProjectRow, []>(
      "SELECT id, title, description, image, link, github, sort_order FROM projects ORDER BY sort_order ASC"
    ).all();
  }

  getProjectById(id: string): ProjectRow | null {
    return db.query<ProjectRow, [string]>(
      "SELECT id, title, description, image, link, github, sort_order FROM projects WHERE id = ?"
    ).get(id);
  }

  getProjectTechs(projectId: string): string[] {
    return db.query<{ name: string }, [string]>(
      "SELECT name FROM project_techs WHERE project_id = ? ORDER BY sort_order ASC"
    ).all(projectId).map((r) => r.name);
  }

  getProjectHighlights(projectId: string): string[] {
    return db.query<{ content: string }, [string]>(
      "SELECT content FROM project_highlights WHERE project_id = ? ORDER BY sort_order ASC"
    ).all(projectId).map((r) => r.content);
  }

  createProject(id: string, data: Omit<ProjectRow, "id">, techs: string[], highlights: string[]): void {
    db.transaction(() => {
      db.run(
        "INSERT INTO projects (id, title, description, image, link, github, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, data.title, data.description, data.image, data.link, data.github, data.sort_order]
      );
      this._replaceProjectTechs(id, techs);
      this._replaceHighlights(id, highlights);
    })();
  }

  updateProject(
    id: string,
    data: Partial<Omit<ProjectRow, "id">>,
    techs?: string[],
    highlights?: string[]
  ): void {
    db.transaction(() => {
      if (Object.keys(data).length > 0) {
        const fields = Object.keys(data).map((k) => `${k} = ?`).join(", ");
        const values = [...Object.values(data), id];
        db.run(`UPDATE projects SET ${fields}, updated_at = datetime('now') WHERE id = ?`, values);
      }
      if (techs) this._replaceProjectTechs(id, techs);
      if (highlights) this._replaceHighlights(id, highlights);
    })();
  }

  deleteProject(id: string): void {
    db.run("DELETE FROM projects WHERE id = ?", [id]);
  }

  private _replaceProjectTechs(projectId: string, techs: string[]): void {
    db.run("DELETE FROM project_techs WHERE project_id = ?", [projectId]);
    techs.forEach((name, i) => {
      db.run("INSERT INTO project_techs (project_id, name, sort_order) VALUES (?, ?, ?)", [projectId, name, i]);
    });
  }

  private _replaceHighlights(projectId: string, highlights: string[]): void {
    db.run("DELETE FROM project_highlights WHERE project_id = ?", [projectId]);
    highlights.forEach((content, i) => {
      db.run("INSERT INTO project_highlights (project_id, content, sort_order) VALUES (?, ?, ?)", [projectId, content, i]);
    });
  }

  // ── Socials ───────────────────────────────

  getSocials(): SocialRow[] {
    return db.query<SocialRow, []>(
      "SELECT id, label, url, icon, sort_order FROM socials ORDER BY sort_order ASC"
    ).all();
  }

  createSocial(data: Omit<SocialRow, "id">): void {
    db.run(
      "INSERT INTO socials (label, url, icon, sort_order) VALUES (?, ?, ?, ?)",
      [data.label, data.url, data.icon, data.sort_order]
    );
  }

  updateSocial(id: number, data: Partial<Omit<SocialRow, "id">>): void {
    const fields = Object.keys(data).map((k) => `${k} = ?`).join(", ");
    db.run(`UPDATE socials SET ${fields} WHERE id = ?`, [...Object.values(data), id]);
  }

  deleteSocial(id: number): void {
    db.run("DELETE FROM socials WHERE id = ?", [id]);
  }
}
