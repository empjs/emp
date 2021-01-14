declare module '@emp-antd/base/App' {
  /// <reference types="react" />
  import '@emp-antd/base/index.scss'
  import '@emp-antd/base/App.scss'
  import {RouterCompType} from '@emp-antd/base/types'
  const App: ({layout, routes, stores}: RouterCompType) => JSX.Element
  export default App
}
declare module '@emp-antd/base/bootstrap' {
  export {}
}
declare module '@emp-antd/base/components/common/BreadcrumbComp' {
  /// <reference types="react" />
  import {RoutesType} from '@emp-antd/base/types'
  export const BreadcrumbComp: ({routers}: {routers?: RoutesType[] | undefined}) => JSX.Element
}
declare module '@emp-antd/base/components/common/HeaderUserProfile' {
  import React from 'react'
  import './HeaderUserProfile.less'
  export const HeaderUserProfile: React.FunctionComponent<any>
}
declare module '@emp-antd/base/components/common/LoadingComp' {
  /// <reference types="react" />
  import './LoadingCompStyle.less'
  const LoadingComp: () => JSX.Element
  export default LoadingComp
}
declare module '@emp-antd/base/components/common/P403Comp' {
  /// <reference types="react" />
  const P403Comp: () => JSX.Element
  export default P403Comp
}
declare module '@emp-antd/base/components/common/P404Comp' {
  /// <reference types="react" />
  const P404Comp: () => JSX.Element
  export default P404Comp
}
declare module '@emp-antd/base/components/common/RouterComp' {
  /// <reference types="react" />
  import {RoutesType, RouterCompType} from '@emp-antd/base/types'
  export default function RouterComp(props: RouterCompType): JSX.Element
  export const SwitchRouter: ({routes}: {routes?: RoutesType[] | undefined}) => JSX.Element
}
declare module '@emp-antd/base/components/common/crud/CrudComponent' {
  /// <reference types="react" />
  import {PageListProps} from '@emp-antd/base/components/common/crud/PageList'
  import {SearchFormProps} from '@emp-antd/base/components/common/crud/SForm/inter'
  import {FormItemProps} from '@emp-antd/base/components/common/crud/SForm/inter'
  import {ModalFormProps} from '@emp-antd/base/components/common/crud/ModalForm'
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
  const CrudComponent: (opt: PageListProps & DataModalProps) => JSX.Element
  export default CrudComponent
}
declare module '@emp-antd/base/components/common/crud/ModalForm' {
  import React from 'react'
  import {ModalProps} from 'antd/lib/modal/Modal'
  import {FormProps, FormInstance} from 'antd/lib/form'
  import {FormItemProps} from '@emp-antd/base/components/common/crud/SForm/inter'
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
  const ModalForm: ({
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
  }: ModalFormProps) => JSX.Element
  export default ModalForm
}
declare module '@emp-antd/base/components/common/crud/PageList' {
  import React from 'react'
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
    expandable?: any
    bordered?: boolean
    tableTitle?: string
    tableTopOption?: any
    onRow?: (record: any, index: any) => any
    isMultipleChecked?: boolean
    rowSelectionOpt?: TableRowSelection<RecordType>
  }
  const PageList: ({
    tableTopOption,
    tableTitle,
    columns,
    list,
    loading,
    page,
    pageSize,
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
  }: PageListProps) => JSX.Element
  export default PageList
}
declare module '@emp-antd/base/components/common/crud/SForm/index' {
  /// <reference types="react" />
  import {SFormProps} from '@emp-antd/base/components/common/crud/SForm/inter'
  export const FromItem: ({item}: {item: any}) => any
  const SForm: ({
    options,
    dataRef,
    form,
    items,
    name,
    onFinish,
    onFinishFailed,
    initialValues,
  }: SFormProps) => JSX.Element
  export default SForm
}
declare module '@emp-antd/base/components/common/crud/SForm/inter' {
  /// <reference types="react" />
  import {ButtonProps, ButtonShape, ButtonType} from 'antd/lib/button'
  import {InputProps, GroupProps, SearchProps, TextAreaProps, PasswordProps} from 'antd/lib/input'
  import {RadioGroupProps, RadioChangeEvent} from 'antd/lib/radio/interface'
  import {UploadProps} from 'antd/lib/upload'
  import {FormProps, Rule} from 'antd/lib/form'
  import {FormInstance} from 'antd/lib/form/util'
  import {DatePickerProps} from 'antd/lib/date-picker'
  import {TimePickerProps} from 'antd/lib/time-picker'
  import {SliderProps} from 'antd/lib/slider'
  import {InputNumberProps} from 'antd/lib/input-number'
  import {SelectProps} from 'rc-select/lib/'
  const ButtonHTMLTypes: ['submit', 'button', 'reset']
  export type ButtonHTMLType = typeof ButtonHTMLTypes[number]
  export type SelectFormData = {
    value: React.ReactText
    label: React.ReactNode
    disabled?: boolean
  }
  export type RadioFormData = {
    value: React.ReactText
    label: React.ReactNode
    disabled?: boolean
  }
  export type renderForm = {
    disFormItem: boolean
  }
  export type textForm = {
    style?: any
    className: string
  }
  export type selectMultipleProps = {
    mode?: string
    defaultValue?: any
    value?: any
  }
  export interface ButtonGroupData {
    value: React.ReactText
    label: string
    options?: ButtonProps | ButtonShape | ButtonType
    onClick?: ((e: React.MouseEvent) => void) | undefined
    htmlType?: ButtonHTMLType
  }
  export type FormItemOptionsType =
    | RadioGroupProps
    | RadioGroupProps
    | InputProps
    | GroupProps
    | SearchProps
    | TextAreaProps
    | PasswordProps
    | renderForm
    | textForm
    | selectMultipleProps
    | DatePickerProps
    | TimePickerProps
    | UploadProps
    | SliderProps
    | InputNumberProps
    | SelectProps
    | undefined
  export interface FormItemProps {
    type: string
    label: string
    name?: string
    rules?: Rule[]
    render?: JSX.Element | any
    placeholder?: string
    col?: number
    options?: FormItemOptionsType
    data?: SelectFormData[] | RadioFormData[] | ButtonGroupData[] | string | number | undefined
    onChange?: ((e: RadioChangeEvent | React.MouseEvent) => void) | undefined
    onSelect?: ((e: RadioChangeEvent | React.MouseEvent) => void) | undefined
    onClick?: ((e: React.MouseEvent) => void) | undefined
  }
  export interface SFormProps {
    form?: FormInstance
    dataRef?: React.RefObject<FormInstance>
    name?: string
    options?: FormProps
    onFinish?: ((values: any) => void) | undefined
    onFinishFailed?: ((values: any) => void) | undefined
    items: FormItemProps[]
    initialValues?: any
  }
  export interface SearchFormProps extends Partial<SFormProps> {
    formItems: FormItemProps[]
  }
  export {}
}
declare module '@emp-antd/base/components/common/crud/SearchForm' {
  /// <reference types="react" />
  import {SearchFormProps} from '@emp-antd/base/components/common/crud/SForm/inter'
  const SearchForm: ({
    options,
    form,
    formItems,
    name,
    onFinish,
    onFinishFailed,
    initialValues,
    dataRef,
  }: SearchFormProps) => JSX.Element
  export default SearchForm
}
declare module '@emp-antd/base/components/common/crud/index' {
  import ModalForm from '@emp-antd/base/components/common/crud/ModalForm'
  import PageList from '@emp-antd/base/components/common/crud/PageList'
  import SearchForm from '@emp-antd/base/components/common/crud/SearchForm'
  import SForm from '@emp-antd/base/components/common/crud/SForm'
  import CrudComponent from '@emp-antd/base/components/common/crud/CrudComponent'
  import './index.scss'
  export {ModalForm, PageList, SearchForm, SForm, CrudComponent}
}
declare module '@emp-antd/base/components/layout/FixSlideLayout' {
  import React from 'react'
  import './FixSlideLayout.less'
  import {RoutesType} from '@emp-antd/base/types'
  const FixSlideLayout: ({
    children,
    routes,
  }: {
    children?: React.ReactNode
    routes?: RoutesType[] | undefined
  }) => JSX.Element
  export default FixSlideLayout
}
declare module '@emp-antd/base/components/layout/MarginLayout' {
  import React from 'react'
  import {RoutesType} from '@emp-antd/base/types'
  import './MarginLayout.less'
  type THeaderComp = {
    theme?: 'light' | 'dark' | undefined
  }
  export const HeaderComp: ({theme}: THeaderComp) => JSX.Element
  export const SideComp: () => JSX.Element
  const MarginLayout: ({
    children,
    routes,
  }: {
    children?: React.ReactNode
    routes?: RoutesType[] | undefined
  }) => JSX.Element
  export default MarginLayout
}
declare module '@emp-antd/base/helpers/envStorage' {
  const _default: {
    get(name: string): any
    set(name: string, value: any): void
    getJSON(name: string): any
    setJSON(name: string, value: any): void
    remove(name: string): void
  }
  export default _default
}
declare module '@emp-antd/base/helpers/http' {
  const http: import('axios').AxiosInstance
  export default http
}
declare module '@emp-antd/base/helpers/loadScript' {
  const loadScript: (url: string | string[]) => Promise<unknown>
  export default loadScript
}
declare module '@emp-antd/base/helpers/udb' {
  export function yyLogin(url?: string): Promise<void>
}
declare module '@emp-antd/base/helpers/useQuery' {
  /**
   * 使用方法
   * const query = useQuery()
   * query.get('lang')
   */
  export function useQuery(): URLSearchParams
}
declare module '@emp-antd/base/index' {}
declare module '@emp-antd/base/stores/common/crud' {
  interface CrudAction {
    create?: any
    update?: any
    del?: any
    request?: any
    extend?: any
  }
  export const crudStore: (crud: CrudAction) => () => any
  export const useCrudStore: (action: CrudAction) => any
  export {}
}
declare module '@emp-antd/base/stores/config' {
  import {TuserStore} from '@emp-antd/base/stores/user/userStore'
  import {StoresType} from '@emp-antd/base/types'
  export interface EmpStoreType {
    userStore: TuserStore
  }
  const stores: StoresType
  export default stores
}
declare module '@emp-antd/base/stores/index' {
  import React from 'react'
  import {StoresType} from '@emp-antd/base/types'
  type TstoreProviderProps = {
    children: React.ReactNode
    stores?: StoresType
  }
  export const StoreProvider: ({children, stores}: TstoreProviderProps) => JSX.Element
  export const useStores: () => any
  export {}
}
declare module '@emp-antd/base/stores/lang/langStore' {
  export interface LangApi {
    Req: {
      project: string
      mod: string
      lang: string
    }
    Res: JSONObject
  }
  export const langStore: () => {
    $l: JSONObject
    country: string
    getLang({project, mod, lang}: LangApi['Req']): Promise<void>
  }
  export type TlangStore = ReturnType<typeof langStore>
}
declare module '@emp-antd/base/stores/user/userStore' {
  export const userStore: () => {
    user: TgetUserInfo
    permission: string[]
    permissionIsLoad: boolean
    getUserInfo(yyuid: string | number): Promise<void>
    logout(): void
  }
  export type TuserStore = ReturnType<typeof userStore>
  export type TgetUserInfo = {
    id?: string
    permission: []
    yyuid: string
    yyno?: string
    nick?: string
    sex?: string
    birthday?: string
    province?: string
    sign?: string
    intro?: string
    jifen?: string
    register_time?: string
    passport?: string
    account?: string
    hdlogo?: string
    session_card?: string
    custom_logo?: string
  }
}
declare module '@emp-antd/base/types' {
  /// <reference types="react" />
  export interface LayoutType {
    useStores: any
    routes: RoutesType[]
    children?: React.ReactNode
    pageview?: <T>(local: T) => void
    layout?: string | 'FixSlideLayout'
  }
  export type RoutesType = {
    path: string
    component?: any
    name?: string
    url?: string
    icon?: any
    routes?: RoutesType[]
    role?: string
  }
  export interface RouterCompType {
    routes?: RoutesType[]
    layout?: () => JSX.Element
    stores?: StoresType
    pageview?: () => void
  }
  export interface StoresType {
    [key: string]: (...args: any) => any
  }
}
declare module '@emp-antd/base' {
  import main = require('@emp-antd/base/index')
  export = main
}
