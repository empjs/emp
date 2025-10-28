import React, {useOptimistic, useState} from 'react'

export const OptimisticListDemo = () => {
  const [items, setItems] = useState<string[]>(['Alpha', 'Beta'])
  const [optimisticItems, addOptimistic] = useOptimistic(items, (current: string[], newItem: string) => {
    return [...current, newItem]
  })

  async function handleAdd(formData: FormData) {
    const value = String(formData.get('item') || '').trim()
    if (!value) return
    // Show instantly
    addOptimistic(value)
    // Simulate server request
    await new Promise(r => setTimeout(r, 900))
    // Commit
    setItems(prev => [...prev, value])
  }

  return (
    <form
      action={handleAdd}
      className="relative rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4 space-y-3"
    >
      <a
        href="https://github.com/empjs/emp/tree/main/projects/react-19-tanstack/src/components/react-19/OptimisticListDemo.tsx"
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
      <h3 className="text-lg font-semibold">useOptimistic()</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Instantly reflect changes while async work completes.</p>
      <div className="flex gap-2">
        <input
          name="item"
          placeholder="Add item"
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {optimisticItems.map((it, idx) => (
          <li key={`${it}-${idx}`} className="rounded-md border px-3 py-2 text-sm bg-white/60 dark:bg-neutral-800/60">
            {it}
          </li>
        ))}
      </ul>
    </form>
  )
}
