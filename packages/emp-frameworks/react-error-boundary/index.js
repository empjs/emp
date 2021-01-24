const path = require('path')

const localLoader = path.resolve(__dirname, './src/react-error-boundary.js')

module.exports = fn => ec => {
  const {config} = ec
  config.module
    .rule('jsx')
    .test(/\.jsx$/)
    .use(localLoader)
    .loader(localLoader)
  return fn(ec)
}
