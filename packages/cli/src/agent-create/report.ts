import fs from 'node:fs/promises'
import path from 'node:path'
import type {CommandResult, CreateProjectPlan, EmpCreateReport, VerificationCheck} from './types'

function overallStatus(checks: VerificationCheck[], commands: CommandResult[]): 'passed' | 'failed' {
  const checksPassed = checks.every(check => check.status === 'passed' || check.status === 'skipped')
  const commandsPassed = commands.every(command => command.status === 'passed' || command.status === 'skipped')
  return checksPassed && commandsPassed ? 'passed' : 'failed'
}

export function buildCreateReport(
  plan: CreateProjectPlan,
  checks: VerificationCheck[],
  commands: CommandResult[],
): EmpCreateReport {
  return {
    status: overallStatus(checks, commands),
    rootDir: plan.rootDir,
    apps: plan.apps.map(app => ({
      name: app.name,
      role: app.role,
      framework: app.framework,
      url: `http://localhost:${app.port}`,
    })),
    checks,
    commands,
  }
}

export async function writeCreateReport(report: EmpCreateReport): Promise<void> {
  const reportPath = path.join(report.rootDir, 'emp-report.json')
  const tempPath = path.join(
    report.rootDir,
    `emp-report.json.${process.pid}.${Date.now()}.tmp`,
  )

  await fs.mkdir(report.rootDir, {recursive: true})

  try {
    await fs.writeFile(tempPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    await fs.rename(tempPath, reportPath)
  } catch (error) {
    await fs.rm(tempPath, {force: true}).catch(() => {})
    throw error
  }
}
