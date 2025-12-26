const App = (props: {name?: string; debug?: boolean; status?: string}) => {
  console.log('props', props)
  if (props.debug) {
    console.log('debug ', props.debug)
  }
  return (
    <div>
      <h1>
        Provider {props.name ? props.name : ''} Status: {props.status ? props.status : ''}
      </h1>
    </div>
  )
}
export default App
