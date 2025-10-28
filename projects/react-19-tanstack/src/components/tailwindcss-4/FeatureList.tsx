export const FeatureList = () => {
  const features = [
    {name: 'Responsive utilities', desc: 'Build mobile-first layouts with breakpoint modifiers.'},
    {name: 'Dark mode', desc: 'Toggle themes using class strategy or system preference.'},
    {name: 'Grid & Flexbox', desc: 'Compose complex layouts with grid and flex utilities.'},
    {name: 'Typography', desc: 'Polish text styles with leading, tracking, and font utilities.'},
    {name: 'Animations', desc: 'Leverage transition and transform utilities for motion.'},
  ]
  return (
    <ul className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(f => (
        <li key={f.name} className="rounded-lg border border-gray-200 p-2 sm:p-3">
          <div className="font-medium">{f.name}</div>
          <div className="text-sm sm:text-base text-gray-500">{f.desc}</div>
        </li>
      ))}
    </ul>
  )
}
