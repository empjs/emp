const path = require('path')

module.exports = fn => ec => {
  const {config} = ec
  const srcPath = path.resolve('./src')
  config.entry('index').clear().add(path.join(srcPath, 'index.js'))
  config.module
    .rule('preact')
    .test(/\.(js|jsx|ts|tsx)$/)
    .exclude
    .add(/node_modules/)
    .end()
    .use('babel')
    .loader('babel-loader')
    .options({
      plugins: [
      [
        require('@babel/plugin-transform-react-jsx').default,
        {
          pragma: "h",
          pragmaFrag: "Fragment"
        }
      ],
      [
        require.resolve('babel-plugin-jsx-pragmatic'),
        {
          module: "preact",
          import: "h",
          export: "h"
        }
      ]
    ]
    })
  return fn(ec)
}
