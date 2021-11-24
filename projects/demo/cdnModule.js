class CdnModule {
  jsdelivrHost = `https://cdn.jsdelivr.net/npm`
  // https://unpkg.com/react@16.7.0/umd/react.production.min.js
  unpkg = `https://unpkg.com`
  globalList = {
    react: {global: 'React', version: '17.0.2'},
    'react-dom': {global: 'ReactDOM', version: '17.0.2'}, //
    mobx: {global: 'mobx', version: '6.3.7'},
    'mobx-react-lite': {global: 'mobxReactLite', version: '3.2.2'},
    'react-router-dom': {global: 'ReactRouterDOM', version: '5.3.0', mode: 'none'},
  }
  mode = ''
  cb = {}
  constructor(mode) {
    this.mode = mode
  }
  getList(al = []) {
    al.map(pkg => {
      if (typeof pkg === 'object') {
        this.cb[pkg.name] = this.getJs(pkg.name, pkg.version)
      } else {
        this.cb[pkg] = this.getJs(pkg)
      }
    })
    return this.cb
  }
  getJs(pkg, ver) {
    let globalMode = this.mode
    const {global, version, mode} = this.globalList[pkg]
    if (!this.globalList[pkg] || mode === 'none') globalMode = ''
    console.log(this.globalList[pkg], globalMode)
    return this.getUrl(pkg, ver || version, global, globalMode)
  }
  getUrl(pkg, version, global, mode = '', moduleType = 'umd') {
    if (moduleType === 'esm') return `https://cdn.jsdelivr.net/npm/${pkg}/+esm`
    const d = `${global ? `${global}@` : ''}${this.unpkg}/${pkg}@${version}/${moduleType}/${pkg}${
      mode !== '' ? `.${mode}` : ``
    }${mode === 'development' ? '.js' : '.min.js'}`
    return d
  }
}

module.exports = CdnModule
