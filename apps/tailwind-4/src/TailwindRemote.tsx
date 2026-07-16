import './remote-scope.css'

const TailwindRemote = () => (
  <section
    className="rounded-xl bg-violet-600 p-6 text-white shadow-lg"
    data-tailwind-remote="scoped"
  >
    <h2 className="text-xl font-bold">Tailwind MF isolated remote</h2>
    <p className="mt-2 text-sm">Remote utilities loaded without host preflight.</p>
  </section>
)

export default TailwindRemote
