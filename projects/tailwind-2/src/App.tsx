import 'src/style.css'
import Colors from './demo/colors'
import DeviceInfo from './demo/Device'
import Shop from './demo/shop'
import Sizing from './demo/sizing'

function App() {
  return (
    <div className="relative bg-white/40 max-w-xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-black-800 p-10 text-center">Tailwind CSS 2</h1>

      <Shop />
      <Sizing />
      <Colors />
      <DeviceInfo />
    </div>
  )
}

export default App
