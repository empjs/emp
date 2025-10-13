export default function LazyInner() {
  return (
    <div className="rounded-md bg-emerald-50 p-4 text-emerald-700">
      <div className="font-medium">This component was loaded with React.lazy</div>
      <div className="text-xs text-emerald-600">Split out into a separate chunk.</div>
    </div>
  )
}
