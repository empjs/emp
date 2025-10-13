export const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 sm:p-8 md:p-12 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Tailwind CSS 4 Showcase</h1>
        <p className="mt-3 text-sm md:text-base opacity-90">
          A curated set of UI blocks demonstrating common patterns: navigation, cards, forms, lists, stats, tables, and
          more — all composed with utility classes.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
          <a href="#components" className="rounded-lg bg-white/90 px-4 py-2 text-indigo-700 font-medium hover:bg-white">
            Explore Components
          </a>
          <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" className="rounded-lg bg-black/20 px-4 py-2 font-medium hover:bg-black/30">
            Docs
          </a>
        </div>
      </div>
      <div className="absolute -right-24 -bottom-24 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-white/30 blur-2xl" />
    </section>
  )
}