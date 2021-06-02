import React, {useEffect, useState} from 'react'

export default function App(): any {
  const [url, setUrl] = useState('/')
  useEffect(() => {
    setUrl(location.href)
  }, [location.href])
  return <>hello {url}</>
}
