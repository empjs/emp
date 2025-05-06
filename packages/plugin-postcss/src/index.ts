import type {GlobalStore} from '@empjs/cli'
import {plugins} from './plugins.js'
export type PluginPostcssType = {
  postcssOptions?: any
}
//
export default (o: PluginPostcssType = {}) => {
  return {
    name: '@empjs/plugin-postcss',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      //
      const ruleMap = ['sass', 'less', 'css']
      const loaderOptions: PluginPostcssType = {}
      if (o.postcssOptions) {
        loaderOptions.postcssOptions = o.postcssOptions
      }

      for (const ruleName of ruleMap) {
        const rule = chain.module.rule(ruleName)
        const useLightningcss = rule.use('postcss').loader(require.resolve('postcss-loader')).options(loaderOptions)
        //
        if (['sass', 'less'].includes(ruleName)) {
          useLightningcss.before(`${ruleName}Loader`)
        }
      }
    },
  }
}
const postcss = plugins
export {postcss}
