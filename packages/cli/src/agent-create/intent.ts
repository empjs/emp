import type {CreateIntent} from './types'

function hasRole(input: string, framework: 'react' | 'vue', role: 'host' | 'remote'): boolean {
  const chineseRole = role === 'host' ? '主应用' : '子应用'
  const expression = new RegExp(`${framework}\\s*(?:${role}|${chineseRole})`, 'i')
  return expression.test(input)
}

export function parseCreateIntent(input: string): CreateIntent {
  const raw = input.trim()

  if (!raw) {
    throw new Error('create 命令需要项目意图，例如：React 主应用 + Vue 子应用')
  }

  if (!hasRole(raw, 'react', 'host') || !hasRole(raw, 'vue', 'remote')) {
    throw new Error('P0 仅支持 React 主应用 + Vue 子应用')
  }

  return {
    raw,
    host: {framework: 'react', name: 'host'},
    remotes: [{framework: 'vue', name: 'user'}],
  }
}
