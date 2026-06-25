export const Stat = () => (
  <div className="grid grid-cols-1 gap-4 w-full">
    <div className="stats shadow w-full grid-flow-row sm:grid-flow-col">
      <div className="stat border-b sm:border-b-0 sm:border-r border-gray-200">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 md:h-8 md:w-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div className="stat-title text-sm md:text-base">Total Likes</div>
        <div className="stat-value text-primary text-xl md:text-2xl lg:text-3xl">25.6K</div>
        <div className="stat-desc text-xs md:text-sm">21% more than last month</div>
      </div>

      <div className="stat border-b sm:border-b-0 sm:border-r border-gray-200">
        <div className="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 md:h-8 md:w-8 stroke-current"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div className="stat-title text-sm md:text-base">Page Views</div>
        <div className="stat-value text-secondary text-xl md:text-2xl lg:text-3xl">2.6M</div>
        <div className="stat-desc text-xs md:text-sm">21% more than last month</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <div className="avatar online">
            <div className="w-10 md:w-16 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
            </div>
          </div>
        </div>
        <div className="stat-value text-xl md:text-2xl lg:text-3xl">86%</div>
        <div className="stat-title text-sm md:text-base">Tasks done</div>
        <div className="stat-desc text-secondary text-xs md:text-sm">31 tasks remaining</div>
      </div>
    </div>
  </div>
)
