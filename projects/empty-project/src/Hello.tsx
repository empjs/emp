import React, {useEffect, useState} from 'react'
import axios from 'axios'
// const lang = await axios.get('https://multi-lang-api.yy.com/multiLangBig/biugo_mobile/person/pt.json')
// console.log('lang', lang)
const HttpDemo = () => {
  const [l, setL] = useState({})
  useEffect(() => {
    ;(async () => {
      const lang = await axios.get('https://multi-lang-api.yy.com/multiLangBig/biugo_mobile/person/pt.json')
      setL(lang)
    })()
  }, [])
  return <p>http:{JSON.stringify(l)}</p>
}
const Hello = () => (
  <>
    <div>hello word!!!</div>
    <HttpDemo />
  </>
)

export default Hello
