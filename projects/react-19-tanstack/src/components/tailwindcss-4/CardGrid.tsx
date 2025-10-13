type CardProps = {
  title: string
  desc: string
  icon?: React.ReactNode
}

export const Card = ({title, desc, icon}: CardProps) => (
  <div className="rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-indigo-50 text-indigo-600 grid place-items-center">{icon ?? '★'}</div>
      <div className="font-semibold">{title}</div>
    </div>
    <p className="mt-2 text-sm sm:text-base text-gray-600">{desc}</p>
    <button className="mt-3 inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-white text-sm hover:bg-indigo-700">
      Action
    </button>
  </div>
)

export const CardGrid = () => {
  const items = [
    {title: 'Analytics', desc: 'Quickly understand your audience and metrics.'},
    {title: 'Automation', desc: 'Build flows and integrate with third-party tools.'},
    {title: 'Collaboration', desc: 'Work together with your team in real-time.'},
    {title: 'Security', desc: 'Safeguard your data with modern best practices.'},
  ]
  return (
    <section className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <Card key={it.title} title={it.title} desc={it.desc} />
      ))}
    </section>
  )
}