import {execFileSync} from 'node:child_process'
import {readFileSync, writeFileSync} from 'node:fs'

const files = execFileSync('git', ['ls-files'], {encoding: 'utf8'})
  .trim()
  .split('\n')
  .filter(file => /(^|\/)tsconfig[^/]*\.json$/.test(file))
  .filter(file => file.startsWith('packages/') || file.startsWith('apps/'))
  .filter(file => !['packages/tsconfig.base.json'].includes(file))

const isPackageTsconfig = file => file.startsWith('packages/') && file.endsWith('/tsconfig.json')
const isAppTsconfig = file => file.startsWith('apps/') && file.endsWith('/tsconfig.json')
const isVueApp = (file, config) => {
  if (file.includes('/vue') || file.includes('adapter-vue')) return true
  const text = JSON.stringify(config)
  return text.includes('@empjs/cli/types/vue') || text.includes('@vue/')
}
const usesNodeNext = file => file.includes('/plugin-tailwindcss')
const normalizePaths = paths => {
  const next = {}
  for (const [key, value] of Object.entries(paths ?? {})) {
    next[key] = value.map(item => item.startsWith('./') || item.startsWith('../') ? item : `./${item}`)
  }
  return next
}
const stripJsonComments = text =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
const parseJsonc = (file, text) => {
  try {
    return JSON.parse(stripJsonComments(text))
  } catch (error) {
    throw new Error(`${file}: ${error.message}`)
  }
}

for (const file of files) {
  const config = parseJsonc(file, readFileSync(file, 'utf8'))
  const compilerOptions = {...(config.compilerOptions ?? {})}
  delete compilerOptions.baseUrl

  if (['node', 'node10'].includes(String(compilerOptions.moduleResolution).toLowerCase())) {
    compilerOptions.moduleResolution = 'Bundler'
  }

  if (isPackageTsconfig(file)) {
    config.extends = usesNodeNext(file) ? '../tsconfig.rslib-nodenext.json' : '../tsconfig.rslib-bundler.json'
    compilerOptions.rootDir = compilerOptions.rootDir ?? 'src'
    compilerOptions.paths = {
      'src/*': ['./src/*'],
      ...normalizePaths(compilerOptions.paths),
    }
  }

  if (isAppTsconfig(file)) {
    config.extends = isVueApp(file, config) ? '@empjs/cli/tsconfig/vue' : '@empjs/cli/tsconfig/react'
    if (compilerOptions.paths) {
      compilerOptions.paths = {
        'src/*': ['./src/*'],
        '*': ['./@mf-types/*'],
        ...normalizePaths(compilerOptions.paths),
      }
    }
  }

  config.compilerOptions = compilerOptions
  writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`)
}
