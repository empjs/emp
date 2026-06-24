import type {CreateIntent} from './types'

const ASCII_TOKEN = '[A-Za-z0-9_-]'

function rolePattern(role: 'host' | 'remote'): string {
  return role === 'host'
    ? `(?:host(?!${ASCII_TOKEN})|主应用)`
    : `(?:remote(?!${ASCII_TOKEN})|子应用)`
}

function countRole(input: string, role: 'host' | 'remote'): number {
  const expression = new RegExp(`(?<!${ASCII_TOKEN})${rolePattern(role)}`, 'gi')
  return Array.from(input.matchAll(expression)).length
}

function countFrameworkRole(
  input: string,
  framework: 'react' | 'vue',
  role: 'host' | 'remote',
): number {
  const expression = new RegExp(`(?<!${ASCII_TOKEN})${framework}\\s*${rolePattern(role)}`, 'gi')
  return Array.from(input.matchAll(expression)).length
}

export function parseCreateIntent(input: string): CreateIntent {
  const raw = input.trim()

  if (!raw) {
    throw new Error('create 命令需要项目意图，例如：React 主应用 + Vue 子应用')
  }

  const reactHostCount = countFrameworkRole(raw, 'react', 'host')
  const vueRemoteCount = countFrameworkRole(raw, 'vue', 'remote')

  if (reactHostCount === 0 || vueRemoteCount === 0) {
    throw new Error('P0 仅支持 React 主应用 + Vue 子应用')
  }

  if (
    reactHostCount !== 1 ||
    vueRemoteCount !== 1 ||
    countRole(raw, 'host') !== 1 ||
    countRole(raw, 'remote') !== 1
  ) {
    throw new Error('P0 仅支持单 host + 单 remote')
  }

  return {
    raw,
    host: {framework: 'react', name: 'host'},
    remotes: [{framework: 'vue', name: 'user'}],
  }
}
