import profile from './data/profile.json'
import type { Profile } from './types'

const { legalName, name } = profile as Profile

// Must match the filename the CV repo publishes (scripts/filename.py, web style).
export const RESUME_URL = `/assets/${(legalName || name).replace(/\s+/g, '-')}-Resume.pdf`
