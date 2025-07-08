import Colors from './demo/colors'
import Shop from './demo/shop'
import Sizing from './demo/sizing'
import Figure from './demo/v2/Figure'
import {GridFlow} from './demo/v2/Grid'
import Responsive from './demo/v2/Responsive'

function App() {
  return (
    <div className="relative bg-white/40 max-w-xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-black-800 p-10 text-center">Tailwind CSS 4</h1>
      <Responsive />
      <Figure />
      <GridFlow />
      {/* <Shop /> */}
      {/* <Sizing /> */}
      {/* <Colors /> */}
    </div>
  )
}

export default App
