import React, {use} from 'react'

export const ThemeContext = React.createContext<'light' | 'dark'>('light')

export const UseContextDemo = () => {
  const theme = use(ThemeContext)
  return (
    <div className="relative rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4">
      <a
        href="https://github.com/empjs/emp/tree/main/projects/react-19-tanstack/src/components/react-19/UseContextDemo.tsx"
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
      <h3 className="text-lg font-semibold mb-2">use(Context)</h3>
      <p className="text-sm">
        Current theme from Context: <span className="font-mono">{theme}</span>
      </p>
    </div>
  )
}
