import {empStore as store} from '@efox/emp'
export const loader = () => {
  // console.log('store.config.build.target', store.config.build.target)
  if (store.config.build.target === 'es5' || store.config.build.target === 'es3') {
    store.config.build.target = 'es2015'
  }
  const target = store.config.build.target
  const options = {
    loader: 'tsx',
    target,
  }
  const o = {
    loader: require.resolve('esbuild-loader'),
    options,
  }

  return o
}

export default loader
export const compileType = 'esbuild'
