export interface ExperienceEntry {
  id: string
  period: string
  tags: string[]
}

export interface EducationEntry {
  id: string
  period: string
}

export type ProjectCategory = 'dataEngineering' | 'softwareEngineering'
export type ProjectStatus = 'professional' | 'personal'

export interface ProjectEntry {
  id: string
  category: ProjectCategory
  tags: string[]
  status: ProjectStatus
}

export interface ClientEntry {
  id: string
  href: string
  logo: string
  alt: string
}

export interface SkillCategory {
  id: string
  tags: string[]
}

export interface SocialLink {
  id: string
  icon: string
  href: string
  label: string
}

export interface Profile {
  name: string
  nickname: string
  avatar: string
  email: string
  phone?: string
  location: string
  quote?: string
  social: SocialLink[]
  formspreeId: string
}

export interface CertificateEntry {
  id: string
  issuer: string
  show: boolean
  date?: string
  url?: string
  order?: number
  file: string
}

export interface AwardEntry {
  id: string
  issuer: string
  year: string
  date?: string
  url?: string
  order?: number
  file: string
}

export type Tab = 'about' | 'resume' | 'portfolio' | 'contact'
export type Theme = 'light' | 'dark'
export type Language = 'en-US' | 'vi-VN'
