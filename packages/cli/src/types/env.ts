export type EMPModeType = 'development' | 'production'
export type CliActionType = 'dev' | 'build' | 'serve' | 'static'
export type EnvVarsType = Record<string, string>

export type CliOptionsType = {
  env?: string
  doctor?: boolean
  hot?: boolean
  open?: boolean
  ts?: boolean
  profile?: boolean
  clearLog?: boolean | string
  envVars?: EnvVarsType
  analyze?: boolean
  watch?: boolean
  serve?: boolean
  root?: string
  host?: string
  port?: string | number
  cors?: boolean
  spa?: boolean | string
  https?: boolean
  cert?: string
  key?: string
  headers?: string[]
  compression?: string | boolean
  json?: boolean
}
