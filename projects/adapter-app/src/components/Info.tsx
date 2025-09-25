import React from 'react'
import style from './Info.module.scss'

interface BoxProps {
  title?: string
  desc?: string
  children?: React.ReactNode
  className?: string
}

export const Box = ({title, desc, children, className = ''}: BoxProps): JSX.Element => (
  <div className={`${style.box} ${className}`}>
    {title && (
      <h1>
        {title}
        {desc && <span style={{fontWeight: 'normal', fontSize: '12px', marginLeft: '8px'}}>{desc}</span>}
      </h1>
    )}
    {children}
  </div>
)

export const ReactVersionInfo = () => (
  <span
    style={{
      position: 'absolute',
      top: '5px',
      right: '10px',
      fontSize: '10px',
      backgroundColor: '#e9f0f8',
      color: '#4a90e2',
      padding: '2px 6px',
      borderRadius: '10px',
      border: '1px solid #6ba4e5',
      fontWeight: 'normal',
    }}
  >
    React {React.version}
  </span>
)
export const ReactInfo = ({desc, children, title, className}: BoxProps): JSX.Element => (
  <Box className={`${style.reactInfo} ${className}`} title={title} desc={desc}>
    <ReactVersionInfo />
    {children && <Box>{children}</Box>}
  </Box>
)
