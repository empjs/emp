import StoreComp from './StoreComp'
import React from 'react'
import ReactDOM from 'react-dom'
console.log('[mf-host] react', React.version)
console.log('[mf-host] react-dom', ReactDOM.version)
export {StoreComp}

const App = () => {
  return (
    <>
      <h1>Micro Host</h1>
      <p>update from host</p>
      <StoreComp />
    </>
  )
}
export default App
