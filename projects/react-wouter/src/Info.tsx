import {useSearch} from 'wouter'

// Note: wouter's standard hook is useSearch for query string

const Info = () => {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const topic = params.get('topic') || 'general'

  return (
    <div>
      <h1>Information</h1>
      <p>This page demonstrates query parameter handling.</p>

      <div className="card">
        <h3>Query Parameters</h3>
        <p>
          Current Query String: <code>{search || '(empty)'}</code>
        </p>
        <p>
          Topic: <strong>{topic}</strong>
        </p>

        <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
          <a href="/info?topic=react">
            <button>React Topic</button>
          </a>
          <a href="/info?topic=wouter">
            <button>Wouter Topic</button>
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
