import {type ModuleFederationRuntimePlugin} from '@module-federation/runtime'
import {ForceRemoteOptions, type RemoteInfoForForce} from '../types'

const ENTRY_KEYS = ['entry', 'url', 'manifest'] as const

function getEntryKey(remote: RemoteInfoForForce): (typeof ENTRY_KEYS)[number] | undefined {
  return ENTRY_KEYS.find((k) => typeof remote[k] === 'string')
}

function getVersionMap(forceRemotes: ForceRemoteOptions): Record<string, string> {
  return Object.fromEntries(
    Object.entries(forceRemotes).flatMap(([k, v]) =>
      typeof v === 'string' ? [[k, v]] : typeof (v as {version?: string})?.version === 'string' ? [[k, (v as {version: string}).version]] : [],
    ),
  )
}

function changeCommonVersion(url: string, versions: Record<string, string>): string {
  if (!Object.keys(versions).length) return url
  let result = url
  for (const [key, version] of Object.entries(versions)) {
    if (!version) continue
    const regex = new RegExp(`(${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}@)([^/]+)`)
    result = result.replace(regex, `$1${version}`)
  }
  return result
}

export default function (forceRemotes: ForceRemoteOptions): ModuleFederationRuntimePlugin {
  const versionMap = getVersionMap(forceRemotes)

  return {
    name: 'emp-remotes-replacer',
    beforeRegisterRemote(args) {
      const remote = args.remote as unknown as RemoteInfoForForce
      if (!remote) return args

      const matchKey = remote.alias ?? remote.name
      const item = matchKey ? forceRemotes[matchKey] : undefined
      const entryOverride =
        item && typeof item === 'object' && 'entry' in item && typeof item.entry === 'string' ? item.entry : undefined
      const key = getEntryKey(remote)
      const current = key ? remote[key] : undefined
      const next = entryOverride ?? (current ? changeCommonVersion(current, versionMap) : undefined)
      if (key && next && (entryOverride !== undefined || next !== current)) remote[key] = next

      return args
    },
  }
}
