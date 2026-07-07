import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import pkg from '../../package.json'

export interface DoctorCommandOptions {
  json?: boolean
  cwd?: string
}

type DoctorStatus = 'passed' | 'warning' | 'failed'

interface DoctorCheck {
  name: string
  status: DoctorStatus
  message: string
  expected?: string
  actual?: string
  path?: string
}

interface DoctorAuth {
  required: false
  source: 'not-required'
}

interface DoctorPayload {
  ok: boolean
  command: 'doctor'
  version: string
  cwd: string
  auth: DoctorAuth
  checks: DoctorCheck[]
  warnings: DoctorCheck[]
  errors: DoctorCheck[]
  nextActions: string[]
}

function parseNodeVersion(version: string) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(version)
  if (!match) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

function isSupportedNodeVersion(version: string) {
  const parsed = parseNodeVersion(version)
  if (!parsed) return false
  if (parsed.major > 22) return true
  if (parsed.major === 22) return parsed.minor >= 12
  if (parsed.major === 20) return parsed.minor >= 19
  return false
}

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw error
  }
}

async function findPackageJson(startDir: string) {
  let current = path.resolve(startDir)

  while (true) {
    const candidate = path.join(current, 'package.json')
    if (await pathExists(candidate)) return candidate

    const parent = path.dirname(current)
    if (parent === current) return null
    current = parent
  }
}

function buildNodeCheck(): DoctorCheck {
  const actual = process.version
  const expected = pkg.engines.node
  const passed = isSupportedNodeVersion(actual)

  return {
    name: 'node',
    status: passed ? 'passed' : 'failed',
    expected,
    actual,
    message: passed
      ? `Node ${actual} matches ${expected}`
      : `Node ${actual} does not match ${expected}`,
  }
}

function buildPackageManagerCheck(): DoctorCheck {
  const expected = 'pnpm 10.x'
  const actual = process.env.npm_config_user_agent ?? ''
  const pnpmMatch = /pnpm\/(\d+\.\d+\.\d+)/.exec(actual)

  if (!actual) {
    return {
      name: 'package-manager',
      status: 'warning',
      expected,
      message: 'package manager user agent is unavailable; use corepack pnpm for EMP workspace commands',
    }
  }

  return {
    name: 'package-manager',
    status: pnpmMatch?.[1].startsWith('10.') ? 'passed' : 'warning',
    expected,
    actual,
    message: pnpmMatch
      ? `detected pnpm ${pnpmMatch[1]}`
      : 'package manager is not pnpm; use corepack pnpm for EMP workspace commands',
  }
}

async function buildProjectCheck(cwd: string): Promise<DoctorCheck> {
  const packageJsonPath = await findPackageJson(cwd)

  if (!packageJsonPath) {
    return {
      name: 'project',
      status: 'warning',
      message: 'no package.json found from cwd; project commands may need an explicit workspace directory',
    }
  }

  return {
    name: 'project',
    status: 'passed',
    path: packageJsonPath,
    message: 'nearest package.json found',
  }
}

export async function buildDoctorPayload(
  options: DoctorCommandOptions = {},
): Promise<DoctorPayload> {
  const cwd = path.resolve(options.cwd ?? process.cwd())
  const checks = [buildNodeCheck(), buildPackageManagerCheck(), await buildProjectCheck(cwd)]
  const warnings = checks.filter(check => check.status === 'warning')
  const errors = checks.filter(check => check.status === 'failed')

  return {
    ok: errors.length === 0,
    command: 'doctor',
    version: pkg.version,
    cwd,
    auth: {required: false, source: 'not-required'},
    checks,
    warnings,
    errors,
    nextActions: [
      'emp --help',
      'emp create --help',
      'emp create "React 主应用 + Vue 子应用" --dry-run --json',
    ],
  }
}

function printHumanDoctor(payload: DoctorPayload) {
  console.log(`EMP CLI ${payload.version}`)
  console.log(`cwd: ${payload.cwd}`)
  console.log('auth: not required')

  for (const check of payload.checks) {
    console.log(`${check.status}: ${check.name} - ${check.message}`)
  }

  console.log('next:')
  for (const action of payload.nextActions) {
    console.log(`  ${action}`)
  }
}

export async function runDoctorCommand(options: DoctorCommandOptions = {}): Promise<void> {
  const payload = await buildDoctorPayload(options)

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2))
  } else {
    printHumanDoctor(payload)
  }

  if (!payload.ok) {
    process.exitCode = 1
  }
}
