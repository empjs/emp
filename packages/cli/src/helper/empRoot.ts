import fs from 'node:fs'
import path from 'node:path'

const cliPackageName = '@empjs/cli'

function findCliPackageRoot(startDir: string): string {
  let currentDir = path.resolve(startDir)

  while (true) {
    const packageJsonPath = path.join(currentDir, 'package.json')

    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        if (pkg.name === cliPackageName) return currentDir
      } catch {}
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) break
    currentDir = parentDir
  }

  return path.resolve(__dirname, __filename).replace(`${path.sep}dist${path.sep}index.js`, '')
}

export const empRoot = findCliPackageRoot(__dirname)
