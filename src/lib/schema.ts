import { z } from "zod";

export const LinkZ = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const HeaderZ = z.object({
  fullName: z.string().min(1),
  headline: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().min(5),
  email: z.string().email(),
  links: z.array(LinkZ).min(1),
});

export const EducationZ = z.object({
  institution: z.string(),
  location: z.string(),
  degree: z.string(),
  start: z.string().nullable().optional(),
  end: z.string(),
  gpaLabel: z.string().optional(),
  gpa: z.string().optional(),
  coursework: z.array(z.string()).optional(),
  honors: z.array(z.string()).optional(),
});

export const ProjectZ = z.object({
  name: z.string(),
  role: z.string().optional(),
  start: z.string().optional().nullable(),
  end: z.string().optional().nullable(),
  bullets: z.array(z.string().min(1)).min(1),
  tech: z.array(z.string()).optional(),
  links: z.array(LinkZ).optional(),
});

export const ExperienceZ = z.object({
  company: z.string(),
  title: z.string(),
  location: z.string().optional().nullable(),
  employmentType: z.string().optional(),
  start: z.string(),
  end: z.string(),
  bullets: z.array(z.string().min(1)).min(1),
  tech: z.array(z.string()).optional(),
});

export const TechnicalSkillsZ = z.object({
  programmingLanguages: z.array(z.string()).default([]),
  frameworks: z.array(z.string()).default([]),
  cloudDevOps: z.array(z.string()).default([]),
  databases: z.array(z.string()).default([]),
  dataPlatforms: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  other: z.array(z.string()).default([]),
});

export const ResumeZ = z.object({
  meta: z.object({
    version: z.number().int().positive(),
    generatedAtISO: z.string().optional(),
  }),
  header: HeaderZ,
  summary: z
    .object({
      paragraph: z.string().min(10),
      highlights: z.array(z.string()).default([]),
    })
    .optional(),
  education: z.array(EducationZ).min(1),
  projects: z.array(ProjectZ).default([]),
  experience: z.array(ExperienceZ).default([]),
  technicalSkills: TechnicalSkillsZ,
  achievements: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  keywordBank: z.array(z.string()).default([]),
});

export type ResumeData = z.infer<typeof ResumeZ>;
