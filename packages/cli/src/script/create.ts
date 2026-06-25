import fs from 'node:fs/promises'
import path from 'node:path'
import {generateProject} from 'src/agent-create/generator'
import {parseCreateIntent} from 'src/agent-create/intent'
import {createProjectPlan} from 'src/agent-create/planner'
import {buildCreateReport, writeCreateReport} from 'src/agent-create/report'
import type {CreateProjectPlan, EmpCreateReport, GeneratedFile} from 'src/agent-create/types'
import {verifyGeneratedProject} from 'src/agent-create/verify'

export interface CreateCommandOptions {
  dir?: string
  dryRun?: boolean
  skipInstall?: boolean
  skipDev?: boolean
  skipVerify?: boolean
  json?: boolean
}

export function applyCreateReportExitStatus(
  report: EmpCreateReport,
  reportPath: string,
  json: boolean,
): void {
  if (report.status !== 'failed') {
    return
  }

  process.exitCode = 1

  if (json) {
    return
  }

  console.log('EMP 新项目创建失败')
  console.log(`目录: ${report.rootDir}`)
  console.log(`报告: ${reportPath}`)

  for (const check of report.checks.filter(item => item.status === 'failed')) {
    console.log(`失败检查: ${check.name} - ${check.message}`)
  }

  for (const command of report.commands.filter(item => item.status === 'failed')) {
    console.log(`失败命令: ${command.name} - ${command.command}`)
  }
}

function formatCreateError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function buildFailedCreateReport(plan: CreateProjectPlan, error: unknown): EmpCreateReport {
  return {
    status: 'failed',
    rootDir: plan.rootDir,
    apps: plan.apps.map(app => ({
      name: app.name,
      role: app.role,
      framework: app.framework,
      url: `http://localhost:${app.port}`,
    })),
    checks: [
      {
        name: 'create',
        status: 'failed',
        message: formatCreateError(error),
      },
    ],
    commands: [],
  }
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false
    }

    throw error
  }
}

async function writeFailedCreateReportIfAbsent(
  report: EmpCreateReport,
  reportPath: string,
): Promise<void> {
  try {
    if (await pathExists(reportPath)) {
      return
    }

    await fs.mkdir(path.dirname(reportPath), {recursive: true})
    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      return
    }
  }
}

function printCreateResult(
  plan: CreateProjectPlan,
  files: GeneratedFile[],
  report: EmpCreateReport,
  reportPath: string,
): void {
  console.log(
    JSON.stringify(
      {
        plan,
        files: files.map(file => file.path),
        report,
        reportPath,
      },
      null,
      2,
    ),
  )
}

export async function runCreateCommand(
  intentText: string,
  options: CreateCommandOptions = {},
): Promise<void> {
  const intent = parseCreateIntent(intentText)
  const targetDir = path.resolve(options.dir ?? 'emp-app')
  const plan = createProjectPlan(intent, {
    targetDir,
    dryRun: Boolean(options.dryRun),
    install: !options.skipInstall,
    dev: !options.skipDev,
    verify: !options.skipVerify,
    json: Boolean(options.json),
  })

  const reportPath = path.join(plan.rootDir, 'emp-report.json')
  let files: GeneratedFile[] = []
  let report: EmpCreateReport

  try {
    files = await generateProject(plan, {dryRun: plan.options.dryRun})
    const checks =
      plan.options.verify && !plan.options.dryRun ? await verifyGeneratedProject(plan) : []
    report = buildCreateReport(plan, checks, [])

    if (!plan.options.dryRun) {
      await writeCreateReport(report)
    }
  } catch (error) {
    report = buildFailedCreateReport(plan, error)

    if (!plan.options.dryRun) {
      await writeFailedCreateReportIfAbsent(report, reportPath)
    }
  }

  if (plan.options.json) {
    printCreateResult(plan, files, report, reportPath)
    applyCreateReportExitStatus(report, reportPath, true)
    return
  }

  applyCreateReportExitStatus(report, reportPath, false)
  if (report.status === 'failed') {
    return
  }

  console.log(plan.options.dryRun ? 'EMP create dry-run 完成' : 'EMP 新项目创建完成')
  console.log(`目录: ${plan.rootDir}`)
  console.log(`文件数: ${files.length}`)
  if (!plan.options.dryRun) {
    console.log(`报告: ${reportPath}`)
  }
}
