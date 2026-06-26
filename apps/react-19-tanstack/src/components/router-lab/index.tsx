import {Link} from '@tanstack/react-router'

const routerLabUsers = [
  {id: 'alice', name: 'Alice', role: 'Developer'},
  {id: 'bob', name: 'Bob', role: 'Designer'},
  {id: 'charlie', name: 'Charlie', role: 'Manager'},
]

export function RouterLabIndex() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">TanStack Router Lab</h1>
        <p className="text-sm text-gray-600">
          Minimal route coverage for static and parameterized paths in the React 19 canonical app.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {routerLabUsers.map(user => (
          <Link
            key={user.id}
            to="/router-lab/$id"
            params={{id: user.id}}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.role}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function RouterLabUser({id}: {id: string}) {
  const user = routerLabUsers.find(item => item.id === id)

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">User Not Found</h1>
        <p className="text-sm text-gray-600">No router lab profile matches {id}.</p>
        <Link to="/router-lab" className="inline-flex rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white">
          Back to Router Lab
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <Link to="/router-lab" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        Back to Router Lab
      </Link>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <dl className="mt-4 grid gap-3 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Route param</dt>
            <dd className="font-mono text-gray-900">{id}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Role</dt>
            <dd className="text-gray-900">{user.role}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
