// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <>
    <App />
  </>,
  document.getElementById('emp-root'),
)

/**
 * mf 模式需把 热更代码放到这里 考虑用 plugin 动态加入
 */
/* if (module.hot) {
  module.hot.accept(err => {
    console.log('An error occurred while accepting new version')
  })
}
 */
