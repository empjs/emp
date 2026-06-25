import './common.scss'

type HostType = {
  name?: string
}
const port: any = process.env.port
console.log('port', port)
const App = ({name}: HostType) => (
  <div className={`item p${port}`}>
    <h1>
      Reactv18Runtime-Host: {name ? name : ''} : {port}
    </h1>
    <p></p>
  </div>
)
export default App
