import {useState} from 'react'

export default () => {
  // 添加状态管理
  const [selectedSize, setSelectedSize] = useState('xs')

  const handleSizeChange = (e: any) => {
    setSelectedSize(e.target.value)
  }

  return (
    <div className="flex flex-col sm:flex-row font-sans rounded-lg overflow-hidden shadow-lg">
      <div className="flex-none w-full sm:w-48 h-48 sm:h-auto relative">
        <img
          src="/classic-utility-jacket.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <form className="flex-auto p-4 sm:p-6">
        <div className="flex flex-wrap">
          <h1 className="flex-auto text-base sm:text-lg font-semibold text-slate-900">Classic Utility Jacket</h1>
          <div className="text-base sm:text-lg font-semibold text-slate-500">$110.00</div>
          <div className="w-full flex-none text-xs sm:text-sm font-medium text-slate-700 mt-1 sm:mt-2">In stock</div>
        </div>
        <div className="flex items-baseline mt-2 sm:mt-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-200">
          <div className="space-x-1 sm:space-x-2 flex flex-wrap text-xs sm:text-sm">
            <label>
              <input
                className="sr-only peer"
                name="size"
                type="radio"
                value="xs"
                checked={selectedSize === 'xs'}
                onChange={handleSizeChange}
              />
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                XS
              </div>
            </label>
            <label>
              <input
                className="sr-only peer"
                name="size"
                type="radio"
                value="s"
                checked={selectedSize === 's'}
                onChange={handleSizeChange}
              />
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                S
              </div>
            </label>
            <label>
              <input
                className="sr-only peer"
                name="size"
                type="radio"
                value="m"
                checked={selectedSize === 'm'}
                onChange={handleSizeChange}
              />
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                M
              </div>
            </label>
            <label>
              <input
                className="sr-only peer"
                name="size"
                type="radio"
                value="l"
                checked={selectedSize === 'l'}
                onChange={handleSizeChange}
              />
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                L
              </div>
            </label>
            <label>
              <input
                className="sr-only peer"
                name="size"
                type="radio"
                value="xl"
                checked={selectedSize === 'xl'}
                onChange={handleSizeChange}
              />
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                XL
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6 text-xs sm:text-sm font-medium">
          <div className="flex-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="h-8 sm:h-10 px-4 sm:px-6 font-semibold rounded-md bg-black text-white" type="submit">
              Buy now
            </button>
            <button
              className="h-8 sm:h-10 px-4 sm:px-6 font-semibold rounded-md border border-slate-200 text-slate-900"
              type="button"
            >
              Add to bag
            </button>
          </div>
          <button
            className="flex-none flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md text-slate-300 border border-slate-200"
            type="button"
            aria-label="Like"
          >
            <svg width="16" height="16" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-700">Free shipping on all continental US orders.</p>
      </form>
    </div>
  )
}
