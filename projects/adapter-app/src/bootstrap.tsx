import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(React.createElement(App), document.getElementById('emp-root'))

// 只在热更新时加载vue v2 模块
if ((module as any).hot) import('src/adapter/Vue2Exports')
