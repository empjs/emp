import React, {useEffect, useState} from 'react'
import {useCrudStore} from './store'
import {Steps, Modal, Typography, Button, Card} from 'antd'
import {CrudComponent, ModalForm} from '@emp-antd/base/components/common/crud/index'
import {useObserver} from 'mobx-react-lite'
import moment from 'moment'
const {Step} = Steps
const {Title, Paragraph} = Typography
const StepsComp = (props: {step: number}) => {
  return (
    <Steps size="small" current={props.step}>
      <Step title="Finished" />
      <Step title="In Progress" />
      <Step title="Waiting" />
    </Steps>
  )
}
const CrudComp = () => {
  const crudStore = useCrudStore() // 动态注入本地url 不依赖全局
  const {page, pageSize} = crudStore
  const [visibleStep, setVisibleStep] = useState<boolean>(false)
  useEffect(() => {
    console.log('crudStore')
    ;(async () => {
      await crudStore.nextPage({page, pageSize})
    })()
  }, [crudStore, page, pageSize])
  return useObserver(() => (
    <>
      <Card className="mt">
        <Button onClick={() => setVisibleStep(true)}>test ModalForm</Button>
      </Card>

      <CrudComponent
        {...crudStore}
        page={1}
        columnsKey="_id"
        columns={[
          {
            title: '头像',
            dataIndex: 'avatarUrl',
            key: 'avatarUrl',
            render(t: any) {
              return <img src={t} width="50" height="50" />
            },
          },
          {title: 'uid', dataIndex: '_id', key: '_id'},
          {title: '姓名', dataIndex: 'nickName', key: 'nickName'},
          {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            render(t: any) {
              let info = ''
              switch (t) {
                case 1:
                  info = '男'
                  break
                case 2:
                  info = '女'
                  break
              }
              return info
            },
          },
          {title: '生日', dataIndex: 'birthday', key: 'birthday'},
          {
            title: '城市',
            dataIndex: 'province',
            key: 'province',
            render: (t: any, d: any) => `${t} ${d.city}`,
          },
          {title: '手机号码', dataIndex: 'phoneNumber', key: 'phoneNumber'},
          {title: '物流地址id', dataIndex: 'address', key: 'address'},
          {title: 'ip', dataIndex: 'ip', key: 'ip'},
          {
            title: '注册时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render(t: any) {
              return t ? moment(t).format('YYYY/MM/DD HH:mm:ss') : '-'
            },
          },
        ]}
        edit={{
          items: [
            {
              type: 'Input',
              label: 'test',
              name: '_id',
            },
            {
              type: 'Input',
              label: '搜索id',
              name: 'nickName',
            },
          ],
          action: crudStore.editAction,
        }}
        add={{
          items: [
            {
              type: 'Input',
              label: 'test',
              name: '_id',
            },
            {
              type: 'Input',
              label: '搜索id',
              name: 'nickName',
            },
          ],
          action: crudStore.addAction,
        }}
        remove={{
          items: [
            {
              type: 'Input',
              label: 'test',
              name: '_id',
            },
            {
              type: 'Input',
              label: '搜索id',
              name: 'nickName',
            },
          ],
          action: async (e: any) => {
            await setTimeout(() => {
              console.log(e)
            }, 1000)
          },
        }}
        search={{
          items: [
            {
              type: 'Input',
              label: 'test',
              name: '_id',
            },
            {
              type: 'Input',
              label: '搜索id',
              name: 'nickName',
            },
          ],
          action: crudStore.searchAction,
        }}
      />
      <ModalForm
        visible={visibleStep}
        title="系统提示"
        name="test1"
        okText="提交申请"
        onCancel={() => setVisibleStep(false)}
        onSubmit={(success: any, e: any) => {
          console.log(e)
          setVisibleStep(false)
          Modal.confirm({
            title: '是否提交签约申请',
            content: '签约后，90天内不得解约',
            okText: '确认签约',
            onOk: e => {
              console.log(e)
            },
          })
        }}
        headerRender={<StepsComp step={0} />}
        footerRender={
          <Typography>
            <Title level={4}>签约协议及说明：</Title>
            <Paragraph>1、主播每周的分成比由上周礼物收入决定。</Paragraph>
            <Paragraph>2、签约后频道分成由申请签约用户的账户中划出。</Paragraph>
          </Typography>
        }
        initialValues={{time: 1}}
        fromItems={[
          {
            type: 'text', // 组件类型
            label: '申请签约频道ID', // fromItem 名称
            name: 'sid',
            data: '32442423',
            options: {
              style: {
                color: '#F49437',
              },
            },
          },
          {
            type: 'Select', // 组件类型
            label: '签约时限', // fromItem 名称
            name: 'time', // fromItem字段
            rules: [{required: true, message: '请输入你的签约频道ID!'}], // rules
            // 子组件属性
            options: {
              placeholder: '签约频道ID',
              size: 'middle',
              // suffix: '%',
            },
            data: [
              {
                value: 1,
                label: '1年',
              },
              {
                value: 2,
                label: '2年',
              },
              {
                value: 3,
                label: '3年',
              },
            ],
          },
          {
            type: 'Input',
            label: '工会分成比例',
            name: 'fencheng',
            options: {
              addonAfter: '%',
            },
          },
          {
            type: 'Input',
            label: '主播收入分成比例',
            name: 'zhubofencheng',
            options: {
              addonAfter: '%',
            },
          },
        ]}
      />
    </>
  ))
}
export default CrudComp
