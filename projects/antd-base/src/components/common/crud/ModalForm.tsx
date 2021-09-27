import React from 'react'
import {Form, Modal} from 'antd'
import {ModalProps} from 'antd/lib/modal/Modal'
import {FormProps, FormInstance} from 'antd/lib/form'
import {SForm} from 'src/components/common/crud'
import {FormItemProps} from './SForm/inter'
export interface ModalFormProps extends ModalProps {
  visible?: boolean
  title?: string
  name: string
  formOptions?: FormProps
  initialValues?: any
  fromItems: FormItemProps[]
  options?: ModalProps
  okText?: string
  cancelText?: string
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
  onSubmit?: (success: boolean, e: any) => void
  headerRender?: JSX.Element
  footerRender?: JSX.Element
  forceRender?: boolean
  form?: FormInstance
  dataRef?: React.RefObject<FormInstance>
}
const ModalForm = ({
  options,
  initialValues,
  visible,
  title,
  onCancel,
  onSubmit,
  headerRender,
  footerRender,
  formOptions,
  name,
  fromItems,
  forceRender,
  destroyOnClose,
  okText,
  cancelText,
  dataRef,
  form,
}: ModalFormProps) => {
  let formRef: React.RefObject<FormInstance> = React.createRef()
  dataRef && (formRef = dataRef)
  const onOk = () => {
    formRef.current
      ?.validateFields()
      .then(values => {
        onSubmit && onSubmit(true, values)
      })
      .catch(info => {
        onSubmit && onSubmit(false, info.errorFields)
      })
  }
  forceRender = forceRender || false
  return (
    <>
      <Modal
        {...options}
        style={{marginTop: 200}}
        forceRender={forceRender}
        destroyOnClose={destroyOnClose}
        visible={visible}
        title={title}
        onOk={onOk}
        onCancel={onCancel}
        okText={okText}
        cancelText={cancelText}
      >
        {headerRender ? (
          <div className="modal-form-header" style={{marginBottom: '20px'}}>
            {headerRender}
          </div>
        ) : null}
        <div className="content-form" style={{overflowY: 'auto'}}>
          <SForm
            dataRef={formRef}
            {...formOptions}
            initialValues={initialValues}
            name={name}
            form={form}
            items={fromItems}
          />
        </div>
        {footerRender ? (
          <div className="modal-form-footer" style={{marginTop: '20px'}}>
            {footerRender}
          </div>
        ) : null}
      </Modal>
    </>
  )
}

export default ModalForm
