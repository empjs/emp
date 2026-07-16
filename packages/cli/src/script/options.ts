import type {Command} from 'commander'
import type {CliOptionsType, EnvVarsType} from 'src/types/env'

export function collectEnvVar(value: string, memo: EnvVarsType = {}) {
  const separatorIndex = value.indexOf('=')
  if (separatorIndex <= 0) {
    throw new Error(`--env-vars 参数必须使用 key=value 格式，当前值为 "${value}"`)
  }
  const key = value.slice(0, separatorIndex).trim()
  const envValue = value.slice(separatorIndex + 1)
  if (!key) {
    throw new Error(`--env-vars 的 key 不能为空，当前值为 "${value}"`)
  }
  memo[key] = envValue
  return memo
}

export function parseBooleanOption(value: unknown, defaultValue = true) {
  if (typeof value === 'undefined') return defaultValue
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return Boolean(value)
  const normalized = value.trim().toLowerCase()
  if (['false', '0', 'no', 'off'].includes(normalized)) return false
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true
  throw new Error(`布尔参数值无效，当前值为 "${value}"`)
}

export function normalizeCliOptions(options: CliOptionsType = {}): CliOptionsType {
  return {
    ...options,
    clearLog: parseBooleanOption(options.clearLog, true),
  }
}

export function registerEnvOption(command: Command) {
  return command.option(
    '-ev, --env-vars <key=value>',
    '定义一个环境变量，可重复传入，例如 -ev API_URL=https://example.com',
    collectEnvVar,
    {},
  )
}

export function registerCommonOptions(command: Command) {
  return registerEnvOption(
    command
      .option('-e, --env <env>', '部署环境 dev、test、prod')
      .option('-rd, --doctor', '开启 rsdoctor，可通过 debug.rsdoctor 操作')
      .option('-t, --ts', '生成类型文件，默认 false')
      .option('-pr, --profile', '统计模块消耗')
      .option('-cl, --clearLog <clearLog>', '清空日志，默认 true'),
  )
}

export function registerUnsupportedCommand(program: Command, name: string, description: string) {
  program
    .command(name, {hidden: true})
    .description(description)
    .action(() => {
      console.error(`emp ${name} 在 @empjs/cli v4 中尚未实现。`)
      process.exitCode = 1
    })
}
