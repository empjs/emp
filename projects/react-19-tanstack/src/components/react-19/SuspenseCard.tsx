import React from 'react'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function createResource<T>(fn: () => Promise<T>) {
  let status: 'pending' | 'success' | 'error' = 'pending'
  let result: T | any
  const suspender = fn()
    .then(r => {
      status = 'success'
      result = r
    })
    .catch(e => {
      status = 'error'
      result = e
    })
  return {
    read() {
      if (status === 'pending') throw suspender
      if (status === 'error') throw result
      return result as T
    },
  }
}

const resource = createResource(async () => {
  await sleep(800)
  return {message: 'Data loaded via Suspense'}
})

function DataBlock() {
  const data = resource.read()
  return (
    <div className="rounded-md bg-indigo-50 p-4 text-indigo-700">
      <div className="font-medium">{data.message}</div>
      <div className="text-xs text-indigo-600">(Artificial 800ms delay)</div>
    </div>
  )
}

export const SuspenseCard = () => {
  return (
    <div className="relative p-4 rounded-lg border border-gray-200">
      <a
        href="https://github.com/empjs/emp/tree/main/projects/react-19-tanstack/src/components/react-19/SuspenseCard.tsx"
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
      <h3 className="text-lg font-semibold">Suspense for data loading</h3>
      <p className="text-sm text-gray-500">Demonstrates a simple Suspense data resource pattern.</p>
      <React.Suspense fallback={<div className="text-sm text-gray-500">Loading data…</div>}>
        <DataBlock />
      </React.Suspense>
    </div>
  )
}
