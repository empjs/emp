import {useMemo, useState, useTransition} from 'react'

export const TransitionSearch = () => {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const items = useMemo(() => Array.from({length: 3000}, (_, i) => `Item ${i}`), [])
  const [list, setList] = useState<string[]>(items)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    startTransition(() => {
      const v = value.toLowerCase()
      const next = items.filter(it => it.toLowerCase().includes(v))
      setList(next)
    })
  }

  return (
    <div className="relative p-4 rounded-lg border border-gray-200">
      <a
        href="https://github.com/empjs/emp/tree/main/projects/react-19-tanstack/src/components/react-19/TransitionSearch.tsx"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 top-3 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        aria-label="View source on GitHub"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17l10-10" />
          <path d="M8 7h9v9" />
        </svg>
        Source
      </a>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">startTransition</h3>
        {isPending && <span className="text-xs text-gray-500 animate-pulse">Updating list…</span>}
      </div>
      <p className="text-sm text-gray-500">Type to filter a large list without blocking input.</p>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search items"
        className="mt-2 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none"
      />
      <div className="mt-3 text-sm text-gray-600">Matched: {list.length}</div>
      <ul className="mt-2 grid grid-cols-2 gap-1 max-h-56 overflow-auto">
        {list.slice(0, 50).map(it => (
          <li key={it} className="text-xs text-gray-700">
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
