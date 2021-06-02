import * as React from 'react'
export const Random = () => (
  <span suppressHydrationWarning style={{marginLeft: '10px', color: '#CCC'}}>
    {Math.random()}
  </span>
)
