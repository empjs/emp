import {lazy, Suspense, useState} from 'react'

const TailwindRemote = lazy(() => import('tailwindRemote/ScopedCard'))

const TailwindIsolationLab = () => {
  const [showRemote, setShowRemote] = useState(false)

  return (
    <section data-tailwind-isolation-lab>
      <h2>Tailwind MF isolation</h2>
      <p
        data-host-style-sentinel
        style={{
          backgroundColor: 'rgb(250, 250, 250)',
          color: 'rgb(17, 24, 39)',
          margin: '7px',
          padding: '11px',
        }}
      >
        Host style sentinel
      </p>
      <button type="button" onClick={() => setShowRemote(true)}>
        Load Tailwind remote
      </button>
      <Suspense fallback={<p>Loading Tailwind remote...</p>}>
        {showRemote ? <TailwindRemote /> : null}
      </Suspense>
    </section>
  )
}

export default TailwindIsolationLab
