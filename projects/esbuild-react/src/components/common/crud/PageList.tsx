import React from 'react'
import {Table, Card} from 'antd'
import {ColumnsType} from 'antd/lib/table'
import {TableRowSelection} from 'antd/lib/table/interface'
import './PageList.scss'
export type RecordType = {
  title: string
  dataIndex: string
  key: string
  render: (t: string | number | undefined, d: any) => void
  onCell: (record: any, rowIndex: any) => any
  sorter: any
  align: 'center'
}
export interface PageListProps {
  list: any
  loading?: boolean
  page: number | string
  pageSize: number | string
  count: number
  columnsKey: string
  columns: ColumnsType<RecordType>
  nextPage: (d: JSONObject) => void
  selectRow?: React.ReactText[]
  onSelectChange?: ((selectedRowKeys: React.ReactText[], selectedRows?: RecordType[]) => void) | undefined
  expandable?: object
  bordered?: boolean
  tableTitle?: string
  tableTopOption?: any
  onRow?: (record: any, index: any) => any
  isMultipleChecked?: boolean
  rowSelectionOpt?: TableRowSelection<RecordType>
}
const TableTools = ({tableTitle = '', tableTopOption}: any) => {
  return (
    <div className="table-tool-bar">
      <div className="table-toolbar-title">{tableTitle}</div>
      <div className="table-toolbar-option">
        {typeof tableTopOption === 'function' ? tableTopOption() : tableTopOption}
      </div>
    </div>
  )
}
const PageList = ({
  tableTopOption,
  tableTitle,
  columns,
  list,
  loading,
  page = 1,
  pageSize = 20,
  count,
  nextPage,
  columnsKey,
  selectRow,
  onSelectChange,
  expandable,
  bordered,
  onRow,
  isMultipleChecked,
  rowSelectionOpt,
}: PageListProps) => {
  selectRow = selectRow || []
  loading = loading || false
  const rowSelection =
    selectRow && onSelectChange && isMultipleChecked
      ? {
          ...rowSelectionOpt,
          selectedRowKeys: selectRow,
          onChange: (selectedRowKeys: React.ReactText[], selectedRows?: RecordType[]) => onSelectChange && onSelectChange(selectedRowKeys, selectedRows),
          fixed: true,
        }
      : undefined
  page = typeof page === 'string' ? parseInt(page) : page
  pageSize = typeof pageSize === 'string' ? parseInt(pageSize) : pageSize
  return (
    <Card className="page-list card-wrap mt">
      {(tableTitle || tableTopOption) && <TableTools tableTitle={tableTitle} tableTopOption={tableTopOption} />}
      <Table
        bordered={bordered}
        rowSelection={rowSelection}
        loading={loading}
        dataSource={list}
        columns={columns}
        scroll={{x: true}}
        expandable={expandable}
        rowKey={(record: any) => record[columnsKey]}
        onRow={onRow}
        pagination={{
          total: count,
          pageSize,
          current: page,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '50'],
          showTotal(total) {
            return `共 ${total} 条`
          },
          onChange: (page, pageSize) => {
            pageSize = pageSize || 20
            nextPage({page, pageSize})
          },
          onShowSizeChange(page, pageSize) {
            nextPage({page: 1, pageSize})
          },
        }}
        className="list"
      />
    </Card>
  )
}

export default PageList
