import React from 'react'
import {AllObserverCounter, AllObserverCounter2, AllObserverCounter3, GlobalStoreComp} from './counterComp'
import {Card} from 'antd'

const AboutComp = () => {
  return (
    <Card className="mt">
      <div>
        <h1>about components!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</h1>
        <h2>独立Store</h2>
        <AllObserverCounter />
        <AllObserverCounter2 />
        <AllObserverCounter3 />
        <h2>共享Store</h2>
        <GlobalStoreComp />
      </div>
    </Card>
  )
}

export default AboutComp
