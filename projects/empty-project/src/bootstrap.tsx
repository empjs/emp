import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import 'src/components/styles/icon.scss'
console.log(
  'process.env.DB_HOST',
  process.env.DB_HOST,
  process.env.PASS_WORD,
  process.env.MODE_ENV,
  process.env.EMP_ENV,
)
ReactDOM.render(<App />, document.getElementById('emp-root'))
