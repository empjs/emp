import React from 'react'
export const React16Info: any = (props: any) => {
  return (
    <div>
      <h1>React App</h1>
      <p>React Version {React.version}</p>
      <h5>Props desc</h5>
      <p>{props.desc}</p>
      {props.children ? props.children : null}
    </div>
  )
}
