import React, {useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useStores} from '@emp-antd/base/stores/index'
import {StoreTypes} from 'src/types/stores'
import {observer} from 'mobx-react-lite'
//

import {Steps, Card} from 'antd'
// import {UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined} from '@ant-design/icons'

const {Step} = Steps
const StepComp = () => (
  <Steps current={1}>
    <Step title="Finished" description="This is a description." />
    <Step title="In Progress" subTitle="Left 00:00:08" description="This is a description." />
    <Step title="Waiting" description="This is a description." />
  </Steps>
)

const LangComp = observer(() => {
  const {langStore}: StoreTypes = useStores() // 引入类型判断

  const {$l} = langStore
  const {lang}: any = useParams()
  console.log('langStore', JSON.stringify($l), lang)

  useEffect(() => {
    if (lang && lang !== langStore.country) {
      ;(async () => await langStore.getLang({project: 'biugo_mobile', mod: 'person', lang: lang}))()
    }
  }, [lang, langStore])
  return (
    <>
      <Card className="mt">
        <StepComp />
      </Card>
      <Card className="mt">
        <Link to="/lang/en">en</Link> | <Link to="/lang/pt">pt</Link>
        <h2>ME Components!!!</h2>
        <div>
          langStore.$l:
          <div>{JSON.stringify($l)}</div>
        </div>
      </Card>
    </>
  )
})

export default LangComp
