import pluginReact from '@empjs/plugin-react'
// reset
let target = 'es2015'
let useImportMap = false
const dts = false
let empShare = {}
// ==============================
export default store => {
  // 主要选择设置 esm cjs shared
  const selectMode = 'esm'
  getEmpshareLibConfig(selectMode, store)
  //===================
  const st = {
    plugins: [pluginReact()],
    server: {
      port: 3301,
    },
    build: {
      target,
      polyfill: 'usage',
    },
    html: {
      title: 'esm react host',
    },
    empShare: {
      dts,
      name: 'esmReactHost',
      exposes: {
        './App': './src/App',
      },
      useImportMap,
      remotes: {},
      ...empShare,
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
  }
  // console.log(st)
  return st
}
function getEmpshareLibConfig(type, store) {
  let cb = {}
  switch (type) {
    case 'esm':
      cb = {
        shareLib: {
          react: `https://esm.sh/react@18.2.0${store.isDev ? '?dev' : ''}`,
          'react-dom': `https://esm.sh/react-dom@18.2.0${store.isDev ? '?dev' : ''}`,
        },
      }
      if (store.isDev) {
        cb.shareLib['react/jsx-dev-runtime'] = 'https://esm.sh/react/jsx-dev-runtime.js'
      } else {
        cb.shareLib['react/jsx-runtime'] = 'https://esm.sh/react/jsx-runtime.js'
      }
      useImportMap = true
      target = 'es2015'
      empShare = cb
      break
    case 'cjs':
      cb = {
        shareLib: store.isDev
          ? {
              react: 'React@https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.min.js',
              'react-dom': 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js',
              // 'react/jsx-dev-runtime': 'https://cdn.jsdelivr.net/npm/react@18.2.0/jsx-dev-runtime.js',
            }
          : {
              react: 'React@https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js',
              'react-dom': 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js',
              // 'react/jsx-runtime': 'https://cdn.jsdelivr.net/npm/react@18.2.0/jsx-runtime.js',
            },
      }
      useImportMap = false
      target = 'es5'
      empShare = cb
      break
    default:
      cb = {
        shared: {
          react: {
            singleton: true,
          },
          'react-dom': {
            singleton: true,
          },
        },
      }
      useImportMap = false
      target = 'es5'
      empShare = cb
      break
  }
}
