import React from 'react'
import {Button} from 'src/Button'
import StoreComp from './StoreComp'
export {Button, StoreComp}
const App = () => {
  return (
    <>
      <h1>Micro Host</h1>
      <StoreComp />
      <Button customLabel="HOST" />
    </>
  )
}
export default App
