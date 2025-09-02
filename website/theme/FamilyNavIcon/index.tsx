import {navConfig as res} from '@config'
import {Popover} from 'antd'
import {useEffect, useState} from 'react'
import {PopoverContent} from './components/PopoverContent'
import style from './index.module.scss'
// import navConfig from './nav-config.json';
import {getLang, type Lang, type NavConfig} from './utils'
export interface FamilyNavIconProps {
  lang?: Lang
  trigger?: 'hover' | 'focus' | 'click'
}

export const FamilyNavIcon = (props: FamilyNavIconProps = {}) => {
  const [configData, setConfigData] = useState<NavConfig>({} as NavConfig)
  const lang = props.lang || getLang()
  useEffect(() => {
    // ;(async () => {
    // const res = await fetch('https://unpkg.com/webupload/official/data/nav-config.json').then(res => res.json())
    setConfigData(res)
    // })()
  }, [])
  return (
    <div className={style.root}>
      <Popover
        arrow={false}
        trigger="hover"
        placement="bottomLeft"
        content={<PopoverContent lang={lang} config={configData} />}
      >
        <div className={style.wrapper}>
          <svg width="20" height="20" fill="none">
            <title>logo</title>
            <path
              d="M2.5 5H5V2.5H2.5V5zM5 11.25H2.5v-2.5H5v2.5zm12.5 0H15v-2.5h2.5v2.5zm-8.75 0h2.5v-2.5h-2.5v2.5zM5 17.5H2.5V15H5v2.5zm10 0h2.5V15H15v2.5zm-3.75 0h-2.5V15h2.5v2.5zM17.5 5H15V2.5h2.5V5zM8.75 5h2.5V2.5h-2.5V5z"
              fill="currentColor"
            />
          </svg>
        </div>
      </Popover>
    </div>
  )
}
