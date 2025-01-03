import {useState} from 'react'
import {port} from './config'
import {remotes} from './share'
//
export const Component = () => {
  const [count, setCount] = useState(0)
  const config = remotes.find(d => d.name === `c${port}`)
  return (
    <div className="component">
      <div className="info">
        <h3>Component from project {port}</h3>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>
      <p>Text Clicked: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
    </div>
  )
}
export default Component
