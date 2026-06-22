import {createRequire} from 'node:module'
import {resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

function getCurrentModuleFile(): string | undefined {
  const prepareStackTrace = Error.prepareStackTrace
  try {
    Error.prepareStackTrace = (_error, stack) => stack
    const stack = new Error().stack as unknown
    if (!Array.isArray(stack)) return

    const file = stack
      .map(callSite => callSite.getFileName?.())
      .find(fileName => fileName && !fileName.startsWith('node:') && !fileName.startsWith('['))

    if (!file) return
    return file.startsWith('file:') ? fileURLToPath(file) : file
  } finally {
    Error.prepareStackTrace = prepareStackTrace
  }
}

function resolveFrom(baseFile: string, specifier: string): string {
  return createRequire(baseFile).resolve(specifier)
}

export function resolvePackageExport(specifier: string): string {
  try {
    return resolveFrom(resolve(process.cwd(), 'package.json'), specifier)
  } catch (error) {
    const currentModuleFile = getCurrentModuleFile()
    if (currentModuleFile) return resolveFrom(currentModuleFile, specifier)
    throw error
  }
}
