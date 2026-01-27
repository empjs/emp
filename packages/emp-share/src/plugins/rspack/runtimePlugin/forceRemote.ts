import {type ModuleFederationRuntimePlugin} from '@module-federation/runtime'

const getShareName = (name: string, version: string) => {
  return `${name}_${version}`.replace(/@/g, '').replace(/[^\w_]/g, '_')
}

export default function (replaceRemoteVersions: Record<string, string>): ModuleFederationRuntimePlugin {
  return {
    name: 'empshare-force-remote',

    beforeInit(args) {
      if (args.userOptions.remotes) {
        args.userOptions.remotes.forEach(remote => {
          if (remote.alias && replaceRemoteVersions[remote.alias]) {
            const version = replaceRemoteVersions[remote.alias]
            remote.name = getShareName(remote.alias, version)
            remote['entry'] = remote['entry'].replace(/(.*)(@[^/]+)(\/)/, `$1@${version}$3`)
          }
        })
        console.log('[runtime-plugin] 已修改 userOptions.remotes 配置', args.userOptions.remotes)
      }
      return args
    },
  }
}
