import { App } from 'vue'
import OrgChart from './components/OrgChart.vue'
import type { OrgChartProps, OrgChartNode } from './types'
import './style.css'

// 导出组件
export { OrgChart }
export type { OrgChartProps, OrgChartNode }

// 导出安装函数
export function install(app: App) {
  app.component('OrgChart', OrgChart)
}

// 默认导出
export default {
  install,
  OrgChart
}

// 支持全局注册
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    OrgChart: typeof OrgChart
  }
}
