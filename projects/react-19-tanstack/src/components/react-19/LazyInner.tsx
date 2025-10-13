export default function LazyInner() {
  return (
    <div className="relative rounded-md bg-emerald-50 p-4 text-emerald-700">
      <a
        href="https://github.com/empjs/emp/tree/main/projects/react-19-tanstack/src/components/react-19/LazyInner.tsx"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 top-3 inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800"
        aria-label="View source on GitHub"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17l10-10" />
          <path d="M8 7h9v9" />
        </svg>
        Source
      </a>
      <div className="font-medium">This component was loaded with React.lazy</div>
      <div className="text-xs text-emerald-600">Split out into a separate chunk.</div>
    </div>
  )
}
