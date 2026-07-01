/**
 * Portfolio Validation Schemas
 */

import { t } from "elysia";

export const updateMetaSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  title: t.Optional(t.String({ minLength: 1 })),
  tagline: t.Optional(t.String({ minLength: 1 })),
  email: t.Optional(t.String({ format: "email" })),
  resumeLink: t.Optional(t.String()),
});

export const updateAboutSchema = t.Object({
  paragraphs: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
});

export const updateSkillsSchema = t.Object({
  skills: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
});

export const experienceSchema = t.Object({
  role: t.String({ minLength: 1 }),
  company: t.String({ minLength: 1 }),
  period: t.String({ minLength: 1 }),
  description: t.String({ minLength: 1 }),
  impact: t.Array(t.String({ minLength: 1 })),
  tech: t.Array(t.String({ minLength: 1 })),
});

export const partialExperienceSchema = t.Partial(experienceSchema);

export const educationSchema = t.Object({
  degree: t.String({ minLength: 1 }),
  institution: t.String({ minLength: 1 }),
  period: t.String({ minLength: 1 }),
  description: t.String({ minLength: 1 }),
  achievements: t.Array(t.String()),
});

export const partialEducationSchema = t.Partial(educationSchema);

export const projectSchema = t.Object({
  title: t.String({ minLength: 1 }),
  description: t.String({ minLength: 1 }),
  image: t.String(),
  link: t.Optional(t.String()),
  github: t.Optional(t.String()),
  tech: t.Array(t.String({ minLength: 1 })),
  highlights: t.Array(t.String()),
});

export const partialProjectSchema = t.Partial(projectSchema);

export const socialSchema = t.Object({
  label: t.String({ minLength: 1 }),
  url: t.String({ minLength: 1 }),
  icon: t.String({ minLength: 1 }),
});

export const partialSocialSchema = t.Partial(socialSchema);
