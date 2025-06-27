import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'
import styles from './index.module.scss'

export function formatTime(time: number, totalTime: number) {
  if (totalTime < 1000) {
    return `${time.toFixed(0)}`
  } else {
    return `${(time / 1000).toFixed(2)}`
  }
}

const unitChat = ['ms', 'KB']
export function ProgressBar({value, max, index}: {value: number; max: number; index: number}) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const TOTAL_TIME = value * 1000
  const isMobile = window.innerWidth < 768
  const progressBarWidth = isMobile ? 80 : 50
  const variants = {
    initial: {width: 0},
    animate: {width: '100%'},
  }
  const formattedTime = formatTime(elapsedTime, TOTAL_TIME)
  return (
    <div
      className={`${styles['progress-bar-container']} flex justify-between items-center sm:pr-4`}
      style={{
        width: `${progressBarWidth}vw`,
      }}
    >
      <div
        className={`${styles['progress-bar-inner-container']} flex justify-between`}
        style={{
          width: `${(value / max) * 0.8 * progressBarWidth}vw`,
        }}
      >
        <motion.div
          className={styles['progress-bar']}
          initial="initial"
          animate="animate"
          variants={variants}
          onUpdate={(latest: {width: string}) => {
            const width = Number.parseFloat(latest.width)
            setElapsedTime((width / 100) * TOTAL_TIME)
          }}
          // 2x speed
          transition={{duration: 1, ease: 'linear'}}
        />
      </div>
      <div className={`${styles['font-mono']} text-sm sm:text-base`}>
        {formattedTime} {unitChat[index]}
      </div>
    </div>
  )
}
