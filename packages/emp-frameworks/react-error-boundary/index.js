const path = require('path')

const localLoader = path.resolve(__dirname, './src/react-error-boundary.js')
module.exports = (options, fn) => ec => {
  const {config} = ec
  console.log('######:1', options)
  config.module
    .rule('jsx')
    .test(/\.(jsx|tsx)$/)
    .use('errorBoundary')
    .loader(localLoader)
    .options(
      options || {
        componentList: ['Test1', 'Test2'],
      },
    )
  return fn && fn(ec)
}
