import {Link, useRouter} from '@tanstack/react-router'

export const Nav = () => {
  const {routesByPath} = useRouter()
  const paths = Object.keys(routesByPath)
    // keep root first, others alphabetical
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))

  const toLabel = (p: string) => {
    if (p === '/') return 'Tailwindcss 4'
    const seg = p.split('/').filter(Boolean).pop() || p
    return seg
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-3 sm:px-4">
        <ul className="flex flex-wrap items-center gap-2 sm:gap-3 py-2">
          {paths.map(p => (
            <li key={p}>
              <Link
                to={p}
                className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors [&.active]:bg-indigo-600 [&.active]:text-white"
              >
                {toLabel(p)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
