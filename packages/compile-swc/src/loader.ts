import type {ResovleConfig} from '@efox/emp'
export const loader = (options: ResovleConfig) => {
  // console.log('options', options)
  return {
    loader: require.resolve('./swc'),
    options,
  }
}
export const compileType = 'swc'
