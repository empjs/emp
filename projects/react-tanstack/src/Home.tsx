import {useLocation, useNavigate} from '@tanstack/react-router'

const Home = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const goToRandomUser = () => {
    const randomId = Math.floor(Math.random() * 3) + 1
    navigate({to: `/user/${randomId}`})
  }

  return (
    <div>
      <h1>Welcome to React TanStack Router Demo</h1>
      <p>
        This demo showcases the features of <strong>@tanstack/react-router</strong>, a modern router for React.
      </p>

      <div className="card">
        <h3>Programmatic Navigation</h3>
        <p>
          Current Location: <code>{`${location.pathname}${location.search ?? ''}`}</code>
        </p>
        <button onClick={goToRandomUser}>Visit Random User Profile</button>
      </div>

      <div className="card">
        <h3>Features Demonstrated</h3>
        <ul>
          <li>
            <strong>Basic Routing:</strong> Simple path matching
          </li>
          <li>
            <strong>Dynamic Routes:</strong> Parameters like <code>/user/$id</code>
          </li>
          <li>
            <strong>Active Links:</strong> Navigation styling
          </li>
          <li>
            <strong>Programmatic Navigation:</strong> <code>useNavigate</code> hook
          </li>
          <li>
            <strong>404 Handling:</strong> Fallback routes
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Home

