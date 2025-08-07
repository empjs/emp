// 颜色项组件
interface ColorItemProps {
  colorClass: string
  label: string
}

const ColorItem = ({colorClass, label}: ColorItemProps) => (
  <div className="flex flex-col items-center">
    <div className={colorClass}></div>
    <p className="text-center font-mono text-xs text-gray-600 dark:text-gray-400">{label}</p>
  </div>
)

// 颜色数据配置
const colorData = [
  {colorClass: 'bg-sky-50', label: '50'},
  {colorClass: 'bg-sky-100', label: '100'},
  {colorClass: 'bg-sky-200', label: '200'},
  {colorClass: 'bg-sky-300', label: '300'},
  {colorClass: 'bg-sky-400', label: '400'},
  {colorClass: 'bg-sky-500', label: '500'},
  {colorClass: 'bg-sky-600', label: '600'},
  {colorClass: 'bg-sky-700', label: '700'},
  {colorClass: 'bg-sky-800', label: '800'},
  {colorClass: 'bg-sky-900', label: '900'},
  {colorClass: 'bg-sky-950', label: '950'},
]

export const Color = () => (
  <div className="tailwindcss-host">
    <h1 className="p-5 font-bold ">Color</h1>
    <div className="flex mx-auto max-w-lg grid-cols-1 gap-3 *:*:first:size-9 *:*:first:rounded-md *:*:first:inset-ring *:*:first:inset-ring-black/5 sm:grid-cols-11 sm:flex-row sm:*:*:first:aspect-square sm:*:*:first:w-full">
      {colorData.map((color, index) => (
        <ColorItem key={index} colorClass={color.colorClass} label={color.label} />
      ))}
    </div>
  </div>
)

export default Color
