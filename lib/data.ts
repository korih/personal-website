import portfolioData from "@/data/portfolio-data.json"
import { projects, getAllProjects, getProjectBySlug, getRelatedProjects } from "@/lib/projects"

export const data = portfolioData

export { projects, getAllProjects, getProjectBySlug, getRelatedProjects }

export type PortfolioData = typeof portfolioData

export function getNavItems() {
  return data.navigation
}

export function getPersonalInfo() {
  return data.personal
}

export function getAboutInfo() {
  return data.about
}

export function getExperienceInfo() {
  return data.experience
}

export function getCredentialsInfo() {
  return data.credentials
}

export function getTechnicalSkillsInfo() {
  return data.technicalSkills
}

export function getMetaInfo() {
  return data.meta
}
