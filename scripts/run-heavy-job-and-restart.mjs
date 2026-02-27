#!/usr/bin/env node
/**
 * Runs a heavy job (build, index generation, etc.) and then restarts the dev server.
 * 
 * Usage:
 *   node scripts/run-heavy-job-and-restart.mjs [job-name]
 * 
 * Available jobs:
 *   - build: Runs `npm run build` (Next.js production build)
 *   - space-index: Runs `npm run build:space-index` (generates space index)
 *   - media-index: Runs `node scripts/build-media-index.js` (generates media index)
 *   - all: Runs all jobs sequentially
 * 
 * Default: runs 'space-index' if no job specified
 */

import { spawn } from 'node:child_process'

const JOBS = {
  build: {
    name: 'Next.js Build',
    command: 'npm',
    args: ['run', 'build'],
  },
  'space-index': {
    name: 'Space Index Generation',
    command: 'npm',
    args: ['run', 'build:space-index'],
  },
  'media-index': {
    name: 'Media Index Generation',
    command: 'node',
    args: ['scripts/build-media-index.js'],
  },
}

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    proc.on('error', (err) => {
      reject(err)
    })
  })
}

async function runJob(jobName) {
  const job = JOBS[jobName]
  if (!job) {
    throw new Error(`Unknown job: ${jobName}. Available: ${Object.keys(JOBS).join(', ')}`)
  }

  console.log(`\n🚀 Starting heavy job: ${job.name}...`)
  console.log(`   Command: ${job.command} ${job.args.join(' ')}\n`)

  const startTime = Date.now()
  try {
    await runCommand(job.command, job.args)
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n✅ Job "${job.name}" completed successfully in ${duration}s\n`)
    return true
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.error(`\n❌ Job "${job.name}" failed after ${duration}s`)
    console.error(error.message)
    return false
  }
}

async function restartDevServer() {
  console.log('\n' + '='.repeat(60))
  console.log('  🔄 Restarting dev server...')
  console.log('='.repeat(60))
  console.log('\n⚠️  Note: If dev server is already running, please stop it first (Ctrl+C)')
  console.log('   This script will start a new dev server instance.\n')
  
  // Wait a moment
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log('🚀 Starting dev server...\n')
  
  // Start dev server
  const devScript = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  })

  devScript.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n⚠️  Dev server exited with code ${code}`)
    }
  })

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping dev server...')
    devScript.kill('SIGINT')
    process.exit(0)
  })

  console.log('✅ Dev server started successfully!')
  console.log('   Press Ctrl+C to stop both the job runner and dev server.\n')
}

async function main() {
  const jobName = process.argv[2] || 'space-index'
  const jobsToRun = jobName === 'all' ? Object.keys(JOBS) : [jobName]

  console.log('='.repeat(60))
  console.log('  Heavy Job Runner & Dev Server Restart')
  console.log('='.repeat(60))

  // Run all specified jobs
  let allSucceeded = true
  for (const job of jobsToRun) {
    const succeeded = await runJob(job)
    if (!succeeded) {
      allSucceeded = false
      console.error(`\n⚠️  Job "${job}" failed. Continuing with remaining jobs...\n`)
    }
  }

  if (!allSucceeded) {
    console.error('\n❌ Some jobs failed. Dev server will not be restarted.')
    process.exit(1)
  }

  // Restart dev server
  await restartDevServer()
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message)
  process.exit(1)
})
