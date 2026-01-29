import {type GlobalStore} from '@empjs/cli'
import {shareForceRemote} from 'src/helper/config'
import {ForceRemoteOptions} from '../types'

export const registerRemotes = (store: GlobalStore, forceRemotes: ForceRemoteOptions) => {
  if (Object.keys(forceRemotes).length > 0) {
    store.injectTags(
      [
        {
          innerHTML: `window.${shareForceRemote} = ${JSON.stringify(forceRemotes)};`,
          tagName: 'script',
          pos: 'head',
        },
      ],
      'EMP_FORCE_REMOTES',
    )
  }
}
