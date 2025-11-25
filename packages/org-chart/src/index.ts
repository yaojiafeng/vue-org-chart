import { App } from 'vue'
import OrgChart from './components/index.vue'
import './style.css'

// 导出组件
export { OrgChart }

// 导出安装函数
export function install(app: App) {
  app.component('OrgChart', OrgChart)
}

// 默认导出
export default {
  install,
  OrgChart
} as {
  install: (app: App) => void
  OrgChart: typeof OrgChart
}

// 支持全局注册
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    OrgChart: typeof OrgChart
  }
}
