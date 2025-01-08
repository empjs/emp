import {useState} from 'react'
import {port} from './share'

//
export const Component = () => {
  const [count, setCount] = useState(0)
  return (
    <div className="component">
      <h3>Component from port {port}</h3>
      <p>Times clicked: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
    </div>
  )
}
export default Component
