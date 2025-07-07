export const GridFlow = () => {
  return (
    <div className="flex flex-col">
      {/* 创建3行 */}
      {Array.from({length: 3}).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {/* 每行3列 */}
          {Array.from({length: 3}).map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex
            return (
              <div
                className="m-2 bg-purple-500 rounded-md h-12 flex items-center justify-center text-white text-2xl font-extrabold flex-1"
                key={index}
              >
                {index}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
