import {Link} from 'wouter'

const NotFound = () => {
  return (
    <div style={{textAlign: 'center', padding: '2rem'}}>
      <h1 style={{fontSize: '4rem', marginBottom: '1rem'}}>404</h1>
      <p>Page not found</p>
      <Link href="/">
        <button>Go Home</button>
      </Link>
    </div>
  )
}

export default NotFound
