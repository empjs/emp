import store from 'src/helper/store'
import babel from './babel-loader'
import swc from './swc-loader'
export default () => {
  return store.config.moduleTransform.parser === 'swc' ? swc() : babel()
}
export const parserType = () => store.config.moduleTransform.parser
export const babelLoader = babel
export const swcLoader = swc
