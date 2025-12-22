// Using regular anchor for navigation to avoid type issues in Link under current tsconfig

const USERS = [
  {id: '1', name: 'Alice', role: 'Developer'},
  {id: '2', name: 'Bob', role: 'Designer'},
  {id: '3', name: 'Charlie', role: 'Manager'},
]

const User = ({id}: {id: string}) => {
  const user = USERS.find(u => u.id === id)

  if (!user) {
    return (
      <div>
        <h1>User Not Found</h1>
        <p>
          User with ID <strong>{id}</strong> does not exist.
        </p>
        <a href="/users">Back to Users</a>
      </div>
    )
  }

  return (
    <div>
      <h1>User Profile</h1>
      <div className="card">
        <h2>{user.name}</h2>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <br />
        <a href="/users">← Back to Users List</a>
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
          <a key={user.id} href={`/user/${user.id}`} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.role}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

export default User
