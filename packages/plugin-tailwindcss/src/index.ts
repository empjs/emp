import {createRequire} from 'node:module'
import type {GlobalStore} from '@empjs/cli'
import type {TailwindcssOptions} from './types.js'

const require = createRequire(import.meta.url)

export default (tailwindcssOptions?: TailwindcssOptions) => {
  return {
    name: '@empjs/plugin-tailwindcss',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      const rule = chain.module.rule(store.chainName.rule.css)
      rule
        .set('type', 'css')
        .use('tailwindcss')
        .loader(require.resolve('@tailwindcss/webpack'))
        .options({
          base: tailwindcssOptions?.base ?? store.root,
          optimize: tailwindcssOptions?.optimize ?? !store.isDev,
        })
    },
  }
}
