import {ProgressBar} from '../Benchmark/ProgressBar'

export const ProgressItem = ({name, max, value}: any) => {
  return (
    <div className="flex flex-center justify-start m-4 flex-col sm:flex-row">
      <>
        <p className="mr-2 mb-2 sm:w-20 w-auto text-center text-gray-500 dark:text-light-500">{name}</p>
        <ProgressBar value={value} max={max} />
      </>
    </div>
  )
}
const SassModern = () => {
  return (
    <div className="flex flex-col items-center my-4 z-1">
      <h2 className="font-bold text-xl sm:text-4xl md:text-2xl">基于 Modern Mode 构建提升 46.7%</h2>
      <p>项目总时长提效、sass 构建提升10x以上</p>
      <ProgressItem name="Modern Mode" value={7.57} max={14.2} />
      <ProgressItem name="Default Mode" value={14.2} max={14.2} />
    </div>
  )
}
export default SassModern
