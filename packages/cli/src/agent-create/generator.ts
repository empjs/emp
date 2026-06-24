import fs from 'node:fs/promises'
import path from 'node:path'
import type {CreateProjectPlan, GeneratedFile} from './types'

async function directoryHasFiles(dir: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dir)
    return entries.length > 0
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false
    }
    throw error
  }
}

function resolveGeneratedPath(rootDir: string, filePath: string): string {
  if (path.isAbsolute(filePath) || path.win32.isAbsolute(filePath)) {
    throw new Error(`文件路径必须是相对路径: ${filePath}`)
  }

  const segments = filePath.split(/[\\/]+/)
  if (segments.includes('..')) {
    throw new Error(`文件路径不能逃逸目标目录: ${filePath}`)
  }

  const absolutePath = path.resolve(rootDir, filePath)
  const relativePath = path.relative(rootDir, absolutePath)
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`文件路径不能逃逸目标目录: ${filePath}`)
  }

  return absolutePath
}

export async function generateProject(
  plan: CreateProjectPlan,
  options: {dryRun: boolean},
): Promise<GeneratedFile[]> {
  const resolvedFiles = plan.files.map(file => ({
    file,
    absolutePath: resolveGeneratedPath(plan.rootDir, file.path),
  }))

  if (options.dryRun) {
    return plan.files
  }

  if (await directoryHasFiles(plan.rootDir)) {
    throw new Error('目标目录已存在且非空，EMP 不会覆盖已有项目')
  }

  for (const {file, absolutePath} of resolvedFiles) {
    await fs.mkdir(path.dirname(absolutePath), {recursive: true})
    await fs.writeFile(absolutePath, file.content, 'utf8')
  }

  return plan.files
}
