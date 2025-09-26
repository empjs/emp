import React from 'react'
import {Remote18App} from './adapter/React18'
import {Vue2Content, Vue2Hello, Vue2Table} from './adapter/Vue2'
import {RemoteVue3App} from './adapter/Vue3'
import {Box, ReactInfo} from './components/Info'
import {Nav} from './Nav'

// 是否为部署环境
// 将环境变量转换为布尔值
const isDeploy = !!process.env.isDeploy

const App = () => (
  <div>
    {isDeploy && <Nav />}
    {/* Vue 2 组件集成示例区域 */}
    <ReactInfo desc="以下展示了Vue 2组件在React环境中的无缝集成" title="Vue 2 Remote App">
      <ReactInfo title="Vue2 Hello组件">
        <Vue2Hello name="vue2 in React" />
      </ReactInfo>
      <ReactInfo title="Vue2 Content组件">
        <Vue2Content />
      </ReactInfo>
      <ReactInfo title="Vue2 Table组件">
        <Vue2Table />
      </ReactInfo>
    </ReactInfo>

    {/* React 18和Vue 3组件嵌套集成示例 */}
    <ReactInfo desc="EMP跨框架集成演示" title="多层次框架嵌套示例">
      <ReactInfo desc="下面展示了React 16 → React 18 → React 16的嵌套调用">
        <Remote18App>
          <ReactInfo desc="React 18环境中的React 16组件">
            <Remote18App>
              <ReactInfo desc="深度嵌套的React组件" />
            </Remote18App>
          </ReactInfo>
        </Remote18App>
      </ReactInfo>

      {/* Vue 3组件集成示例 */}
      <ReactInfo title="Vue 3组件集成" desc="Vue 3组件在React 16环境中运行">
        <RemoteVue3App name="vue3 in React 16" />
      </ReactInfo>

      {/* 多框架混合嵌套示例 */}
      <ReactInfo title="多框架混合嵌套" desc="React 16 → React 18 → Vue 3的跨框架调用链">
        <Remote18App>
          <RemoteVue3App name="vue3 in React 18" />
        </Remote18App>
      </ReactInfo>
    </ReactInfo>
  </div>
)

export default App
