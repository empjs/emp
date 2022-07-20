import useActionStore from 'src/store/ActionStore'
import useCodeStore from 'src/store/CodeStore'
export const Refresh = () => <p>Refresh {Math.random()}</p>
export const Controls = () => {
  const bears = useActionStore(state => state.bears)
  const increasePopulation = useActionStore(state => state.increasePopulation)
  const decreasePopulation = useActionStore(state => state.decreasePopulation)
  const removeAllBears = useActionStore(state => state.removeAllBears)
  return (
    <div className="controls">
      <h1>Controls</h1>
      <Refresh />
      <h1>{bears}</h1>
      <p>
        <button onClick={increasePopulation}>Inc</button>-<button onClick={decreasePopulation}>Dec</button>-
        <button onClick={removeAllBears}>Clean</button>
      </p>
    </div>
  )
}
export const Code = () => {
  const code = useCodeStore(state => state.code)
  const fetchRemote = useCodeStore(state => state.fetchRemote)
  const cleanCode = useCodeStore(state => state.cleanCode)
  return (
    <div className="code">
      <h1>Code</h1>
      <Refresh />
      <pre>{code}</pre>
      <p>
        <button onClick={fetchRemote}>Fetch</button>-<button onClick={cleanCode}>Clean</button>
      </p>
    </div>
  )
}
export const App = () => {
  return (
    <>
      <h1>Home</h1>
      <Refresh />
      <Controls />
      <Code />
    </>
  )
}
export default App
