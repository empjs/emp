import {fileURLToPath} from 'node:url'

export function resolvePackageExport(specifier: string): string {
  const resolved = import.meta.resolve(specifier)
  return resolved.startsWith('file:') ? fileURLToPath(resolved) : resolved
}
