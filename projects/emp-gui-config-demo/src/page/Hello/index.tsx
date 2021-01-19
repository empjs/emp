import React, {ReactElement} from 'react'
import './index.scss'
import logo from 'src/logo.svg'

const Hello = (): ReactElement => {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>Hello EMP</h1>
    </div>
  )
}

export default Hello
