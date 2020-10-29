/* eslint-disable react/display-name */
import React from 'react'
import {Link} from 'react-router-dom'
import {SwitchRouter} from '@emp-antd/base/components/common/RouterComp'
import {SForm} from '@emp-antd/base/components/common/crud/index'
import {Card} from 'antd'

const MeComp = (props: any) => {
  return (
    <Card className="mt">
      <SForm
        name="demo"
        // form表单属性
        options={{
          size: 'small',
          layout: 'vertical',
        }}
        // from默认值
        initialValues={{
          username: 'werwrew',
        }}
        // 成功回调
        onFinish={(e: any) => {
          console.log(JSON.stringify(e))
          alert(e)
        }}
        // 失败回调
        onFinishFailed={(e: any) => {
          console.log(JSON.stringify(e))
          alert(e)
        }}
        // * from子组件(必填)
        items={[
          {
            type: 'Text',
            label: '测试',
            options: {
              className: 'test-demo',
              style: {color: 'red'},
            },
            data: 'test-demo', // text文案
          },
          {
            type: 'Input', // 组件类型
            label: 'test-input', // fromItem 名称
            name: 'username', // fromItem字段
            rules: [{required: true, message: 'Please input your username!'}], // rules
            // 子组件属性
            options: {
              placeholder: 'Basic usage',
              size: 'middle',
              suffix: '%',
            },
          },
          {
            type: 'Input.TextArea',
            label: 'test-input',
            name: 'testInput14',
            rules: [{required: true, message: 'Please input your username!'}],
            options: {
              placeholder: 'Basic usage',
              size: 'small',
              suffix: '%',
            },
          },
          {
            type: 'Input.Password',
            label: 'test-input',
            name: 'testInput12',
            options: {
              placeholder: 'Basic usage',
              size: 'small',
              suffix: '%',
            },
          },
          {
            type: 'render', // 自定义组件
            label: '',
            options: {
              disFormItem: true, //是否不被formItem包裹
            },
            render: <a>test-render</a>,
          },
          {
            type: 'Input.Search',
            label: 'test-input',
            name: 'testInput13',
            options: {
              placeholder: 'Basic usage',
              size: 'small',
              suffix: '%',
            },
          },
          {
            type: 'Upload',
            label: 'uplaod',
            name: 'uplaod',
          },
          {
            type: 'Select',
            label: 'test-input',
            name: 'testInput2',
            options: {
              placeholder: 'Basic usage',
            },
            onChange: (e: any) => {
              console.log(e)
            },
            onSelect: (e: any) => {
              console.log(e)
            },
            // select / radioGroup 子元素
            data: [
              {
                label: 'test-input',
                value: 'testInputG',
              },
              {
                label: 'test-input2',
                value: 'testInputG2',
              },
            ],
          },
          {
            type: 'Radio.Group',
            label: 'test-radio',
            name: 'testRadio3',
            onChange: (e: any) => {
              console.log(e)
            },
            data: [
              {
                label: 'test-input',
                value: 'testInputG',
              },
              {
                label: 'test-input2',
                value: 'testInputG2',
              },
            ],
          },
          {
            type: 'TimePicker',
            label: 'test-radio',
            name: 'testRadio4',
            onChange: (e: any) => {
              console.log(e)
            },
          },
          {
            type: 'RangePicker',
            label: 'test-radio',
            name: 'testRadio5',
          },
          {
            type: 'Switch',
            label: 'test-radio',
            name: 'testRadio6',
            onChange: (e: any) => {
              console.log(e)
            },
          },
          {
            type: 'Button',
            label: 'test-radio',
            name: 'testRadio7',
            // select / radioGroup 子元素
            data: [
              {
                label: 'test-input2',
                value: 'testInputG2',
                htmlType: 'submit',
              },
              {
                label: 'test-input3',
                value: 'testInputG3',
                onClick: () => {
                  alert(114444111)
                },
              },
            ],
          },
        ]}
      />
    </Card>
  )
}

export default MeComp
