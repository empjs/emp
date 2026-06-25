import fs from 'node:fs/promises'
import path from 'node:path'
import {generateProject} from 'src/agent-create/generator'
import {parseCreateIntent} from 'src/agent-create/intent'
import {assignAvailableCreatePorts, createProjectPlan} from 'src/agent-create/planner'
import {buildCreateReport, writeCreateReport} from 'src/agent-create/report'
import {runCreateCommands} from 'src/agent-create/executor'
import type {
  CreateOptions,
  CreateProjectPlan,
  EmpCreateReport,
  GeneratedFile,
  VerificationCheck,
} from 'src/agent-create/types'
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

function resolveCreateOptions(options: CreateCommandOptions): CreateOptions {
  return {
    targetDir: path.resolve(options.dir ?? 'emp-app'),
    dryRun: Boolean(options.dryRun),
    install: !options.skipInstall,
    dev: !options.skipDev,
    verify: !options.skipVerify,
    json: Boolean(options.json),
  }
}

function buildFallbackCreatePlan(
  intentText: string,
  options: CreateOptions,
): CreateProjectPlan {
  const rootDir = path.resolve(options.targetDir)

  return {
    rootName: path.basename(rootDir),
    rootDir,
    intent: {
      raw: intentText.trim(),
      host: {framework: 'react', name: 'host'},
      remotes: [{framework: 'vue', name: 'user'}],
    },
    options: {...options, targetDir: rootDir},
    packageManager: 'pnpm',
    apps: [
      {
        name: 'host',
        role: 'host',
        framework: 'react',
        port: 3000,
      },
      {
        name: 'user',
        role: 'remote',
        framework: 'vue',
        port: 3001,
      },
    ],
    files: [],
  }
}

function appendReportWriteFailure(
  report: EmpCreateReport,
  reportPath: string,
  error: unknown,
): EmpCreateReport {
  return {
    ...report,
    checks: [
      ...report.checks,
      {
        name: 'report',
        status: 'failed',
        message: `写入失败报告失败: ${reportPath} - ${formatCreateError(error)}`,
      },
    ],
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
  if (await pathExists(reportPath)) {
    return
  }

  await fs.mkdir(path.dirname(reportPath), {recursive: true})

  try {
    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      return
    }

    throw error
  }
}

async function normalizeDynamicPortChecks(
  plan: CreateProjectPlan,
  checks: VerificationCheck[],
): Promise<VerificationCheck[]> {
  const remote = plan.apps.find(app => app.role === 'remote')
  if (!remote || remote.port === 3001) {
    return checks
  }

  const hostConfig = await fs
    .readFile(path.join(plan.rootDir, 'apps/host/emp.config.ts'), 'utf8')
    .catch(() => '')
  const dynamicRemoteUrl = `${remote.name}@http://localhost:${remote.port}/emp.js`

  if (!hostConfig.includes(dynamicRemoteUrl)) {
    return checks
  }

  return checks.map(check =>
    check.name === 'host-config' && check.status === 'failed'
      ? {...check, status: 'passed', message: 'host 已配置 user remote'}
      : check,
  )
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
  const createOptions = resolveCreateOptions(options)
  let plan = buildFallbackCreatePlan(intentText, createOptions)
  const reportPath = path.join(plan.rootDir, 'emp-report.json')
  let files: GeneratedFile[] = []
  let report: EmpCreateReport

  try {
    const intent = parseCreateIntent(intentText)
    plan = await assignAvailableCreatePorts(createProjectPlan(intent, createOptions))
    files = await generateProject(plan, {dryRun: plan.options.dryRun})
    const commandResults = plan.options.dryRun
      ? []
      : await runCreateCommands(plan, {
          install: plan.options.install,
          verify: plan.options.verify,
          dev: plan.options.dev,
        })
    const checks =
      plan.options.verify && !plan.options.dryRun
        ? await normalizeDynamicPortChecks(plan, await verifyGeneratedProject(plan))
        : []
    report = buildCreateReport(plan, checks, commandResults)

    if (!plan.options.dryRun) {
      await writeCreateReport(report)
    }
  } catch (error) {
    report = buildFailedCreateReport(plan, error)

    if (!plan.options.dryRun) {
      try {
        await writeFailedCreateReportIfAbsent(report, reportPath)
      } catch (writeError) {
        report = appendReportWriteFailure(report, reportPath, writeError)
      }
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
