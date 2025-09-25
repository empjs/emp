// 使用 empShareLib后不需要再实例化

import Vue from 'vue'
import plugin from './plugin'

plugin(Vue)
import('./bootstrap')
