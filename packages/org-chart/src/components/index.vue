<template>
  <div ref="chartContainer" class="org-chart-container">
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import './css/jquery.orgchart.css'
import './css/style.css'
// @ts-ignore
import $ from 'jquery'
// @ts-ignore
import 'orgchart'

// 类型定义
interface Props {
  // 组织结构数据源
  datasource: Record<string, any>
  // 节点内容属性名
  nodeContent?: string
  // 垂直层级
  verticalLevel?: number
  // 可见层级
  visibleLevel?: number
  // 方向 (t2b, b2t, l2r, r2l)
  direction?: string
  // 是否可拖拽
  draggable?: boolean
  pan?: boolean
  // 是否可缩放
  zoom?: boolean
  // 是否可展开/折叠
  toggleSiblingsResp?: boolean
  // 自定义样式
  chartClass?: string
}

// Props
const props = withDefaults(defineProps<Props>(), {
  nodeContent: 'title',
  verticalLevel: 4,
  visibleLevel: 4,
  direction: 't2b',
  draggable: false,
  pan: false,
  zoom: false,
  toggleSiblingsResp: false,
  chartClass: ''
})

// 模板引用
const chartContainer = ref<HTMLElement | null>(null)

// 响应式数据
const chart = ref<any>(null)

// 初始化图表
const initOrgChart = () => {
  if ($ && $.fn.orgchart && chartContainer.value) {
    const options: Record<string, any> = {
      data: props.datasource,
      nodeContent: props.nodeContent,
      verticalLevel: props.verticalLevel,
      visibleLevel: props.visibleLevel,
      direction: props.direction,
      draggable: props.draggable,
      pan: props.pan,
      zoom: props.zoom,
      toggleSiblingsResp: props.toggleSiblingsResp,
      chartClass: props.chartClass
    }
    
    // 如果启用了缩放功能，添加缩放限制配置
    if (props.zoom) {
      options.zoominLimit = 2.5  // 最大放大倍数
      options.zoomoutLimit = 0.5  // 最小缩小倍数
    }
    
    // 初始化OrgChart
    chart.value = $(chartContainer.value).orgchart(options)
  } else {
    console.error('jQuery或OrgChart插件未加载')
  }
}

// 重新绘制图表
const redraw = () => {
  if (chart.value && chartContainer.value) {
    $(chartContainer.value).empty()
    initOrgChart()
  }
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initOrgChart()
  })
})

// Watch 监听
watch(
  () => props.datasource,
  () => {
    redraw()
  },
  { deep: true }
)

watch(
  () => props.nodeContent,
  () => {
    redraw()
  }
)

watch(
  () => props.verticalLevel,
  () => {
    redraw()
  }
)

watch(
  () => props.visibleLevel,
  () => {
    redraw()
  }
)

watch(
  () => props.direction,
  () => {
    redraw()
  }
)

watch(
  () => props.draggable,
  () => {
    redraw()
  }
)

watch(
  () => props.pan,
  () => {
    redraw()
  }
)

watch(
  () => props.toggleSiblingsResp,
  () => {
    redraw()
  }
)

watch(
  () => props.chartClass,
  () => {
    redraw()
  }
)

// 生命周期 - 清理资源
onBeforeUnmount(() => {
  if (chart.value && chartContainer.value) {
    chart.value = null
    $(chartContainer.value).empty()
  }
})
</script>

<style scoped>
.org-chart-container {
  position: relative;
  width: fit-content;
  min-width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: transparent !important;
  margin: 0 auto;
}
</style> 