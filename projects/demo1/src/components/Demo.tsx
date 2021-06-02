import React, {useState} from 'react'

const Demo = (): any => {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>Demo 1 Here Remote Components!!</h1>
      <h1>Count {count}</h1>
      <button onClick={() => setCount(count + 1)}>cilck</button>
    </>
  )
}

export default Demo
