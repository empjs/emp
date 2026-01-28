import {type GlobalStore} from '@empjs/cli'
import {ForceRemoteOptions} from '../types'

export const registerRemotes = (store: GlobalStore, forceRemotes: ForceRemoteOptions) => {
  if (Object.keys(forceRemotes).length > 0) {
    store.injectTags(
      [
        {
          innerHTML: `window.EMP_FORCE_REMOTES = ${JSON.stringify(forceRemotes)};`,
          tagName: 'script',
          pos: 'head',
        },
      ],
      'EMP_FORCE_REMOTES',
    )
  }
}
