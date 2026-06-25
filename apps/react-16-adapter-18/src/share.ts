import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'

const entry = process.env.mfhost as string
console.log('shared', entry)
// 实例化远程 emp
empRuntime.init({
  // shared: reactAdapter.shared,
  remotes: [
    {
      name: 'mfHost',
      entry,
    },
  ],
  name: 'federationRuntimeDemo',
  // shareStrategy: 'loaded-first',
})
//
// empRuntime.preloadRemote([
//   {
//     nameOrAlias: 'mfHost',
//     resourceCategory: 'sync',
//   },
// ])
//
export {empRuntime, reactAdapter}
