/**
 * 运行时插件：根据 window[EMP_FORCE_REMOTES] 配置，在注册 remote 前拦截并改写其 entry/url。
 * 支持两种方式二选一：指定完整 entry 地址，或仅指定 version 做 URL 内版本号替换。
 */
import {type ModuleFederationRuntimePlugin} from '@module-federation/runtime'
import {shareForceRemote} from 'src/helper/config'
import {type ForceRemoteItem, type ForceRemoteOptions, type RemoteInfoForForce} from '../types'

declare global {
  interface Window {
    [shareForceRemote]?: ForceRemoteOptions
  }
}

/** remote 上可能表示入口地址的字段，按优先级 */
const REMOTE_ENTRY_FIELD_KEYS = ['entry', 'url', 'manifest'] as const

/**
 * 取当前 remote 用于表示入口的字段名（entry / url / manifest 中第一个为字符串的）
 */
function getRemoteEntryFieldKey(remote: RemoteInfoForForce): (typeof REMOTE_ENTRY_FIELD_KEYS)[number] | undefined {
  return REMOTE_ENTRY_FIELD_KEYS.find((k) => typeof remote[k] === 'string')
}

function hasEntryConfig(config: ForceRemoteItem): boolean {
  return typeof config === 'object' && config !== null && 'entry' in config && typeof (config as {entry?: string}).entry === 'string'
}

function getVersionFromConfig(config: ForceRemoteItem): string | undefined {
  if (typeof config === 'string') return config
  const v = (config as {version?: string})?.version
  return typeof v === 'string' ? v : undefined
}

function getEntryFromConfig(config: ForceRemoteItem | undefined): string | undefined {
  return config && hasEntryConfig(config) ? (config as {entry: string}).entry : undefined
}

/**
 * 从 forceRemotes 提取「仅 version」项的映射（有 entry 的项不参与，二选一）。
 */
function buildVersionReplaceMap(forceRemotes: ForceRemoteOptions): Record<string, string> {
  return Object.fromEntries(
    Object.entries(forceRemotes).flatMap(([remoteKey, config]) => {
      if (hasEntryConfig(config)) return []
      const version = getVersionFromConfig(config)
      return version ? [[remoteKey, version]] : []
    }),
  )
}

/**
 * 在 URL 中按 versionMap 替换 common 版本号（匹配 `remoteKey@原版本` -> `remoteKey@新版本`）
 */
function replaceUrlVersions(url: string, versionMap: Record<string, string>): string {
  if (!Object.keys(versionMap).length) return url
  let result = url
  for (const [remoteKey, version] of Object.entries(versionMap)) {
    if (!version) continue
    const regex = new RegExp(`(${remoteKey.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}@)([^/]+)`)
    result = result.replace(regex, `$1${version}`)
  }
  return result
}

export default function (): ModuleFederationRuntimePlugin {
  return {
    name: 'emp-remotes-replacer',
    beforeRegisterRemote(args) {
      const forceRemotes = typeof window !== 'undefined' ? window[shareForceRemote] : undefined
      if (!forceRemotes || typeof forceRemotes !== 'object') return args

      const remote = args.remote as unknown as RemoteInfoForForce
      if (!remote) return args

      const entryFieldKey = getRemoteEntryFieldKey(remote)
      if (!entryFieldKey) return args

      const currentEntryUrl = remote[entryFieldKey] as string | undefined
      const forceConfig = remote.alias ? forceRemotes[remote.alias] : undefined

      // 优先 version：有则替换并直接 return，不再走 entry
      const versionMap = buildVersionReplaceMap(forceRemotes)
      const versionedEntryUrl = currentEntryUrl ? replaceUrlVersions(currentEntryUrl, versionMap) : undefined
      if (versionedEntryUrl && versionedEntryUrl !== currentEntryUrl) {
        remote[entryFieldKey] = versionedEntryUrl
        return args
      }

      // 否则判断 entry：有则改写并 return
      const forcedEntryUrl = getEntryFromConfig(forceConfig)
      if (forcedEntryUrl) {
        remote[entryFieldKey] = forcedEntryUrl
        return args
      }

      return args
    },
  }
}
