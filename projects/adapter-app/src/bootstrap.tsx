import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(React.createElement(App), document.getElementById('emp-root'))

// 只在热更新时加载vue-2-hmr模块
if ((module as any).hot) {
  console.log('vue-2-hmr', module)
  import('src/adapter/vue-2-hmr')
}
