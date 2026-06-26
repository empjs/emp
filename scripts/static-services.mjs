import {spawn} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {fileURLToPath} from 'node:url'
import {staticServices as serviceDefinitions} from './static-services.config.mjs'

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const staticServices = serviceDefinitions.map(service => ({...service}))

function normalizeList(value) {
  if (!value) return []
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function parseArgs(args) {
  const parsed = {_: []}
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (!arg.startsWith('--')) {
      parsed._.push(arg)
      continue
    }
    const key = arg.slice(2)
    const next = args[index + 1]
    if (!next || next.startsWith('--')) {
      parsed[key] = true
      continue
    }
    parsed[key] = next
    index += 1
  }
  return parsed
}

export function listStaticServices({group, services} = {}) {
  const serviceFilter = Array.isArray(services) ? services : normalizeList(services)
  return staticServices.filter(service => {
    if (serviceFilter.length > 0 && !serviceFilter.includes(service.id)) return false
    if (group && !service.groups.includes(group)) return false
    return true
  })
}

export function selectStaticServices({group, services} = {}) {
  const selected = listStaticServices({group, services})
  if (selected.length === 0) {
    throw new Error(`No static services matched selection: ${JSON.stringify({group, services})}`)
  }
  return selected
}

export function validateStaticServices(services) {
  const issues = []
  const ids = new Set()
  const ports = new Map()
  for (const service of services) {
    if (ids.has(service.id)) {
      issues.push({type: 'duplicate-id', id: service.id, message: `duplicate static service id: ${service.id}`})
    }
    ids.add(service.id)
    if (!ports.has(service.port)) ports.set(service.port, [])
    ports.get(service.port).push(service.id)
  }
  for (const [port, serviceIds] of ports) {
    if (serviceIds.length > 1) {
      issues.push({
        type: 'port-conflict',
        port,
        services: serviceIds,
        message: `port ${port} is used by ${serviceIds.join(', ')} in the same selection`,
      })
    }
  }
  return issues
}

export function buildStaticCommand(service, overrides = {}) {
  const host = overrides.host ?? '0.0.0.0'
  const port = Number(overrides.port ?? service.port)
  const root = overrides.root ?? service.root
  const args = ['packages/cli/bin/emp.js', 'static', root, '--host', host, '--port', String(port)]
  if (service.cors) args.push('--cors')
  if (overrides.https) args.push('--https')
  const url = `${overrides.https ? 'https' : 'http'}://localhost:${port}/`
  return {
    cmd: process.execPath,
    args,
    display: `node ${args.join(' ')}`,
    url,
  }
}

export function buildEnvLines(services, {mode = 'development', https = false} = {}) {
  return services.map(service => {
    const protocol = https ? 'https' : 'http'
    const asset = service.assets[mode] ?? service.assets.development
    const key = `EMP_STATIC_${service.id.toUpperCase().replaceAll('-', '_')}`
    return `${key}=${protocol}://localhost:${service.port}/${asset}`
  })
}

export async function startStaticServices(services, options = {}) {
  const commands = services.map(service => buildStaticCommand(service, options))
  const children = []
  for (const command of commands) {
    const child = spawn(command.cmd, command.args, {
      cwd: repoRoot,
      stdio: 'inherit',
      env: process.env,
    })
    children.push({command, child})
  }
  return children
}

export async function waitForStaticServiceChildren(children) {
  let exitCode = 0
  await Promise.all(
    children.map(
      ({child}) =>
        new Promise(resolve => {
          child.once('exit', (code, signal) => {
            if (typeof code === 'number' && code !== 0) {
              exitCode = exitCode || code
            } else if (signal) {
              exitCode = exitCode || 1
            }
            resolve()
          })
        }),
    ),
  )
  return exitCode
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2))
}

async function main() {
  const [command = 'list', ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)
  const services = args.service ? normalizeList(args.service) : normalizeList(args.services)
  const group = args.group === true ? undefined : args.group
  const selected = command === 'list' ? listStaticServices({group, services}) : selectStaticServices({group, services})

  if (command === 'list') {
    const rows = selected.map(({id, packageName, root, port, groups}) => ({id, packageName, root, port, groups}))
    args.json ? printJson(rows) : console.table(rows)
    return
  }

  if (command === 'doctor') {
    const issues = validateStaticServices(selected)
    for (const service of selected) {
      const absoluteRoot = path.resolve(repoRoot, service.root)
      if (!fs.existsSync(absoluteRoot)) {
        issues.push({type: 'missing-root', id: service.id, root: service.root, message: `${service.root} does not exist`})
      }
    }
    if (issues.length > 0) {
      printJson({ok: false, issues})
      process.exitCode = 1
      return
    }
    printJson({ok: true, services: selected.map(service => service.id)})
    return
  }

  if (command === 'env') {
    console.log(buildEnvLines(selected, {mode: args.mode || 'development', https: !!args.https}).join('\n'))
    return
  }

  if (command === 'start') {
    const issues = validateStaticServices(selected)
    if (issues.length > 0) {
      printJson({ok: false, issues})
      process.exitCode = 1
      return
    }
    const commands = selected.map(service => buildStaticCommand(service, {host: args.host, https: !!args.https}))
    if (args['dry-run']) {
      printJson({ok: true, commands})
      return
    }
    const children = await startStaticServices(selected, {host: args.host, https: !!args.https})
    const shutdown = () => {
      for (const {child} of children) {
        if (!child.killed) child.kill('SIGINT')
      }
    }
    process.once('SIGINT', shutdown)
    process.once('SIGTERM', shutdown)
    process.exitCode = await waitForStaticServiceChildren(children)
    return
  }

  console.error(`Unknown static-services command: ${command}`)
  process.exitCode = 1
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
