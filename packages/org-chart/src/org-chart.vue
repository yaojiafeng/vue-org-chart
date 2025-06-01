<template>
  <div ref="chartContainer" class="org-chart-container">
  </div>
</template>

<script>
import './css/jquery.orgchart.css'
// import domtoimage from 'dom-to-image'
import $ from 'jquery'
import 'orgchart'

export default {
  name: 'OrgChart',
  props: {
    // 组织结构数据源
    datasource: {
      type: Object,
      required: true
    },
    // 节点内容属性名
    nodeContent: {
      type: String,
      default: 'title'
    },
    // 垂直层级
    verticalLevel: {
      type: Number,
      default: 4
    },
    // 可见层级
    visibleLevel: {
      type: Number,
      default: 4
    },
    // 方向 (t2b, b2t, l2r, r2l)
    direction: {
      type: String,
      default: 't2b'
    },
    // 是否可拖拽
    draggable: {
      type: Boolean,
      default: false
    },
    pan: {
      type: Boolean,
      default: false
    },
    // 是否可缩放
    zoom: {
      type: Boolean,
      default: false
    },
    // 是否可展开/折叠
    toggleSiblingsResp: {
      type: Boolean,
      default: false
    },
    // 自定义样式
    chartClass: {
      type: String,
      default: ''
    },
    // 节点类名颜色配置
    nodeClassColors: {
      type: Object,
      default: () => ({})
    },
    // 自定义节点模板
    nodeTemplate: {
      type: Function,
      default: null
    },
    height: {
      type: String,
      default: '600px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initOrgChart()
  },
  methods: {
    
    // 创建图表配置的公共方法
    createChartOptions(customConfig = {}) {
      
      // 基础配置
      const baseOptions = {
        data: this.datasource,
        nodeContent: this.nodeContent,
        verticalLevel: this.verticalLevel,
        visibleLevel: this.visibleLevel,
        direction: this.direction,
        draggable: this.draggable,
        pan: this.pan,
        zoom: this.zoom,
        toggleSiblingsResp: this.toggleSiblingsResp,
        chartClass: this.chartClass,
        nodeClassColors: this.nodeClassColors,
        verticalDepth: this.verticalLevel
      }
      
      // 合并自定义配置
      const options = { ...baseOptions, ...customConfig }

      // 如果传入了nodeTemplate，就使用它
      if (this.nodeTemplate) {
        options.nodeTemplate = this.nodeTemplate
      }
      
      // 添加事件处理
      options.createNode = function() {
      
      }
      
      // 修改初始化完成的处理
      options.initCompleted = function() {

      }
      
      return options
    },
    
    // 初始化图表
    initOrgChart() {
      if ($ && $.fn.orgchart) {
        // 获取图表配置
        const options = this.createChartOptions()
        
        // 初始化OrgChart
        this.chart = $(this.$refs.chartContainer).orgchart(options)
      } else {
        console.error('jQuery或OrgChart插件未加载')
      }
    },
    
    // 重新绘制图表
    redraw() {
      if (this.chart) {
        $(this.$refs.chartContainer).empty()
        this.initOrgChart()
      }
    }
  },
  watch: {
    // 监听数据变化，重新绘制图表
    datasource: {
      handler() {
        this.redraw()
      },
      deep: true
    },
    // 监听配置项变化
    nodeContent() { this.redraw() },
    verticalLevel() { this.redraw() },
    visibleLevel() { this.redraw() },
    direction() { this.redraw() },
    draggable() { this.redraw() },
    pan() { this.redraw() },
    toggleSiblingsResp() { this.redraw() },
    chartClass() { this.redraw() },
    nodeClassColors: {
      handler() {
        this.redraw()
      },
      deep: true
    }
  },
  beforeDestroy() {
    // 清理资源
    if (this.chart) {
      // 移除事件监听
      $(this.$refs.chartContainer).find('.bottomEdge').off('click')
      
      // 断开MutationObserver的连接
      if (this.observer) {
        this.observer.disconnect()
      }
      
      this.chart = null
      $(this.$refs.chartContainer).empty()
    }
  }
}
</script>

<style lang="scss" scoped>
</style> 