import React from 'react'
import {Form, Row, Col, Button, Card} from 'antd'
import {FromItem} from './SForm'
import {Rule} from 'antd/lib/form'
import {SFormProps, SearchFormProps} from './SForm/inter'
import {FormInstance} from 'antd/lib/form'

// const SearchOption = ({options}: SearchOptionProps) => <SearchForm options={options} />
const SearchForm = ({
  options = {},
  form,
  formItems,
  name = 'advanced_search',
  onFinish,
  onFinishFailed,
  initialValues,
  dataRef,
}: SearchFormProps) => {
  let formRef: React.RefObject<FormInstance> = React.createRef()
  dataRef && (formRef = dataRef)
  return (
    <Card>
      <Form
        className="ant-advanced-search-form"
        form={form}
        ref={formRef}
        {...options}
        onFinish={onFinish}
        initialValues={initialValues}
        onFinishFailed={onFinishFailed}
        name={name}>
        {
          options.layout === 'inline' ? 
          (
            <>
              {formItems.map((item, k) => (
                <FromItem key={item.name} item={item} />
              ))}
              <div style={{marginLeft: '20px'}}>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button
                  style={{marginLeft: 8}}
                  onClick={() => {
                    formRef.current?.resetFields()
                  }}>
                  清空
                </Button>
              </div>
            </>
          )
          :
          (
            <>
              <Row gutter={24}>
                {formItems.map((item, k) => (
                  <Col span={item.col ? item.col : 4} key={k}>
                    <FromItem key={item.name} item={item} />
                  </Col>
                ))}
              </Row>
              <Row>
                <Col span={24} style={{textAlign: 'right'}}>
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                  <Button
                    style={{marginLeft: 8}}
                    onClick={() => {
                      formRef.current?.resetFields()
                    }}>
                    清空
                  </Button>
                </Col>
              </Row>
              </>
            )
          }
      </Form>
    </Card>
  )
}
export default SearchForm
