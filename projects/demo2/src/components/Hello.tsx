export interface HelloProps {
  compiler: string
  framework: string
}

const Hello = (props: HelloProps) => (
  <>
    <h1>
      Hello from {props.compiler} and {props.framework}!
    </h1>
    <p>this component form demo2</p>
  </>
)

export default Hello
