import React from 'react'
import {Button} from './Button'
import StoreComp from './StoreComp'

const App = () => {
  return (
    <>
      <h1>Micro Host!!</h1>
      <StoreComp />
      <Button customLabel="123123" />
    </>
  )
}
export default App
