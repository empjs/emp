import {useState} from 'react'

export const Accordion = () => {
  const [open, setOpen] = useState<number | null>(0)
  const sections = [
    {title: 'What is Tailwind CSS?', content: 'A utility-first CSS framework for rapidly building custom designs.'},
    {title: 'Is it customizable?', content: 'Yes, configure design tokens and extend via plugins.'},
    {title: 'Does it work with React?', content: 'Absolutely, compose utilities within JSX and components.'},
  ]
  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
      {sections.map((s, i) => (
        <div key={s.title}>
          <button
            className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 flex items-center justify-between"
            onClick={() => setOpen(prev => (prev === i ? null : i))}
          >
            <span className="font-medium text-sm sm:text-base">{s.title}</span>
            <span className="text-gray-500">{open === i ? '-' : '+'}</span>
          </button>
          {open === i && (
            <div className="px-3 sm:px-4 pb-2.5 sm:pb-3 text-sm sm:text-base text-gray-600">{s.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}
