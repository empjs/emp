export const StatsBar = () => {
  const stats = [
    {label: 'Users', value: '12,450'},
    {label: 'Revenue', value: '$98k'},
    {label: 'Sessions', value: '1.2M'},
    {label: 'Uptime', value: '99.98%'},
  ]
  return (
    <section className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl bg-gray-50 p-3 sm:p-4">
          <div className="text-sm text-gray-500">{s.label}</div>
          <div className="text-2xl sm:text-3xl font-bold">{s.value}</div>
        </div>
      ))}
    </section>
  )
}