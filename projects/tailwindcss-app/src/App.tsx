// import 'tailwindcssHost/tailwindcss'
import AppHost from 'tailwindcssHost/App'
import Color from 'tailwindcssHost/Color'
import Info from 'tailwindcssHost/Info'

function App() {
  return (
    <div className="relative bg-white/40 max-w-xl mx-auto space-y-6">
      <h1 className="text-4xl font-sans text-black-800 p-10 text-center">Tailwind CSS App</h1>
      <AppHost />
      <Info />
      <Color />
    </div>
  )
}

export default App
