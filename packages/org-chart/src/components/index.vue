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

// 标准布局方向
type StandardDirection = 't2b' | 'b2t' | 'l2r' | 'r2l'
// 布局模式
type LayoutMode = 'standard' | 'compact'

// Compact 布局连接线配置
interface CompactLayoutConnectionLine {
  width?: string | number      // L形连接线宽度，默认: '11px'
  height?: string | number      // L形连接线垂直部分高度，默认: '56px'
  offset?: string | number      // 连接线左侧偏移，默认: '-6px'
  color?: string                // 连接线颜色，默认: '#47A7F3'
}

// Compact 布局首节点配置
interface CompactLayoutFirstNode {
  connectionHeight?: string | number  // 首节点连接线高度，默认: '70px'
  connectionTop?: string | number     // 首节点连接线顶部偏移，默认: '-14px'
}

// Compact 布局配置
interface CompactLayoutConfig {
  paddingLeft?: string | number       // 根节点左侧偏移，默认: '52%'
  marginRight?: string | number       // 右侧边距，默认: '92px'
  nestedPaddingLeft?: string | number // 嵌套层级左侧偏移，默认: '101px'
  nodeSpacing?: string | number       // 节点垂直间距，默认: '20px' 或 '40px'
  connectionLine?: CompactLayoutConnectionLine
  firstNode?: CompactLayoutFirstNode
  textAlign?: 'left' | 'center' | 'right'  // 文本对齐，默认: 'left'
  compactFromLevel?: number           // 从第几层开始使用 Compact 布局，默认: 1（所有层级都使用）
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
  // 布局模式：'standard' | 'compact'
  layoutMode?: LayoutMode
  // 方向 (t2b, b2t, l2r, r2l)，仅在 standard 模式下有效
  direction?: StandardDirection
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
  // Compact 布局配置（仅在 layoutMode='compact' 时有效）
  compactLayout?: CompactLayoutConfig
}

// Props
const props = withDefaults(defineProps<Props>(), {
  nodeContent: '',
  verticalLevel: undefined,
  visibleLevel: 999,
  layoutMode: 'standard',
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

// 获取布局配置
const getLayoutConfig = () => {
  const mode = props.layoutMode || 'standard'
  const direction = mode === 'standard' 
    ? (props.direction || 't2b')
    : undefined
  
  return { mode, direction }
}

// 格式化样式值
const formatStyleValue = (value: string | number | undefined, defaultValue: string): string => {
  if (value === undefined || value === null) return defaultValue
  if (typeof value === 'number') return `${value}px`
  return String(value)
}

// 注入 Compact 布局样式
let compactStyleElement: HTMLStyleElement | null = null

// 清理并重新注入所有 Compact 布局样式
const injectCompactStyles = (config: CompactLayoutConfig) => {
  if (!chartContainer.value) return
  
  // 创建或获取 style 元素
  if (!compactStyleElement) {
    compactStyleElement = document.createElement('style')
    compactStyleElement.id = 'orgchart-compact-layout-styles'
    document.head.appendChild(compactStyleElement)
  }
  
  // 清空现有样式
  compactStyleElement.textContent = ''
  
  const styleSheet = compactStyleElement.sheet
  if (!styleSheet) return
  
  // 获取配置值，使用默认值
  const conn = config.connectionLine || {}
  const connWidth = formatStyleValue(conn.width, '11px')
  const connHeight = formatStyleValue(conn.height, '56px')
  const connOffset = formatStyleValue(conn.offset, '-6px')
  const connColor = conn.color || '#47A7F3'
  
  const first = config.firstNode || {}
  const firstHeight = formatStyleValue(first.connectionHeight, '70px')
  const firstTop = formatStyleValue(first.connectionTop, '-14px')
  
  // 计算 ::after 的高度（需要根据 ::before 的高度动态计算）
  const afterHeight = `calc(100% - ${connHeight})`
  
  try {
    // 0. 排除根节点 - 根节点不应该有连接线
    styleSheet.insertRule(
      `.orgchart > .nodes > .hierarchy::before,
       .orgchart > .nodes > .hierarchy::after {
         content: none !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 1. 基础连接线样式 - ::before 和 ::after 共用（必须保持 border-width: 0 0 1px 1px）
    // 注意：排除根节点，只应用到子节点
    styleSheet.insertRule(
      `.orgchart .nodes.vertical .hierarchy::before,
       .orgchart .nodes.vertical .hierarchy::after {
         left: ${connOffset} !important;
         border-color: ${connColor} !important;
         border-style: solid !important;
         border-width: 0 0 1px 1px !important;
         box-sizing: border-box !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 2. ::before 样式（垂直部分）- 普通节点
    styleSheet.insertRule(
      `.orgchart .nodes.vertical .hierarchy::before {
         top: 0px !important;
         width: ${connWidth} !important;
         height: ${connHeight} !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 3. ::after 样式（水平延伸部分）- 普通节点（注意：使用 bottom: 0，不是 top）
    styleSheet.insertRule(
      `.orgchart .nodes.vertical .hierarchy::after {
         bottom: 0 !important;
         height: ${afterHeight} !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 4. 首节点（第一个子节点）的 ::before 特殊样式
    // 注意：宽度是 calc(50% + 1px)，只有左边框（border-width: 0px 0 0 1px）
    styleSheet.insertRule(
      `.orgchart .nodes.vertical > .hierarchy:first-child::before {
         top: ${firstTop} !important;
         height: ${firstHeight} !important;
         width: calc(50% + 1px) !important;
         border-width: 0px 0 0 1px !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 5. 首节点的 ::after 特殊样式（注意：使用 top: 56px，不是 bottom: 0）
    const firstAfterHeight = `calc(100% - ${connHeight})`
    styleSheet.insertRule(
      `.orgchart .nodes.vertical > .hierarchy:first-child::after {
         top: ${connHeight} !important;
         width: ${connWidth} !important;
         height: ${firstAfterHeight} !important;
         border-width: 1px 0 0 1px !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 6. 普通首节点（非根节点第一个子节点）的 ::before
    styleSheet.insertRule(
      `.orgchart .nodes.vertical .hierarchy:first-child:not(:only-child)::before {
         top: ${firstTop} !important;
         height: ${firstHeight} !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 7. 末节点的 ::after（只有上边框）
    styleSheet.insertRule(
      `.orgchart .nodes.vertical .hierarchy:last-child::after {
         border-width: 1px 0 0 0 !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 8. 首节点且是末节点的情况
    styleSheet.insertRule(
      `.orgchart .nodes.vertical > .hierarchy:first-child:last-child::after {
         border-width: 1px 0 0 0 !important;
       }`,
      styleSheet.cssRules.length
    )
    
    // 9. 独子节点的 ::before
    styleSheet.insertRule(
      `.orgchart .nodes.vertical .hierarchy:only-child::before {
         width: ${connWidth} !important;
       }`,
      styleSheet.cssRules.length
    )
    
  } catch (e) {
    console.warn('Failed to inject compact layout styles:', e)
  }
}

// 计算节点的层级深度
// 从 .orgchart 开始，计算 .nodes 的嵌套层级
// 层级1: .orgchart > .nodes (根节点的直接子节点)
// 层级2: .orgchart > .nodes > .hierarchy > .nodes
// 层级3: .orgchart > .nodes > .hierarchy > .nodes > .hierarchy > .nodes
const getNodeLevel = ($nodes: any, $chart: any): number => {
  if (!$nodes || !$nodes.length || !$chart || !$chart.length) return 1
  
  // 获取根节点的 .nodes
  const $rootNodes = $chart.find('> .nodes')
  if (!$rootNodes.length) return 1
  
  // 如果是根节点的直接子节点
  if ($nodes.is($rootNodes)) {
    return 1
  }
  
  // 计算从根节点到当前节点的层级
  // 方法：计算从根节点到当前节点之间经过的 .hierarchy 数量
  let level = 1
  let $current = $nodes
  
  // 向上遍历，计算层级
  while ($current.length > 0) {
    // 查找包含当前 .nodes 的父级 .hierarchy
    // .nodes 的直接父元素是 .hierarchy
    const $parentHierarchy = $current.parent('.hierarchy')
    if ($parentHierarchy.length > 0) {
      // 找到父级 .hierarchy，说明层级+1
      level++
      // 查找这个 .hierarchy 所在的父级 .nodes
      // .hierarchy 的父元素是 .nodes
      const $parentNodes = $parentHierarchy.parent('.nodes')
      if ($parentNodes.length > 0) {
        // 如果父级 .nodes 是根节点，说明已经到达顶层
        if ($parentNodes.is($rootNodes)) {
          return level
        }
        // 否则继续向上查找
        $current = $parentNodes
        continue
      }
    }
    
    // 如果找不到父级 .hierarchy，说明已经到达根节点或出错
    break
  }
  
  return level || 1
}

// 应用布局模式
const applyLayoutMode = () => {
  if (!chartContainer.value) return
  
  const $container = $(chartContainer.value)
  const $chart = $container.find('.orgchart')
  
  if ($chart.length === 0) return
  
  const { mode } = getLayoutConfig()
  
  // 查找所有 .nodes 元素（包括嵌套的）
  const $allNodes = $chart.find('.nodes')
  
  if ($allNodes.length === 0) return
  
  if (mode === 'compact') {
    // 应用 Compact 布局配置
    const config = props.compactLayout || {}
    const compactFromLevel = config.compactFromLevel ?? 3 // 默认从第1层开始
    
    // 先清理所有之前应用的样式，确保从干净的状态开始
    $allNodes.removeClass('vertical')
    $allNodes.css({
      'padding-left': '',
      'margin-right': '',
      'text-align': ''
    })
    $chart.find('.node').css('margin-bottom', '')
    
    // 遍历所有 .nodes，根据层级决定是否应用 Compact 布局
    $allNodes.each(function(this: HTMLElement) {
      const $currentNodes = $(this)
      const level = getNodeLevel($currentNodes, $chart)
      
      // 如果层级 >= compactFromLevel，应用 Compact 布局
      if (level >= compactFromLevel) {
        $currentNodes.addClass('vertical')
      }
    })
    
    // 应用根节点样式（只对已经是 vertical 的节点应用）
    const $rootNodes = $chart.find('> .nodes')
    if ($rootNodes.length > 0 && $rootNodes.hasClass('vertical')) {
      if (config.paddingLeft !== undefined) {
        $rootNodes.css('padding-left', formatStyleValue(config.paddingLeft, '52%'))
      }
      if (config.marginRight !== undefined) {
        $rootNodes.css('margin-right', formatStyleValue(config.marginRight, '92px'))
      }
      if (config.textAlign) {
        $rootNodes.css('text-align', config.textAlign)
      }
    }
    
    // 应用嵌套节点样式（只对已经是 vertical 的节点应用）
    const $nestedNodes = $chart.find('.nodes.vertical .nodes.vertical')
    if ($nestedNodes.length > 0 && config.nestedPaddingLeft !== undefined) {
      $nestedNodes.css('padding-left', formatStyleValue(config.nestedPaddingLeft, '101px'))
    }
    
    // 应用节点间距（只对已经是 vertical 的节点应用）
    if (config.nodeSpacing !== undefined) {
      $chart.find('.nodes.vertical .node').css('margin-bottom', formatStyleValue(config.nodeSpacing, '20px'))
    }
    
    // 应用连接线样式（通过动态注入CSS）
    // 注意：L型连接线是通过伪元素的 border-width: 0 0 1px 1px 实现的
    // 必须保持这个属性不变，只修改尺寸、位置和颜色
    injectCompactStyles(config)
  } else {
    // Standard 布局：移除所有 .nodes 的 vertical 类，并清除自定义样式
    $allNodes.removeClass('vertical')
    $allNodes.css({
      'padding-left': '',
      'margin-right': '',
      'text-align': ''
    })
    $chart.find('.node').css('margin-bottom', '')
    
    // 清理注入的 Compact 布局样式
    if (compactStyleElement) {
      compactStyleElement.textContent = ''
    }
  }
}

// 初始化图表
const initOrgChart = (newOptions?: Record<string, any>) => {
  if ($ && $.fn.orgchart && chartContainer.value) {
    const { direction } = getLayoutConfig()
    
    const options: Record<string, any> = newOptions || {
      data: props.datasource,
      nodeContent: props.nodeContent,
      verticalLevel: props.verticalLevel,
      visibleLevel: props.visibleLevel,
      direction: direction, // 仅在 standard 模式下使用
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
    
    // 包装 initCompleted 回调，确保在初始化完成后应用布局模式
    const originalInitCompleted = options.initCompleted
    options.initCompleted = ($chart: any) => {
      // 先调用用户自定义的 initCompleted
      if (originalInitCompleted) {
        originalInitCompleted($chart)
      }
      // 然后应用布局模式
      nextTick(() => {
        applyLayoutMode()
      })
    }
    
    // 初始化OrgChart
    chart.value = $(chartContainer.value).orgchart(options)
    
    // 绑定事件
    bindEvents()
    
    // 如果图表已经初始化完成，立即应用布局模式（作为备用方案）
    nextTick(() => {
      applyLayoutMode()
    })
  } else {
    console.error('jQuery或OrgChart插件未加载')
  }
}

// 重新绘制图表
const redraw = () => {
  if (chart.value && chartContainer.value) {
    $(chartContainer.value).empty()
    initOrgChart()
  } else if (chartContainer.value) {
    // 如果图表还未初始化，直接初始化
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
  () => props.layoutMode,
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
  () => props.compactLayout,
  () => {
    // 如果当前是 compact 模式，重新应用布局模式以更新样式
    if (props.layoutMode === 'compact') {
      nextTick(() => {
        console.log('yao compactLayout', props.compactLayout)
        applyLayoutMode()
      })
    }
  },
  { deep: true }
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
  // 清理注入的样式
  if (compactStyleElement) {
    compactStyleElement.remove()
    compactStyleElement = null
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