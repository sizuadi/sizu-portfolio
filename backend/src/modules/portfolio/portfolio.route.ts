/**
 * Portfolio Routes
 *
 * PUBLIC (tidak perlu auth):
 *   GET  /api/portfolio          — semua data portfolio sekaligus
 *   GET  /api/portfolio/meta     — meta (name, title, tagline, email)
 *   GET  /api/portfolio/about    — paragraf about
 *   GET  /api/portfolio/skills   — daftar skill
 *   GET  /api/portfolio/experience        — semua experience
 *   GET  /api/portfolio/experience/:id
 *   GET  /api/portfolio/education         — semua education
 *   GET  /api/portfolio/education/:id
 *   GET  /api/portfolio/projects          — semua project
 *   GET  /api/portfolio/projects/:id
 *   GET  /api/portfolio/socials           — social links
 *
 * PRIVATE (perlu auth — admin panel):
 *   PUT  /api/portfolio/meta
 *   PUT  /api/portfolio/about
 *   PUT  /api/portfolio/skills
 *   POST /api/portfolio/experience
 *   PUT  /api/portfolio/experience/:id
 *   DEL  /api/portfolio/experience/:id
 *   POST /api/portfolio/education
 *   PUT  /api/portfolio/education/:id
 *   DEL  /api/portfolio/education/:id
 *   POST /api/portfolio/projects
 *   PUT  /api/portfolio/projects/:id
 *   DEL  /api/portfolio/projects/:id
 *   POST /api/portfolio/socials
 *   PUT  /api/portfolio/socials/:id
 *   DEL  /api/portfolio/socials/:id
 */

import Elysia from "elysia";
import { PortfolioService } from "./portfolio.service";
import { PortfolioRepository } from "./portfolio.repository";
import { authGuard } from "@/shared/middleware/auth";
import { ok, fail } from "@/shared/utils/response";
import {
  updateMetaSchema,
  updateAboutSchema,
  updateSkillsSchema,
  experienceSchema,
  partialExperienceSchema,
  educationSchema,
  partialEducationSchema,
  projectSchema,
  partialProjectSchema,
  socialSchema,
  partialSocialSchema,
} from "./portfolio.schema";

const portfolioService = new PortfolioService(new PortfolioRepository());

// ─────────────────────────────────────────
// Public routes (baca saja)
// ─────────────────────────────────────────

const publicRoutes = new Elysia({ prefix: "/portfolio" })

  .get("/", () => {
    const data = portfolioService.getAll();
    return data ? ok(data) : fail("Data portfolio belum diinisialisasi", null);
  })

  .get("/meta", () => ok(portfolioService.getMeta()))

  .get("/about", () => ok(portfolioService.getAbout()))

  .get("/skills", () => ok(portfolioService.getSkills()))

  // Experience
  .get("/experience", () => ok(portfolioService.getExperiences()))
  .get("/experience/:id", ({ params, set }) => {
    const data = portfolioService.getExperienceById(params.id);
    if (!data) { set.status = 404; return fail("Experience tidak ditemukan"); }
    return ok(data);
  })

  // Education
  .get("/education", () => ok(portfolioService.getEducations()))
  .get("/education/:id", ({ params, set }) => {
    const data = portfolioService.getEducationById(params.id);
    if (!data) { set.status = 404; return fail("Education tidak ditemukan"); }
    return ok(data);
  })

  // Projects
  .get("/projects", () => ok(portfolioService.getProjects()))
  .get("/projects/:id", ({ params, set }) => {
    const data = portfolioService.getProjectById(params.id);
    if (!data) { set.status = 404; return fail("Project tidak ditemukan"); }
    return ok(data);
  })

  // Socials
  .get("/socials", () => ok(portfolioService.getSocials()));

// ─────────────────────────────────────────
// Private routes (butuh JWT)
// ─────────────────────────────────────────

const privateRoutes = new Elysia({ prefix: "/portfolio" })
  .use(authGuard)

  // ── Meta ─────────────────────────────────
  .put("/meta", ({ body }) => {
    portfolioService.updateMeta(body);
    return ok(portfolioService.getMeta(), "Meta diperbarui");
  }, { body: updateMetaSchema })

  // ── About ─────────────────────────────────
  .put("/about", ({ body }) => {
    portfolioService.updateAbout(body.paragraphs);
    return ok(portfolioService.getAbout(), "About diperbarui");
  }, { body: updateAboutSchema })

  // ── Skills ────────────────────────────────
  .put("/skills", ({ body }) => {
    portfolioService.updateSkills(body.skills);
    return ok(portfolioService.getSkills(), "Skills diperbarui");
  }, { body: updateSkillsSchema })

  // ── Experience ────────────────────────────
  .post("/experience", ({ body }) => {
    const data = portfolioService.createExperience(body);
    return ok(data, "Experience ditambahkan");
  }, { body: experienceSchema })

  .put("/experience/:id", ({ params, body, set }) => {
    const data = portfolioService.updateExperience(params.id, body);
    if (!data) { set.status = 404; return fail("Experience tidak ditemukan"); }
    return ok(data, "Experience diperbarui");
  }, { body: partialExperienceSchema })

  .delete("/experience/:id", ({ params, set }) => {
    const deleted = portfolioService.deleteExperience(params.id);
    if (!deleted) { set.status = 404; return fail("Experience tidak ditemukan"); }
    return ok(null, "Experience dihapus");
  })

  // ── Education ─────────────────────────────
  .post("/education", ({ body }) => {
    const data = portfolioService.createEducation(body);
    return ok(data, "Education ditambahkan");
  }, { body: educationSchema })

  .put("/education/:id", ({ params, body, set }) => {
    const data = portfolioService.updateEducation(params.id, body);
    if (!data) { set.status = 404; return fail("Education tidak ditemukan"); }
    return ok(data, "Education diperbarui");
  }, { body: partialEducationSchema })

  .delete("/education/:id", ({ params, set }) => {
    const deleted = portfolioService.deleteEducation(params.id);
    if (!deleted) { set.status = 404; return fail("Education tidak ditemukan"); }
    return ok(null, "Education dihapus");
  })

  // ── Projects ──────────────────────────────
  .post("/projects", ({ body }) => {
    const data = portfolioService.createProject(body);
    return ok(data, "Project ditambahkan");
  }, { body: projectSchema })

  .put("/projects/:id", ({ params, body, set }) => {
    const data = portfolioService.updateProject(params.id, body);
    if (!data) { set.status = 404; return fail("Project tidak ditemukan"); }
    return ok(data, "Project diperbarui");
  }, { body: partialProjectSchema })

  .delete("/projects/:id", ({ params, set }) => {
    const deleted = portfolioService.deleteProject(params.id);
    if (!deleted) { set.status = 404; return fail("Project tidak ditemukan"); }
    return ok(null, "Project dihapus");
  })

  // ── Socials ───────────────────────────────
  .post("/socials", ({ body }) => {
    portfolioService.createSocial(body);
    return ok(portfolioService.getSocials(), "Social ditambahkan");
  }, { body: socialSchema })

  .put("/socials/:id", ({ params, body }) => {
    portfolioService.updateSocial(Number(params.id), body);
    return ok(null, "Social diperbarui");
  }, { body: partialSocialSchema })

  .delete("/socials/:id", ({ params }) => {
    portfolioService.deleteSocial(Number(params.id));
    return ok(null, "Social dihapus");
  });

/** Export keduanya untuk digabung di index.ts */
export const portfolioRoute = new Elysia()
  .use(publicRoutes)
  .use(privateRoutes);
