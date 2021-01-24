const path = require('path')

const localLoader = path.resolve(__dirname, './src/react-error-boundary.js')
console.log('localLoader', localLoader)
module.exports = fn => ec => {
  const {config} = ec
  console.log('######:1')
  config.module
    .rule('jsx')
    .test(/\.(js|jsx|ts|tsx)$/)
    .use('errorBoundary')
    .loader(localLoader)
  return fn(ec)
}
