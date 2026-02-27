#!/usr/bin/env node

/**
 * Build Sanity Check Script
 * يجمع: lint + build + basic checks
 * 
 * Usage: npm run smoke
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting Build Sanity Check...\n')

let hasErrors = false

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, message) {
  console.log(`\n${colors.blue}[${step}]${colors.reset} ${message}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
  hasErrors = true
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

// Step 1: Check Node.js version
logStep('1/5', 'Checking Node.js version...')
try {
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  
  if (majorVersion < 18) {
    logError(`Node.js version ${nodeVersion} is too old. Need 18+`)
  } else {
    logSuccess(`Node.js version: ${nodeVersion}`)
  }
} catch (error) {
  logError(`Failed to check Node.js version: ${error.message}`)
}

// Step 2: Check if node_modules exists
logStep('2/5', 'Checking dependencies...')
if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
  logWarning('node_modules not found. Run: npm install')
} else {
  logSuccess('Dependencies installed')
}

// Step 3: Lint check
logStep('3/5', 'Running linter...')
try {
  execSync('npm run lint', { stdio: 'inherit' })
  logSuccess('Linting passed')
} catch (error) {
  logError('Linting failed')
}

// Step 4: TypeScript check (if tsconfig.json exists)
logStep('4/5', 'Checking TypeScript...')
if (fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))) {
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' })
    logSuccess('TypeScript check passed')
  } catch (error) {
    logError('TypeScript check failed')
  }
} else {
  logWarning('tsconfig.json not found, skipping TypeScript check')
}

// Step 5: Build check
logStep('5/5', 'Running build...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  logSuccess('Build successful')
  
  // Check if .next directory exists
  if (fs.existsSync(path.join(process.cwd(), '.next'))) {
    logSuccess('.next directory created')
  } else {
    logWarning('.next directory not found after build')
  }
} catch (error) {
  logError('Build failed')
}

// Final summary
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  logError('\n❌ Build Sanity Check FAILED')
  log('Please fix the errors above before deploying.\n', 'yellow')
  process.exit(1)
} else {
  logSuccess('\n✅ Build Sanity Check PASSED')
  log('Your project is ready for deployment!\n', 'green')
  process.exit(0)
}
