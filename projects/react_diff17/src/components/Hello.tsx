import React, {useEffect} from 'react'

export interface HelloProps {
  compiler: string
  framework: string
}

const Hello = (props: HelloProps) => {
  useEffect(() => {
    console.log('React hooks is Working')
  })
  return (
    <h1>
      Hello from {props.compiler} and {props.framework}!
    </h1>
  )
}

export default Hello
