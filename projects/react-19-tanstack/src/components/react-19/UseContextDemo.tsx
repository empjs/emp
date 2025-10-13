import React, { use } from 'react'

export const ThemeContext = React.createContext<'light' | 'dark'>('light')

export const UseContextDemo = () => {
  const theme = use(ThemeContext)
  return (
    <div className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
      <h3 className="text-lg font-semibold mb-2">use(Context)</h3>
      <p className="text-sm">Current theme from Context: <span className="font-mono">{theme}</span></p>
    </div>
  )
}