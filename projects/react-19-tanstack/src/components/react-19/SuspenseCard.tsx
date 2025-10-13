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
    <div className="p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold">Suspense for data loading</h3>
      <p className="text-sm text-gray-500">Demonstrates a simple Suspense data resource pattern.</p>
      <React.Suspense fallback={<div className="text-sm text-gray-500">Loading data…</div>}>
        <DataBlock />
      </React.Suspense>
    </div>
  )
}
