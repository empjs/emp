import {useLocation} from '@tanstack/react-router'

const Info = () => {
  const location = useLocation()
  const search = location.search ?? ''
  const searchString = typeof search === 'string' ? search : ''
  const params = new URLSearchParams(searchString)
  const topic = params.get('topic') || 'general'

  return (
    <div>
      <h1>Information</h1>
      <p>This page demonstrates query parameter handling.</p>

      <div className="card">
        <h3>Query Parameters</h3>
        <p>
          Current Query String: <code>{searchString || '(empty)'}</code>
        </p>
        <p>
          Topic: <strong>{topic}</strong>
        </p>

        <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
          <a href="/info?topic=react">
            <button>React Topic</button>
          </a>
          <a href="/info?topic=tanstack">
            <button>TanStack Topic</button>
          </a>
          <a href="/info">
            <button>Clear Topic</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Info
