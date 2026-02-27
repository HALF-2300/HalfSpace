import fs from 'fs'
import path from 'path'

export type DataFileStatus = {
  path: string
  status: 'ok' | 'failed'
  message: string
  errors?: string[]
  hasRequiredFields?: boolean
}

export type HealthCheckResult = {
  timestamp: string
  overallStatus: 'ok' | 'warning' | 'error'
  dataFiles: DataFileStatus[]
  routes: {
    sitemap: any[]
    sections: any[]
  }
  errors: string[]
}

// List of all data files used in space
const SPACE_DATA_FILES = [
  // Main data files
  'data/spaceSitemap.json',
  'data/spaceKnowledgeHub.json',
  'data/courseV2.json',
  'data/quizzes.json',
  'data/handbook.json',
  'data/atlas.json',
  'data/gallery.json',
  'data/spaceLibrary.json',
  'data/myths.json',
  'data/mythQuiz.json',
  'data/blackHoleLab.copy.json',
  'data/observatory2.json',
  'data/spaceWhatsNew.json',
  'data/spaceLabContent.json',
  'data/exploreStats.json',
  'data/spaceShowcaseGallery.json',
  'data/factOfDay.json',
  'data/glossaryMini.json',
  'data/timelineMini.json',
  'data/didYouKnowMini.json',
  'data/eras.json',
  'data/changelog.json',
  'data/news.json',
  'data/observatoryGallery.json',
  'data/universeMap.json',
  'data/glossary.json',
  'data/timeline.json',
  'data/facts.json',
  // Encyclopedia files
  'data/encyclopedia/beginnings.json',
  'data/encyclopedia/stars.json',
  'data/encyclopedia/galaxies.json',
  'data/encyclopedia/black-holes.json',
  'data/encyclopedia/planets.json',
  'data/encyclopedia/beginnings-extended.json',
  'data/encyclopedia/stars-extended.json',
  'data/encyclopedia/galaxies-extended.json',
  'data/encyclopedia/black-holes-extended.json',
  'data/encyclopedia/planets-extended.json',
  'data/encyclopedia/telescopes-extended.json',
]

// Required fields for different file types
const REQUIRED_FIELDS: Record<string, string[]> = {
  'spaceSitemap.json': ['version', 'routes'],
  'spaceKnowledgeHub.json': ['id', 'title'],
  'courseV2.json': ['id', 'title'],
  'quizzes.json': ['id', 'title'],
  'handbook.json': ['id', 'title'],
  'atlas.json': ['id', 'title'],
  'gallery.json': ['id', 'title'],
  'spaceLibrary.json': ['id', 'title'],
  'myths.json': ['id', 'title'],
  'mythQuiz.json': ['id', 'title'],
  'blackHoleLab.copy.json': ['id', 'title'],
  'observatory2.json': ['id', 'title'],
  'spaceWhatsNew.json': ['id', 'title'],
  'spaceLabContent.json': ['id', 'title'],
  'exploreStats.json': ['facts', 'missions'],
  'spaceShowcaseGallery.json': ['id', 'title'],
  'factOfDay.json': ['id', 'title'],
  'glossaryMini.json': ['id', 'title'],
  'timelineMini.json': ['id', 'title'],
  'didYouKnowMini.json': ['id', 'title'],
  'eras.json': ['id', 'title'],
  'changelog.json': ['id', 'title'],
  'news.json': ['id', 'title'],
  'observatoryGallery.json': ['id', 'title'],
  'universeMap.json': ['id', 'title'],
  'glossary.json': ['id', 'title'],
  'timeline.json': ['id', 'title'],
  'facts.json': ['id', 'title'],
}

function checkFileExists(filePath: string): boolean {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    return fs.existsSync(fullPath)
  } catch {
    return false
  }
}

function parseJSONFile(filePath: string): { success: boolean; data?: any; error?: string } {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    if (!fs.existsSync(fullPath)) {
      return { success: false, error: 'File does not exist' }
    }
    const content = fs.readFileSync(fullPath, 'utf-8')
    const data = JSON.parse(content)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    }
  }
}

function checkRequiredFields(data: any, fileName: string): { valid: boolean; missing: string[] } {
  const required = REQUIRED_FIELDS[fileName] || ['id', 'title']
  const missing: string[] = []

  // For array data, check first item
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return { valid: false, missing: ['Array is empty'] }
    }
    const firstItem = data[0]
    for (const field of required) {
      if (!(field in firstItem)) {
        missing.push(field)
      }
    }
  } else if (typeof data === 'object' && data !== null) {
    // For object data, check top-level or nested routes/items
    if (data.routes && Array.isArray(data.routes)) {
      // Handle sitemap structure
      if (data.routes.length > 0) {
        const firstRoute = data.routes[0]
        for (const field of ['id', 'slug', 'title', 'path']) {
          if (!(field in firstRoute)) {
            missing.push(`routes[].${field}`)
          }
        }
      }
    } else {
      // Check top-level fields
      for (const field of required) {
        if (!(field in data)) {
          missing.push(field)
        }
      }
    }
  }

  return { valid: missing.length === 0, missing }
}

export async function runHealthCheck(): Promise<HealthCheckResult> {
  const dataFiles: DataFileStatus[] = []
  const errors: string[] = []

  // Check each data file
  for (const filePath of SPACE_DATA_FILES) {
    const fileName = path.basename(filePath)
    const status: DataFileStatus = {
      path: filePath,
      status: 'ok',
      message: 'OK',
    }

    // Check file existence
    if (!checkFileExists(filePath)) {
      status.status = 'failed'
      status.message = 'File not found'
      status.errors = ['File does not exist']
      dataFiles.push(status)
      continue
    }

    // Parse JSON
    const parseResult = parseJSONFile(filePath)
    if (!parseResult.success) {
      status.status = 'failed'
      status.message = `JSON parse error: ${parseResult.error}`
      status.errors = [parseResult.error || 'Unknown parse error']
      dataFiles.push(status)
      continue
    }

    // Check required fields
    const fieldCheck = checkRequiredFields(parseResult.data, fileName)
    if (!fieldCheck.valid) {
      status.status = 'failed'
      status.message = `Missing required fields: ${fieldCheck.missing.join(', ')}`
      status.errors = fieldCheck.missing.map((f) => `Missing field: ${f}`)
      status.hasRequiredFields = false
    } else {
      status.hasRequiredFields = true
    }

    dataFiles.push(status)
  }

  // Load routes
  let sitemapRoutes: any[] = []
  let sections: any[] = []

  try {
    const sitemapResult = parseJSONFile('data/spaceSitemap.json')
    if (sitemapResult.success && sitemapResult.data?.routes) {
      sitemapRoutes = sitemapResult.data.routes
    }
  } catch (error) {
    errors.push(`Failed to load sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  try {
    const { spaceSections } = await import('@/data/spaceSections')
    sections = spaceSections
  } catch (error) {
    errors.push(`Failed to load sections: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // Determine overall status
  const failedCount = dataFiles.filter((f) => f.status === 'failed').length
  let overallStatus: 'ok' | 'warning' | 'error' = 'ok'
  if (failedCount > 0) {
    overallStatus = failedCount > dataFiles.length / 2 ? 'error' : 'warning'
  }

  const result: HealthCheckResult = {
    timestamp: new Date().toISOString(),
    overallStatus,
    dataFiles,
    routes: {
      sitemap: sitemapRoutes,
      sections,
    },
    errors,
  }

  // Save health report
  try {
    const reportDir = path.join(process.cwd(), 'data', 'space')
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }
    const reportPath = path.join(reportDir, 'healthReport.json')
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2), 'utf-8')
  } catch (error) {
    errors.push(`Failed to save health report: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return result
}
