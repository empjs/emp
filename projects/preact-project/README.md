# EMP preact 基站模板工程

## 依赖库 package.json

``` json

"devDependencies": {
  "@efox/emp-cli": "^1.2.9",
  "@efox/emp-tsconfig": "^1.0.4"
},
"dependencies": {
  "@babel/plugin-transform-react-jsx": "^7.12.5",
  "babel-plugin-jsx-pragmatic": "^1.0.2",
  "preact": "^10.5.5",
  "preact-router": "^3.2.1"
}

```

## 微前端配置 emp-config.js

``` js
const withPreact = require('@efox/emp-preact')
const path = require('path')
const ProjectRootPath = path.resolve('./')
const { getConfig } = require(path.join(ProjectRootPath, './src/config'))

module.exports = withPreact(({ config, env, empEnv }) => {
  const confEnv = env === 'production' ? 'prod' : 'dev'
  const conf = getConfig(empEnv || confEnv)

  const host = conf.host
  const port = conf.port
  const projectName = 'preactComponents'
  const publicPath = conf.publicPath

  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        title: 'EMP PREACT BASE',
        files: {
        },
      },
    }
    return args
  })
 
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        name: projectName,
        library: { type: 'var', name: projectName },
        filename: 'emp.js',
        exposes: {
          './header': 'src/components/header/index.jsx',
        },
      },
    }
    return args
  })
  config.output.publicPath(publicPath)
  config.devServer.port(port)
})

```