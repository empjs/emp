import {TailwindWrap} from './TailwindWrap'

function App() {
  return (
    <TailwindWrap>
      <div className="card">
        <div className="bg-white/40 max-w-xl mx-auto">
          <h1 className="font-serif text-4xl bg-amber-400 font-stretch-50% p-10 text-center">TailwindCSS 4 Host</h1>
          <p className="text-center font-thin text-black">src/component/app </p>
        </div>
      </div>
    </TailwindWrap>
  )
}

export default App
