import {TailwindWrap} from './TailwindWrap'

function Info() {
  return (
    <TailwindWrap>
      <div className="relative bg-white/40 max-w-xl mx-auto">
        <h1 className="text-4xl bg-blue-500 font-mono p-10 text-center">TailwindCSS 4 Info</h1>
        <p className="text-center font-thin text-black">src/component/Info </p>
      </div>
    </TailwindWrap>
  )
}

export default Info
