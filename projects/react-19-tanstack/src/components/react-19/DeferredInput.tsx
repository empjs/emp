import {useDeferredValue, useMemo, useState} from 'react'

export const DeferredInput = () => {
  const [text, setText] = useState('')
  const deferredText = useDeferredValue(text)

  const items = useMemo(() => Array.from({length: 3000}, (_, i) => `Row ${i}`), [])
  const filtered = useMemo(() => {
    const q = deferredText.toLowerCase()
    return items.filter(it => it.toLowerCase().includes(q))
  }, [items, deferredText])

  return (
    <div className="relative p-4 rounded-lg border border-gray-200">
      <a
        href="https://github.com/empjs/emp/tree/main/projects/react-19-tanstack/src/components/react-19/DeferredInput.tsx"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 top-3 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        aria-label="View source on GitHub"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17l10-10" />
          <path d="M8 7h9v9" />
        </svg>
        Source
      </a>
      <h3 className="text-lg font-semibold">useDeferredValue</h3>
      <p className="text-sm text-gray-500">The list updates using a deferred value to keep typing responsive.</p>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Filter rows"
        className="mt-2 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none"
      />
      <div className="mt-3 text-sm text-gray-600">Matched: {filtered.length}</div>
      <ul className="mt-2 grid grid-cols-2 gap-1 max-h-56 overflow-auto">
        {filtered.slice(0, 50).map(it => (
          <li key={it} className="text-xs text-gray-700">
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
