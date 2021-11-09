import {useEffect} from 'react'
async function getPromise() {
  setTimeout(() => Promise.resolve(console.log('getPromise')), 1000)
}
const App = () => {
  useEffect(() => {
    ;(async () => {
      console.log('async function')
      await getPromise()
    })()
  }, [])
  return <h1>EMP V2.0!!!</h1>
}
export default App
