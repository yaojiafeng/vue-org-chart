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

// 事件定义
const emit = defineEmits<{
  nodedrop: [draggedNode: any, dragZone: any, dropZone: any]
  init: [chart: any]
  'show-parent': []
  'hide-parent': []
  'show-children': []
  'hide-children': []
  'show-siblings': []
  'hide-siblings': []
}>()

// 类型定义
interface Icons {
  theme?: string
  parentNode?: string
  expandToUp?: string
  collapseToDown?: string
  collapseToLeft?: string
  expandToRight?: string
  collapsed?: string
  expanded?: string
}

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
  // 放大限制
  zoominLimit?: number
  // 缩小限制
  zoomoutLimit?: number
  // 是否可展开/折叠
  toggleSiblingsResp?: boolean
  // 自定义样式
  chartClass?: string
  // 节点标题属性名
  nodeTitle?: string
  // 父节点图标
  parentNodeSymbol?: string
  // 节点ID属性名
  nodeId?: string
  // 节点模板函数
  nodeTemplate?: (data: Record<string, any>) => string
  // 创建节点回调函数
  createNode?: ($node: any, data: Record<string, any>) => void
  // 是否显示导出按钮
  exportButton?: boolean
  // 导出按钮名称
  exportButtonName?: string
  // 导出文件名
  exportFilename?: string
  // 导出文件扩展名
  exportFileextension?: 'png' | 'pdf'
  // 拖拽放置条件函数
  dropCriteria?: (draggedNode: any, dragZone: any, dropZone: any) => boolean
  // 初始化完成回调函数
  initCompleted?: ($chart: any) => void
  // 图标配置
  icons?: Icons
  // 紧凑模式判断函数
  compact?: (data: Record<string, any>) => boolean
}

// Props
const props = withDefaults(defineProps<Props>(), {
  nodeContent: '',
  verticalLevel: undefined,
  visibleLevel: 999,
  direction: 't2b',
  draggable: false,
  pan: false,
  zoom: false,
  zoominLimit: 7,
  zoomoutLimit: 0.5,
  toggleSiblingsResp: false,
  chartClass: '',
  nodeTitle: 'name',
  parentNodeSymbol: 'oci-menu',
  nodeId: 'id',
  exportButton: false,
  exportButtonName: 'Export',
  exportFilename: 'Orgchart',
  exportFileextension: 'png'
})

// 模板引用
const chartContainer = ref<HTMLElement | null>(null)

// 响应式数据
const chart = ref<any>(null)

// 绑定事件监听器
const bindEvents = () => {
  if (!chartContainer.value) return
  
  const $container = $(chartContainer.value)
  
  // 节点拖放事件
  $container.off('nodedrop.orgchart').on('nodedrop.orgchart', (_event: any, draggedNode: any, dragZone: any, dropZone: any) => {
    emit('nodedrop', draggedNode, dragZone, dropZone)
  })
  
  // 初始化完成事件
  $container.off('init.orgchart').on('init.orgchart', (_event: any, chart: any) => {
    emit('init', chart)
  })
  
  // 显示/隐藏相关节点事件
  $container.off('show-parent.orgchart').on('show-parent.orgchart', () => {
    emit('show-parent')
  })
  
  $container.off('hide-parent.orgchart').on('hide-parent.orgchart', () => {
    emit('hide-parent')
  })
  
  $container.off('show-children.orgchart').on('show-children.orgchart', () => {
    emit('show-children')
  })
  
  $container.off('hide-children.orgchart').on('hide-children.orgchart', () => {
    emit('hide-children')
  })
  
  $container.off('show-siblings.orgchart').on('show-siblings.orgchart', () => {
    emit('show-siblings')
  })
  
  $container.off('hide-siblings.orgchart').on('hide-siblings.orgchart', () => {
    emit('hide-siblings')
  })
}

// 初始化图表
const initOrgChart = (newOptions?: Record<string, any>) => {
  if ($ && $.fn.orgchart && chartContainer.value) {
    const options: Record<string, any> = newOptions || {
      data: props.datasource,
      nodeContent: props.nodeContent,
      verticalLevel: props.verticalLevel,
      visibleLevel: props.visibleLevel,
      direction: props.direction,
      draggable: props.draggable,
      pan: props.pan,
      zoom: props.zoom,
      zoominLimit: props.zoominLimit,
      zoomoutLimit: props.zoomoutLimit,
      toggleSiblingsResp: props.toggleSiblingsResp,
      chartClass: props.chartClass,
      nodeTitle: props.nodeTitle,
      parentNodeSymbol: props.parentNodeSymbol,
      nodeId: props.nodeId,
      exportButton: props.exportButton,
      exportButtonName: props.exportButtonName,
      exportFilename: props.exportFilename,
      exportFileextension: props.exportFileextension
    }
    
    // 如果没有传入新选项，使用 props 的值
    if (!newOptions) {
      // 添加函数类型的选项（仅在提供时添加）
      if (props.nodeTemplate) {
        options.nodeTemplate = props.nodeTemplate
      }
      if (props.createNode) {
        options.createNode = props.createNode
      }
      if (props.dropCriteria) {
        options.dropCriteria = props.dropCriteria
      }
      if (props.initCompleted) {
        options.initCompleted = props.initCompleted
      }
      if (props.icons) {
        options.icons = props.icons
      }
      if (props.compact) {
        options.compact = props.compact
      }
    }
    
    // 初始化OrgChart
    chart.value = $(chartContainer.value).orgchart(options)
    
    // 绑定事件
    bindEvents()
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

watch(
  () => props.zoom,
  () => {
    redraw()
  }
)

watch(
  () => props.zoominLimit,
  () => {
    redraw()
  }
)

watch(
  () => props.zoomoutLimit,
  () => {
    redraw()
  }
)

watch(
  () => props.nodeTitle,
  () => {
    redraw()
  }
)

watch(
  () => props.parentNodeSymbol,
  () => {
    redraw()
  }
)

watch(
  () => props.nodeId,
  () => {
    redraw()
  }
)

watch(
  () => props.exportButton,
  () => {
    redraw()
  }
)

watch(
  () => props.exportButtonName,
  () => {
    redraw()
  }
)

watch(
  () => props.exportFilename,
  () => {
    redraw()
  }
)

watch(
  () => props.exportFileextension,
  () => {
    redraw()
  }
)

watch(
  () => props.icons,
  () => {
    redraw()
  },
  { deep: true }
)

watch(
  () => props.nodeTemplate,
  () => {
    redraw()
  }
)

watch(
  () => props.createNode,
  () => {
    redraw()
  }
)

watch(
  () => props.dropCriteria,
  () => {
    redraw()
  }
)

watch(
  () => props.compact,
  () => {
    redraw()
  }
)

watch(
  () => props.initCompleted,
  () => {
    redraw()
  }
)

// ========== 方法实现 ==========

/**
 * 重新初始化或刷新 orgchart
 * @param newOptions 新的配置选项
 */
const init = (newOptions?: Record<string, any>) => {
  if (chart.value && chartContainer.value) {
    $(chartContainer.value).empty()
    initOrgChart(newOptions)
  }
}

/**
 * 添加祖先节点
 * @param data 祖先节点的数据源
 * @param parentId 父节点ID
 */
const addAncestors = (data: Record<string, any>, parentId: string) => {
  if (chart.value && chart.value.addAncestors) {
    return chart.value.addAncestors(data, parentId)
  }
}

/**
 * 添加后代节点
 * @param data 后代节点的数据源数组
 * @param $parent 父节点的 jQuery 对象
 */
const addDescendants = (data: Record<string, any>[], $parent: any) => {
  if (chart.value && chart.value.addDescendants) {
    return chart.value.addDescendants(data, $parent)
  }
}

/**
 * 添加父节点（根节点）
 * @param data 父节点的数据源
 */
const addParent = (data: Record<string, any>) => {
  if (chart.value && chart.value.addParent) {
    return chart.value.addParent(data)
  }
}

/**
 * 添加兄弟节点
 * @param $node 目标节点的 jQuery 对象
 * @param data 兄弟节点的数据源数组
 */
const addSiblings = ($node: any, data: Record<string, any>[]) => {
  if (chart.value && chart.value.addSiblings) {
    return chart.value.addSiblings($node, data)
  }
}

/**
 * 添加子节点
 * @param $node 父节点的 jQuery 对象
 * @param data 子节点的数据源数组
 */
const addChildren = ($node: any, data: Record<string, any>[]) => {
  if (chart.value && chart.value.addChildren) {
    return chart.value.addChildren($node, data)
  }
}

/**
 * 移除节点及其所有后代节点
 * @param $node 要移除的节点的 jQuery 对象
 */
const removeNodes = ($node: any) => {
  if (chart.value && chart.value.removeNodes) {
    return chart.value.removeNodes($node)
  }
}

/**
 * 获取组织结构的层级关系
 * @param includeNodeData 是否包含节点数据，默认为 false
 */
const getHierarchy = (includeNodeData: boolean = false) => {
  if (chart.value && chart.value.getHierarchy) {
    return chart.value.getHierarchy(includeNodeData)
  }
  return null
}

/**
 * 隐藏父节点
 * @param $node 目标节点的 jQuery 对象
 */
const hideParent = ($node: any) => {
  if (chart.value && chart.value.hideParent) {
    return chart.value.hideParent($node)
  }
}

/**
 * 显示父节点
 * @param $node 目标节点的 jQuery 对象
 */
const showParent = ($node: any) => {
  if (chart.value && chart.value.showParent) {
    return chart.value.showParent($node)
  }
}

/**
 * 隐藏子节点
 * @param $node 目标节点的 jQuery 对象
 */
const hideChildren = ($node: any) => {
  if (chart.value && chart.value.hideChildren) {
    return chart.value.hideChildren($node)
  }
}

/**
 * 显示子节点
 * @param $node 目标节点的 jQuery 对象
 */
const showChildren = ($node: any) => {
  if (chart.value && chart.value.showChildren) {
    return chart.value.showChildren($node)
  }
}

/**
 * 隐藏兄弟节点
 * @param $node 目标节点的 jQuery 对象
 * @param direction 方向：'left' | 'right'，不传则隐藏所有兄弟节点
 */
const hideSiblings = ($node: any, direction?: 'left' | 'right') => {
  if (chart.value && chart.value.hideSiblings) {
    return chart.value.hideSiblings($node, direction)
  }
}

/**
 * 显示兄弟节点
 * @param $node 目标节点的 jQuery 对象
 * @param direction 方向：'left' | 'right'，不传则显示所有兄弟节点
 */
const showSiblings = ($node: any, direction?: 'left' | 'right') => {
  if (chart.value && chart.value.showSiblings) {
    return chart.value.showSiblings($node, direction)
  }
}

/**
 * 获取节点状态
 * @param $node 目标节点的 jQuery 对象
 * @param relation 关系类型：'parent' | 'children' | 'siblings'
 * @returns 返回状态对象 { exist: boolean, visible: boolean }
 */
const getNodeState = ($node: any, relation: 'parent' | 'children' | 'siblings') => {
  if (chart.value && chart.value.getNodeState) {
    return chart.value.getNodeState($node, relation)
  }
  return { exist: false, visible: false }
}

/**
 * 获取相关节点
 * @param $node 目标节点的 jQuery 对象
 * @param relation 关系类型：'parent' | 'children' | 'siblings'
 */
const getRelatedNodes = ($node: any, relation: 'parent' | 'children' | 'siblings') => {
  if (chart.value && chart.value.getRelatedNodes) {
    return chart.value.getRelatedNodes($node, relation)
  }
  return null
}

/**
 * 获取父节点
 * @param $node 目标节点的 jQuery 对象
 */
const getParent = ($node: any) => {
  if (chart.value && chart.value.getParent) {
    return chart.value.getParent($node)
  }
  return null
}

/**
 * 获取兄弟节点
 * @param $node 目标节点的 jQuery 对象
 */
const getSiblings = ($node: any) => {
  if (chart.value && chart.value.getSiblings) {
    return chart.value.getSiblings($node)
  }
  return null
}

/**
 * 获取子节点
 * @param $node 目标节点的 jQuery 对象
 */
const getChildren = ($node: any) => {
  if (chart.value && chart.value.getChildren) {
    return chart.value.getChildren($node)
  }
  return null
}

/**
 * 设置图表缩放
 * @param $chart 图表的 jQuery 对象
 * @param newScale 新的缩放比例（正浮点数）
 */
const setChartScale = ($chart: any, newScale: number) => {
  if (chart.value && chart.value.setChartScale) {
    return chart.value.setChartScale($chart, newScale)
  }
}

/**
 * 导出图表
 * @param exportFilename 导出文件名，默认为 'OrgChart'
 * @param exportFileextension 导出文件扩展名，默认为 'png'，可选 'png' | 'pdf'
 */
const exportChart = (exportFilename: string = 'OrgChart', exportFileextension: 'png' | 'pdf' = 'png') => {
  if (chart.value && chart.value.export) {
    return chart.value.export(exportFilename, exportFileextension)
  }
}

/**
 * 获取图表实例
 */
const getChartInstance = () => {
  return chart.value
}

// 暴露方法供外部调用
defineExpose({
  init,
  addAncestors,
  addDescendants,
  addParent,
  addSiblings,
  addChildren,
  removeNodes,
  getHierarchy,
  hideParent,
  showParent,
  hideChildren,
  showChildren,
  hideSiblings,
  showSiblings,
  getNodeState,
  getRelatedNodes,
  getParent,
  getSiblings,
  getChildren,
  setChartScale,
  export: exportChart,
  getChartInstance
})

// 移除事件监听器
const unbindEvents = () => {
  if (!chartContainer.value) return
  
  const $container = $(chartContainer.value)
  $container.off('nodedrop.orgchart')
  $container.off('init.orgchart')
  $container.off('show-parent.orgchart')
  $container.off('hide-parent.orgchart')
  $container.off('show-children.orgchart')
  $container.off('hide-children.orgchart')
  $container.off('show-siblings.orgchart')
  $container.off('hide-siblings.orgchart')
}

// 生命周期 - 清理资源
onBeforeUnmount(() => {
  unbindEvents()
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