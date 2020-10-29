import React, {useState} from 'react'
import {PageList, SearchForm, ModalForm} from '.'
import {PageListProps} from './PageList'
import {SearchFormProps} from './SForm/inter'
import {FormItemProps} from './SForm/inter'
import {ModalFormProps} from './ModalForm'
import {Button, Menu, Dropdown, Space} from 'antd'
import {EditOutlined, DeleteOutlined, UnorderedListOutlined} from '@ant-design/icons'
export interface DataModalProps {
  add?: ActionProps
  remove?: ActionProps
  edit?: ActionProps
  search?: SearchActionProps
  actions?: MoreActionProps[]
}
export interface MoreActionProps {
  name: string
  action?: (e: any) => any
  isShow?: (e: any) => boolean
}
export interface SearchActionProps extends Partial<SearchFormProps> {
  items: FormItemProps[]
  action?: (e: any) => any
}
export interface ActionProps extends Partial<ModalFormProps> {
  title?: string
  items: FormItemProps[]
  action?: (e: any) => any
  clickAction?: (e?: any) => any
}
const CrudComponent = (opt: PageListProps & DataModalProps) => {
  const [addModalInfo, setAddModalInfo] = useState({
    item: {},
    show: false,
  })
  const [editModalInfo, setEditModalInfo] = useState({
    item: {},
    show: false,
  })
  const [removeModalInfo, setRemoveModalInfo] = useState({
    item: {},
    show: false,
  })
  const actions: MoreActionProps[] = []
  opt.edit &&
    actions.push({
      ...opt.edit,
      name: '编辑',
    })
  opt.remove &&
    actions.push({
      ...opt.remove,
      name: '删除',
    })
  opt.actions && opt.actions?.length > 0 && actions.push(...opt.actions)
  !opt.columns.some(column => column.key === '_control') &&
    actions.length > 0 &&
    opt.columns.push({
      title: '操作',
      key: '_control',
      render(record: any) {
        return (
          <Space>
            {opt.edit ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={async () => {
                  await (opt.edit?.clickAction && opt.edit.clickAction(record))
                  setEditModalInfo({
                    item: record,
                    show: true,
                  })
                }}></Button>
            ) : null}
            {opt.remove ? (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await (opt.remove?.clickAction && opt.remove.clickAction(record))
                  setRemoveModalInfo({
                    item: record,
                    show: true,
                  })
                }}></Button>
            ) : null}
            {opt.actions && opt.actions.some(e => !e.isShow || e.isShow(record)) ? (
              <Dropdown
                overlay={
                  <Menu>
                    {opt.actions.map((item, index) => {
                      return typeof item.isShow == 'undefined' || item.isShow(record) ? (
                        <Menu.Item key={index}>
                          <Button type="link" onClick={() => item.action && item.action(record)}>
                            {item.name}
                          </Button>
                        </Menu.Item>
                      ) : null
                    })}
                  </Menu>
                }>
                <Button type="primary" icon={<UnorderedListOutlined />}></Button>
              </Dropdown>
            ) : null}
          </Space>
        )
      },
    })
  return (
    <>
      {opt.search ? <SearchForm {...opt.search} formItems={opt.search.items} onFinish={opt.search.action} /> : null}
      <PageList
        {...opt}
        tableTopOption={
          opt.add ? (
            <Button
              type="primary"
              onClick={async () => {
                await (opt.add?.clickAction && opt.add.clickAction())
                setAddModalInfo({
                  item: {},
                  show: true,
                })
              }}>
              新增
            </Button>
          ) : null
        }
      />
      {opt.add ? (
        <ModalForm
          {...opt.add}
          title={opt.add.title}
          name="addModal"
          fromItems={opt.add.items}
          visible={addModalInfo.show}
          onSubmit={async (success: boolean, e: any) => {
            if (success) {
              await (opt.add?.action && opt.add.action({...addModalInfo.item, ...e}))
              setAddModalInfo({
                item: {},
                show: false,
              })
            }
          }}
          onCancel={async e => {
            await (opt.add?.onCancel && opt.add.onCancel(e))
            setAddModalInfo({
              item: {},
              show: false,
            })
          }}
        />
      ) : null}
      {opt.edit ? (
        <ModalForm
          name="editModal"
          {...opt.edit}
          title={opt.edit.title}
          fromItems={opt.edit.items}
          initialValues={editModalInfo.item}
          visible={editModalInfo.show}
          onSubmit={async (success: boolean, e: any) => {
            if (success) {
              await (opt.edit?.action && opt.edit.action({...editModalInfo.item, ...e}))
              setEditModalInfo({
                item: {},
                show: false,
              })
            }
          }}
          onCancel={async e => {
            await (opt.edit?.onCancel && opt.edit.onCancel(e))
            setEditModalInfo({
              item: {},
              show: false,
            })
          }}
        />
      ) : null}
      {opt.remove ? (
        <ModalForm
          name="removeModal"
          {...opt.remove}
          title={opt.remove.title}
          fromItems={opt.remove.items}
          visible={removeModalInfo.show}
          onSubmit={async (success: boolean, e: any) => {
            if (success) {
              await (opt.remove?.action && opt.remove.action({...removeModalInfo.item, ...e}))
              setRemoveModalInfo({
                item: {},
                show: false,
              })
            }
          }}
          onCancel={async e => {
            await (opt.remove?.onCancel && opt.remove.onCancel(e))
            setRemoveModalInfo({
              item: {},
              show: false,
            })
          }}
        />
      ) : null}
    </>
  )
}
export default CrudComponent
