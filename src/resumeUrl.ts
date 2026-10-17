import profile from './data/profile.json'
import type { Profile } from './types'

const { legalName, name } = profile as Profile

// Download buttons are hidden for now: role-specific PDFs (Data Engineer and
// Software Engineer) are still published to /assets and sent per application.
export const SHOW_RESUME_DOWNLOAD = false

// Must match the filename the CV repo publishes (scripts/filename.py, web style).
export const RESUME_URL = `/assets/${(legalName || name).replace(/\s+/g, '-')}-Resume.pdf`
