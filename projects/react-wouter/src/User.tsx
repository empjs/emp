import {useRoute, Link} from 'wouter'

// Simulated user data
const USERS = [
  {id: '1', name: 'Alice', role: 'Developer'},
  {id: '2', name: 'Bob', role: 'Designer'},
  {id: '3', name: 'Charlie', role: 'Manager'},
]

const User = () => {
  const [match, params] = useRoute('/user/:id')

  if (!match) return null

  const user = USERS.find(u => u.id === params.id)

  if (!user) {
    return (
      <div>
        <h1>User Not Found</h1>
        <p>User with ID <strong>{params.id}</strong> does not exist.</p>
        <Link href="/users">Back to Users</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>User Profile</h1>
      <div className="card">
        <h2>{user.name}</h2>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <br />
        <Link href="/users">← Back to Users List</Link>
      </div>
    </div>
  )
}

export const UserList = () => {
  return (
    <div>
      <h1>Users</h1>
      <p>Select a user to view details (Dynamic Route Example):</p>
      <div className="user-list">
        {USERS.map(user => (
          <Link key={user.id} href={`/user/${user.id}`} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.role}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default User
