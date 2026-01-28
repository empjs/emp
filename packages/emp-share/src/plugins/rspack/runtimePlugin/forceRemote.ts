import {type ModuleFederationRuntimePlugin} from '@module-federation/runtime'
import {ForceRemoteOptions} from '../types'

/** 从 forceRemotes 中提取仅用于版本替换的 map（string 或 { version }） */
function getVersionMap(forceRemotes: ForceRemoteOptions): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [key, value] of Object.entries(forceRemotes)) {
    if (typeof value === 'string') {
      map[key] = value
    } else if (value && typeof value === 'object' && 'version' in value && typeof value.version === 'string') {
      map[key] = value.version
    }
  }
  return map
}

const changeCommonVersion = (url: string, versions: Record<string, string>) => {
  if (!versions || !Object.keys(versions).length) return url
  let result = url
  for (const [key, version] of Object.entries(versions)) {
    if (!version) continue
    const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const regex = new RegExp(`(${escapedKey}@)([^/]+)`)
    if (regex.test(result)) {
      result = result.replace(regex, `$1${version}`)
    }
  }
  return result
}

const setRemoteEntry = (remote: Record<string, unknown>, newEntry: string) => {
  if ('entry' in remote && typeof remote.entry === 'string') {
    remote.entry = newEntry
  } else if ('url' in remote && typeof remote.url === 'string') {
    remote.url = newEntry
  } else if ('manifest' in remote && typeof remote.manifest === 'string') {
    remote.manifest = newEntry
  }
}

const getRemoteEntry = (remote: Record<string, unknown>): string | undefined => {
  if ('entry' in remote && typeof remote.entry === 'string') return remote.entry
  if ('url' in remote && typeof remote.url === 'string') return remote.url
  if ('manifest' in remote && typeof remote.manifest === 'string') return remote.manifest
  return undefined
}

export default function (forceRemotes: ForceRemoteOptions): ModuleFederationRuntimePlugin {
  const versionMap = getVersionMap(forceRemotes)

  return {
    name: 'emp-remotes-replacer',
    // beforeInit(args) {
    //   if (!window.EMP_APP_FORCE_VERSION) {
    //     window.EMP_APP_FORCE_VERSION = versionMap
    //   }
    //   return args
    // },
    beforeRegisterRemote(args) {
      const remote = args.remote as unknown as Record<string, unknown>
      if (!remote) return args

      const remoteName = typeof remote.name === 'string' ? remote.name : undefined
      const item = remoteName ? forceRemotes[remoteName] : undefined

      // 整入口替换：key 为当前 remote 的 name 且配置为 { entry }
      if (item && typeof item === 'object' && 'entry' in item && typeof item.entry === 'string') {
        setRemoteEntry(remote, item.entry)
        return args
      }

      // 版本替换：对 entry/url/manifest 中的 key@xxx 做替换
      const current = getRemoteEntry(remote)
      if (current) {
        const next = changeCommonVersion(current, versionMap)
        if (next !== current) setRemoteEntry(remote, next)
      }
      return args
    },
  }
}
