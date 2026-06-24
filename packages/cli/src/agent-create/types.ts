export type Framework = 'react' | 'vue'
export type AppRole = 'host' | 'remote'
export type CheckStatus = 'passed' | 'failed' | 'skipped'

export interface CreateIntent {
  raw: string
  host: {framework: 'react'; name: 'host'}
  remotes: Array<{framework: 'vue'; name: 'user'}>
}
