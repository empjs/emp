import React, {useEffect, Component, useState} from 'react'
import {useCrudStore} from '@emp-antd/base/stores/common/crud'
import {CrudComponent} from '@emp-antd/base/components/common/crud/index'
import {useObserver} from 'mobx-react-lite'
import http from 'src/helpers/http'
import moment from 'moment'
import {Collapse} from 'antd'
const {Panel} = Collapse
const TableComp = () => {
  const crudStore = useCrudStore({
    // create: (d: any) => API.mgr.createAppTable.request({}, d),
    // update: (d: any) => API.mgr.updateTable.request({}, d),
    request: async (d: any) => {
      const data = await http.get(
        `https://api.teddy.hibeetle.com/admin/wxapp_member?pageSize=${d.pageSize}&page=${d.pageIndex}`,
      )
      return {data}
    },
    extend: {
      testModal: false,
      setTestModal(val: boolean) {
        this.testModal = val
      },
    },
  })
  const {page, pageSize} = crudStore
  useEffect(() => {
    ;(async () => {
      await crudStore.nextPage({
        page,
        pageSize,
        opt: {
          appid: 'push_test',
          // table: '',
          reload: true,
        },
      })
    })()
  })
  return useObserver(() => (
    <>
      <CrudComponent
        {...crudStore}
        columnsKey={'table'}
        columns={[
          {
            title: '头像',
            dataIndex: 'avatarUrl',
            key: 'avatarUrl',
            render(t: string | undefined) {
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
            render(t: moment.MomentInput) {
              return t ? moment(t).format('YYYY/MM/DD HH:mm:ss') : '-'
            },
          },
        ]}
        search={{
          options: {layout: 'inline'},
          items: [
            {
              type: 'Input',
              label: 'table',
              name: 'table',
              // rules: [{required: true, message: '请输入你要修改的table值'}],
            },
          ],
          action: async (e: {table: any}) => {
            await crudStore.nextPage({
              page,
              pageSize,
              opt: {
                appid: 'push_test',
                table: e.table,
                reload: true,
              },
            })
          },
        }}
        add={{
          title: '创建表实例',
          items: [
            {
              type: 'Input',
              label: '主键',
              name: 'pk',
            },
            {
              type: 'Input',
              label: '表实例',
              name: 'table',
            },
            {
              type: 'Input',
              label: '表描述',
              name: 'tableDesc',
            },
          ],
          action: (e: any) =>
            crudStore.addItem({
              ...e,
              appid: 'push_test',
            }),
        }}
        edit={{
          title: '修改表实例',
          items: [
            {
              type: 'Input',
              label: '表描述',
              name: 'desc',
            },
          ],
          action: crudStore.updateItem,
        }}
        actions={[
          {
            name: '查看表字段',
            action: (e: any) => {
              console.log(e)
            },
          },
        ]}
        remove={{
          items: [
            {
              type: 'Text',
              label: '',
              data: '确定删除此数据？',
            },
          ],
        }}
      />
    </>
  ))
}

export default TableComp
