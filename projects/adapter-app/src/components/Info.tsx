import React from 'react'
import style from './Info.module.scss'
export const React16Info: any = (props: any) => {
  return (
    <div className={`${style.box} ${style.react16Info}`}>
      <h1>React App</h1>
      <p>React Version {React.version}</p>
      <h5>Props desc</h5>
      <p className={style.desc}>{props.desc}</p>
      <div className={style.box}>{props.children ? props.children : null}</div>
    </div>
  )
}

export const Box = (props: any): any => {
  return <div className={style.box}>{props.children}</div>
}
