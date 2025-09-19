import React from 'react'
import style from './App.module.scss'

const App = (props: any) => (
  <div className={style.container}>
    <h1>React Adapter Host</h1>
    <p>React Version {React.version}</p>
    {props.children}
  </div>
)

export default App
