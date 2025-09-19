import React from 'react'

const App = (props: any) => (
  <>
    <h1>React Adapter Host</h1>
    <p>React Version {React.version}</p>
    {props.children}
  </>
)

export default App
