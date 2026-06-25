export const Table = () => {
  const rows = [
    {name: 'Alice', role: 'Designer', status: 'Active'},
    {name: 'Bob', role: 'Engineer', status: 'Away'},
    {name: 'Carol', role: 'PM', status: 'Active'},
    {name: 'Dave', role: 'Ops', status: 'Offline'},
  ]
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map(r => (
            <tr key={r.name}>
              <td className="px-3 sm:px-4 py-2 whitespace-nowrap">{r.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{r.role}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={
                    r.status === 'Active'
                      ? 'inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs sm:text-sm text-green-700'
                      : r.status === 'Away'
                        ? 'inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs sm:text-sm text-yellow-700'
                        : 'inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs sm:text-sm text-gray-700'
                  }
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
