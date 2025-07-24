import {MFApi} from '@astro/yyapi'
import {empRuntime} from '@astro-ui/emp'

empRuntime.init({})
MFApi.impl.init()

const App = () => <div>app !!</div>
export default App
