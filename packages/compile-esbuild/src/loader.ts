import type {ResovleConfig} from '@efox/emp'
export const loader = (config: ResovleConfig) => {
  if (config.build.target === 'es5' || config.build.target === 'es3') {
    config.build.target = 'es2015'
  }
  const target = config.build.target
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
