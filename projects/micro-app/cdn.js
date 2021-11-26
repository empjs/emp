const envLib = {
  development: {
    react: 'React@https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.js',
    'react-dom': 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js',
    // 'react-router-dom':
    //   'ReactRouterDOM@https://cdn.jsdelivr.net/npm/react-router-dom@6.0.1/umd/react-router-dom.development.js',
    mobx: 'mobx@https://cdn.jsdelivr.net/npm/mobx@6.3.7/dist/mobx.umd.development.js',
    // 'mobx-react': 'mobxReact@https://cdn.jsdelivr.net/npm/mobx-react@7.2.1/dist/mobxreact.umd.development.js',
    'mobx-react-lite':
      'mobxReactLite@https://cdn.jsdelivr.net/npm/mobx-react-lite@3.2.2/dist/mobxreactlite.umd.development.js',
  },
  production: {
    react: 'React@https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js',
    'react-dom': 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js',
    // 'react-router-dom':
    //   'ReactRouterDOM@https://cdn.jsdelivr.net/npm/react-router-dom@6.0.1/umd/react-router-dom.production.min.js',
    mobx: 'mobx@https://cdn.jsdelivr.net/npm/mobx@6.3.7/dist/mobx.umd.production.min.js',
    // 'mobx-react': 'mobxReact@https://cdn.jsdelivr.net/npm/mobx-react@7.2.1/dist/mobxreact.umd.production.min.js',
    'mobx-react-lite':
      'mobxReactLite@https://cdn.jsdelivr.net/npm/mobx-react-lite@3.2.2/dist/mobxreactlite.umd.production.min.js',
  },
}
const lib = {
  'react-router-dom': 'ReactRouterDOM@https://cdn.jsdelivr.net/npm/react-router-dom@5.3.0/umd/react-router-dom.min.js',
}
module.exports = {
  cdn: mode => {
    return {
      ...envLib[mode],
      // ...lib,
    }
  },
  esm: (name, mode, version) =>
    `https://esm.sh/${name}${version ? '@' + version : ''}${mode === 'development' ? '?dev' : ''}`,
}
