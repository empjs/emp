import React, { use } from 'react'

// Demo resources for `use()`
const greetingPromise = new Promise<string>(resolve => {
  setTimeout(() => resolve('Hello from use() after a short delay!'), 800)
})

export const UsePromiseDemo = () => {
  const message = use(greetingPromise)
  return (
    <div className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
      <h3 className="text-lg font-semibold mb-2">use(Promise)</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  )
}