import { spawn } from 'node:child_process'
import net from 'node:net'
import { createRequire } from 'node:module'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)
const DEFAULT_PORT = 11000
const MAX_PORT_TRIES = 50

function parseArgs(argv) {
  const args = [...argv]
  let port = DEFAULT_PORT
  const passthrough = []

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if ((a === '-p' || a === '--port') && typeof args[i + 1] === 'string') {
      const n = Number(args[i + 1])
      if (Number.isFinite(n) && n > 0) port = n
      i++
      continue
    }
    passthrough.push(a)
  }

  return { port, passthrough }
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => server.close(() => resolve(true)))
      // Next.js on Windows often binds to IPv6 (::). If we only probe 127.0.0.1,
      // we can get false positives where IPv4 is free but IPv6 is not.
      .listen(port, '::')
  })
}

async function findAvailablePort(startPort) {
  for (let i = 0; i < MAX_PORT_TRIES; i++) {
    const candidate = startPort + i
    // eslint-disable-next-line no-await-in-loop
    if (await isPortAvailable(candidate)) return candidate
  }
  throw new Error(`No available port found starting from ${startPort} (tried ${MAX_PORT_TRIES} ports).`)
}

async function waitForServer(port, maxWait = 30000) {
  const startTime = Date.now()
  while (Date.now() - startTime < maxWait) {
    // Check if port is in use (server is listening)
    const available = await isPortAvailable(port)
    if (!available) {
      // Port is in use, server is ready
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  return false
}

async function openBrowser(url) {
  try {
    const platform = process.platform
    let command
    
    if (platform === 'win32') {
      command = `start "" "${url}"`
    } else if (platform === 'darwin') {
      command = `open "${url}"`
    } else {
      command = `xdg-open "${url}"`
    }
    
    await execAsync(command)
    console.log(`✓ Browser opened: ${url}`)
  } catch (error) {
    console.log(`⚠ Could not open browser automatically. Please open: ${url}`)
  }
}

const { port: requestedPort, passthrough } = parseArgs(process.argv.slice(2))
const port = await findAvailablePort(requestedPort)

const require = createRequire(import.meta.url)
const nextBin = require.resolve('next/dist/bin/next')
const nextArgs = [nextBin, 'dev', '-p', String(port), ...passthrough]

console.log(`Starting Space Explorer dev server...`)
console.log(`Open: http://localhost:${port}`)
if (port !== requestedPort) {
  console.log(`Note: requested port ${requestedPort} was busy, using ${port} instead.`)
}

const child = spawn(process.execPath, nextArgs, { stdio: 'inherit' })

// Wait for server to be ready, then open browser
setTimeout(async () => {
  const serverReady = await waitForServer(port, 30000)
  if (serverReady) {
    await openBrowser(`http://localhost:${port}`)
  } else {
    console.log(`⚠ Server may not be ready yet. Please open manually: http://localhost:${port}`)
  }
}, 3000)

child.on('exit', (code) => process.exit(code ?? 0))


