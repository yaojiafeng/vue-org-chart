<template>
  <div ref="chartContainer" class="org-chart-container" :class="{ 'state-owned-asset-role': isStateOwnedAssetRole }" :style="{ height: height }">
    <div class="chart-node-styles" v-if="nodeClassColors" v-html="createNodeStyles"></div>
  </div>
</template>

<script>
import './css/jquery.orgchart.css'
import './css/style.css'
import domtoimage from 'dom-to-image'
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
      default: true
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
    // 是否国资委角色
    isStateOwnedAssetRole: {
      type: Boolean,
      default: false
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
  computed: {
    // 生成节点样式
    createNodeStyles() {
      if (!this.nodeClassColors || Object.keys(this.nodeClassColors).length === 0) {
        return ''
      }

      let styles = '<style type="text/css">'
      styles += '.orgchart { background: transparent !important; }'
      styles += '.orgchart td.left, .orgchart td.right, .orgchart td.top { border-color: #47A7F3; }'
      styles += '.orgchart td>.down { background-color: #47A7F3; }'
      
      for (const className in this.nodeClassColors) {
        const color = this.nodeClassColors[className]
        styles += `.orgchart .${className} .title { background-color: ${color}; }`
        styles += `.orgchart .${className} .content { border-color: ${color}; }`
      }
      
      styles += '</style>'
      return styles
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initOrgChart()
    })
  },
  methods: {
    // 创建节点操作按钮的公共方法
    createNodeOperations($node, data, self) {
      // 如果是国资委角色，直接返回，不创建任何操作按钮
      if (self.isStateOwnedAssetRole) {
        return
      }

      // 创建操作按钮容器
      const operationDiv = $('<div>', {
        class: 'node-operations'
      })

      // 判断是否是第一层节点
      const isFirstLevel = data.achievementRank === '0'

      // 非第一层节点显示所有按钮（新增、编辑、删除）
      if (isFirstLevel) {
        // 第一层节点显示新增和编辑按钮
        const addIcon = $('<i>', {
          class: 'node-icon node-add-icon sgptfont icon-add icon-with-border',
          title: '新增',
          click: function(e) {
            e.stopPropagation()
            console.log('添加子节点', data)
            self.$emit('node-add', data)
          }
        })

        const editIcon = $('<i>', {
          class: 'node-icon node-edit-icon sgptfont icon-edit',
          title: '编辑',
          click: function(e) {
            e.stopPropagation()
            console.log('编辑节点', data)
            self.$emit('node-edit', data)
          }
        })

        operationDiv.append(addIcon)
        operationDiv.append(editIcon)
      } else {
        // 非第一层节点显示所有按钮（新增、编辑、删除）
        const addIcon = $('<i>', {
          class: 'node-icon node-add-icon sgptfont icon-add icon-with-border',
          title: '新增',
          click: function(e) {
            e.stopPropagation()
            console.log('添加子节点', data)
            self.$emit('node-add', data)
          }
        })

        const editIcon = $('<i>', {
          class: 'node-icon node-edit-icon sgptfont icon-edit icon-with-border',
          title: '编辑',
          click: function(e) {
            e.stopPropagation()
            console.log('编辑节点', data)
            self.$emit('node-edit', data)
          }
        })

        const deleteIcon = $('<i>', {
          class: 'node-icon node-delete-icon sgptfont icon-delete',
          title: '删除',
          click: function(e) {
            e.stopPropagation()
            console.log('删除节点', data)
            self.$emit('node-delete', data)
          }
        })

        // 添加所有按钮到容器
        operationDiv.append(addIcon)
        operationDiv.append(editIcon)
        operationDiv.append(deleteIcon)
      }

      // 将容器添加到节点
      $node.append(operationDiv)
    },
    
    // 自定义创建节点的方法 - 用于重写原始库的节点创建逻辑
    customCreateNode(chartInstance) {
      const originalCreateNode = chartInstance.createNode
      
      // 重写createNode方法，修改箭头的生成逻辑
      chartInstance.createNode = function(data) {
        // 获取节点元素
        const $nodeDiv = originalCreateNode.call(this, data)
        
        // 添加data-id属性
        if (data.id) {
          $nodeDiv.attr('data-id', data.id)
        }
        
        // 移除加减号按钮
        $nodeDiv.find('.toggleBtn').remove()
        $nodeDiv.find('.symbol').remove()
        
        return $nodeDiv
      }
    },
    
    // 创建图表配置的公共方法
    createChartOptions(customConfig = {}) {
      const self = this
      
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
        // 保留加减号按钮的功能，但通过CSS隐藏
        verticalDepth: this.verticalLevel,
        toggleBtn: true,
        parentNodeSymbol: true,
        showToggleBtn: true,
        // 添加动画完成的回调
        'onAfterShowChildren': function($node) {
          self.updateDescendantsBadge($node)
        },
        'onAfterHideChildren': function($node) {
          self.updateDescendantsBadge($node)
        }
      }
      
      // 合并自定义配置
      const options = { ...baseOptions, ...customConfig }
      
      // 添加事件处理
      options.createNode = function($node, data) {
        // 确保节点保持class名称以应用颜色
        if (data.className) {
          $node.addClass(data.className)
        }
        
        // 创建节点操作按钮
        self.createNodeOperations($node, data, self)
        
        // 移除任何可能存在的加减号按钮
        $node.find('.toggleBtn').remove()
        $node.find('.symbol').remove()
        
        // 为节点的title部分添加点击事件
        $node.find('.title').on('click', function(e) {
          e.stopPropagation() // 阻止事件冒泡
          console.log('点击了节点标题:', data.title || data.name)
          console.log('节点数据:', data)
          
          // 触发标题点击事件
          self.$emit('node-title-click', { $node, data })
        })

        // 为子节点数量标记添加点击事件
        $node.find('.descendants-count').on('click', function(e) {
          e.stopPropagation()
          
          // 获取子节点容器
          const $childrenUl = $node.siblings('ul')
          
          // 检查子节点是否存在
          if ($childrenUl.length) {
            const isHidden = $childrenUl.hasClass('hidden') || 
                           $childrenUl.is(':hidden') || 
                           $childrenUl.css('display') === 'none'
            
            if (isHidden) {
              // 展开子节点
              self.showChildren($node)
            } else {
              // 收起子节点
              self.chart.hideChildren($node)
            }
          }
        })
      }
      
      // 修改初始化完成的处理
      options.initCompleted = function() {
        // 应用自定义创建节点方法
        self.customCreateNode(this)
        
        // 初始化所有节点的子节点数量徽章显示状态
        $(self.$refs.chartContainer).find('.node').each(function() {
          const $node = $(this)
          const $childrenUl = $node.siblings('ul')
          const $countBadge = $node.find('.descendants-count')
          
          if ($countBadge.length) {
            // 如果子节点是可见的，隐藏徽章中的文本
            if ($childrenUl.length && 
                !$childrenUl.hasClass('hidden') && 
                !$childrenUl.is(':hidden') && 
                $childrenUl.css('display') !== 'none' && 
                $childrenUl.css('visibility') !== 'hidden') {
              $countBadge.addClass('text-hidden').text('')
            } else {
              // 如果子节点是隐藏的，显示徽章文本
              $countBadge.removeClass('text-hidden')
            }
          }
        })
        
        // 为所有展开/收起操作添加MutationObserver来监控DOM变化
        self.setupMutationObservers()
      }
      
      // 如果传入了nodeTemplate，就使用它
      if (this.nodeTemplate) {
        options.nodeTemplate = this.nodeTemplate
      }
      
      return options
    },
    
    // 为图表中的节点设置MutationObserver以监控DOM变化
    setupMutationObservers() {
      const self = this
      const container = this.$refs.chartContainer
      
      // 创建一个MutationObserver来监视className和hidden属性的变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // 当attributes变化且属于class或hidden属性时
          if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
            // 如果变化的是ul元素，找到它前面的node元素
            if (mutation.target.tagName.toLowerCase() === 'ul') {
              const $ul = $(mutation.target)
              const $node = $ul.siblings('.node')
              
              if ($node.length) {
                // 更新该节点的子节点数量显示
                self.updateDescendantsBadge($node)
              }
            }
          }
        })
      })
      
      // 配置观察选项
      const config = { 
        attributes: true, 
        attributeFilter: ['class', 'style'], 
        subtree: true 
      }
      
      // 开始观察整个图表容器
      observer.observe(container, config)
      
      // 保存observer引用以便在组件销毁时断开连接
      this.observer = observer
    },
    
    // 更新所有节点的子节点数量徽章显示状态
    updateAllDescendantsBadges() {
      const self = this
      $(this.$refs.chartContainer).find('.node').each(function() {
        const $node = $(this)
        self.updateDescendantsBadge($node)
      })
    },
    
    // 更新单个节点的子节点数量徽章显示状态
    updateDescendantsBadge($node) {
      // 获取节点的下一级 ul 元素
      const $childrenUl = $node.siblings('ul')
      // 获取子节点数量标记
      const $countBadge = $node.find('.descendants-count')
      
      if ($countBadge.length) {
        // 如果存在子节点数量标记，检查子节点的可见性状态
        const isVisible = $childrenUl.length && 
                         !$childrenUl.hasClass('hidden') && 
                         !$childrenUl.is(':hidden') && 
                         $childrenUl.css('display') !== 'none' && 
                         $childrenUl.css('visibility') !== 'hidden'
        
        // 子节点可见时只显示圆圈不显示数字，否则显示圆圈和数字
        if (isVisible) {
          $countBadge.addClass('text-hidden').text('')
        } else {
          $countBadge.removeClass('text-hidden').text($countBadge.attr('data-count'))
        }
        
        console.log('更新节点子节点数量徽章显示状态', {
          node: $node.find('.title').text(),
          isVisible,
          shouldShowCount: !isVisible
        })
      }
    },
    
    // 应用节点样式
    applyNodeStyles() {
      // 生成样式字符串
      let styles = ''
      if (this.nodeClassColors && Object.keys(this.nodeClassColors).length > 0) {
        styles = '<style type="text/css">'
        styles += '.orgchart { background: transparent !important; }'
        styles += '.orgchart td.left, .orgchart td.right, .orgchart td.top { border-color: #47A7F3; }'
        styles += '.orgchart td>.down { background-color: #47A7F3; }'
        
        for (const className in this.nodeClassColors) {
          const color = this.nodeClassColors[className]
          styles += `.orgchart .${className} .title { background-color: ${color}; }`
          styles += `.orgchart .${className} .content { border-color: ${color}; }`
        }
        
        styles += '</style>'
      }
      
      // 应用样式
      if (styles) {
        const styleEl = document.createElement('div')
        styleEl.innerHTML = styles
        this.$refs.chartContainer.appendChild(styleEl)
      }
    },
    
    // 通过ID查找节点DOM元素
    findNodeById(nodeId) {
      if (!nodeId || !this.chart) return null
      
      // 在图表中查找具有指定ID的节点
      const $nodes = $(this.$refs.chartContainer).find('.node')
      let foundNode = null
      
      $nodes.each(function() {
        const nodeData = $(this).data('nodeData')
        if (nodeData && nodeData.id === nodeId) {
          foundNode = $(this)
          return false // 找到后退出循环
        }
      })
      
      return foundNode
    },
    
    // 展开指定节点的子节点
    showChildren($node) {
      if (!this.chart || !$node || !$node.length) return false
      
      try {
        // 检查节点是否有子节点
        const $childrenUl = $node.siblings('ul')
        if (!$childrenUl.length) {
          return true
        }
        
        // 检查节点是否已经展开
        if (!$childrenUl.hasClass('hidden')) {
          return true
        }

        // 检查是否有 edge 元素，如果没有则添加
        const $edge = $node.children('.edge')
        if (!$edge.length) {
          // 如果没有 edge 元素，添加一个
          $node.append('<i class="edge verticalEdge bottomEdge no-pointer"></i>')
        }
        
        // 在展开前确保节点已经准备好
        const nodeData = $node.data('nodeData')
        if (nodeData && nodeData.children && nodeData.children.length > 0) {
          // 确保子节点容器存在
          if (!$childrenUl.length) {
            const $childNodes = this.chart.buildHierarchy($node, nodeData.children)
            $node.after($childNodes)
          }
        }

        // 使用 setTimeout 来确保 DOM 更新完成
        setTimeout(() => {
          // 使用orgchart的原生showChildren方法
          this.chart.showChildren($node)
          
          // 手动触发一次更新
          this.updateDescendantsBadge($node)
        }, 0)
        
        return true
      } catch (error) {
        console.error('展开节点失败:', error)
        return false
      }
    },
    
    // 展开指定ID的节点
    expandNode(nodeId) {
      if (!nodeId || !this.chart) return false
      
      // 查找节点
      const $node = this.findNodeById(nodeId)
      if (!$node || !$node.length) return false
      
      // 使用showChildren方法展开节点
      return this.showChildren($node)
    },
    
    // 初始化图表
    initOrgChart() {
      if ($ && $.fn.orgchart) {
        // 获取图表配置
        const options = this.createChartOptions()
        
        // 初始化OrgChart
        this.chart = $(this.$refs.chartContainer).orgchart(options)
        
        // 初始化后执行一次，确保所有徽章正确显示
        this.$nextTick(() => {
          // 应用节点样式
          this.applyNodeStyles()
          
          // 确保样式被应用到所有节点
          this.ensureNodeStyles()
          
          // 查找所有已展开的节点，隐藏它们的数字
          this.updateAllDescendantsBadges()
          
          // 触发已完成事件
          this.$emit('chart-initialized', this.chart)
        })
      } else {
        console.error('jQuery或OrgChart插件未加载')
      }
    },
    
    // 确保节点样式被正确应用
    ensureNodeStyles() {
      if (!this.chart || !this.nodeClassColors) return
      
      const $container = $(this.$refs.chartContainer)
      
      // 遍历所有节点
      $container.find('.node').each((_, node) => {
        const $node = $(node)
        const nodeData = $node.data('nodeData')
        
        // 如果节点有className属性，确保对应的样式被应用
        if (nodeData && nodeData.className) {
          const color = this.nodeClassColors[nodeData.className]
          if (color) {
            $node.find('.title').css('background-color', color)
            $node.find('.content').css('border-color', color)
          }
        }
      })
    },
    
    // 导出组织结构图为图片
    async exportChart(fileName) {
      if (!this.chart) return

      // 在函数开始处声明变量，确保在整个函数范围内可用
      let $container, $chart

      try {
        // 获取图表容器
        $container = $(this.$refs.chartContainer)
        $chart = $container.find('.orgchart')
        
        // 保存原始样式
        const originalStyles = {
          container: {
            overflow: $container.css('overflow'),
            width: $container.css('width'),
            height: $container.css('height'),
            position: $container.css('position')
          },
          chart: {
            transform: $chart.css('transform'),
            width: $chart.css('width'),
            height: $chart.css('height'),
            position: $chart.css('position'),
            margin: $chart.css('margin'),
            left: $chart.css('left'),
            top: $chart.css('top')
          }
        }

        // 临时修改容器样式
        $container.css({
          overflow: 'visible',
          width: 'auto',
          height: 'auto',
          position: 'relative'
        })

        // 临时修改图表样式
        $chart.css({
          transform: 'none',
          position: 'relative',
          margin: '0',
          left: '0',
          top: '0'
        })

        // 计算实际内容尺寸并设置
        const contentWidth = $chart[0].scrollWidth
        const contentHeight = $chart[0].scrollHeight
        
        $chart.css({
          width: contentWidth + 'px',
          height: contentHeight + 'px'
        })

        // 确保滚动位置重置
        window.pageYOffset = 0
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        $container[0].scrollTop = 0
        $container[0].scrollLeft = 0

        // 等待样式应用
        await new Promise(resolve => setTimeout(resolve, 200))

        // 配置导出选项
        const exportOptions = {
          width: contentWidth,
          height: contentHeight,
          style: {
            transform: 'none',
            'transform-origin': 'center top',
            margin: '0',
            left: '0',
            top: '0'
          },
          quality: 2,
          scale: 2,
          bgcolor: '#FFFFFF'
        }

        // 使用toPng方法导出
        const dataUrl = await domtoimage.toPng($chart[0], exportOptions)

        // 创建下载链接
        const link = document.createElement('a')
        link.download = `${fileName}.png`
        link.href = dataUrl
        
        // 触发下载
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // 恢复原始样式
        $container.css(originalStyles.container)
        $chart.css(originalStyles.chart)

        // 重置容器和图表的宽高，但保持props中指定的高度
        $container.css({
          width: '',
          height: this.height // 使用props中的height
        })
        $chart.css({
          width: '',
          height: ''
        })

        return true
      } catch (error) {
        console.error('导出图表时发生错误:', error)
        // 只在变量已定义时执行重置
        if ($container && $chart) {
          // 重置容器和图表的宽高，但保持props中指定的高度
          $container.css({
            width: '',
            height: this.height // 使用props中的height
          })
          $chart.css({
            width: '',
            height: ''
          })
        }
        throw error
      }
    },
    
    // 重新绘制图表
    redraw() {
      if (this.chart) {
        $(this.$refs.chartContainer).empty()
        this.initOrgChart()
      }
    },
    
    // 重新渲染完全展开的树状图
    redrawFullExpanded() {
      if (this.chart) {
        // 清空容器重新渲染
        $(this.$refs.chartContainer).empty()
        
        // 创建展开所有节点的图表 - 使用自定义配置
        const options = this.createChartOptions({
          visibleLevel: 100 // 设置一个足够大的值确保所有层级都可见
        })
        
        // 初始化展开的OrgChart
        this.chart = $(this.$refs.chartContainer).orgchart(options)
        
        // 应用节点样式
        this.applyNodeStyles()
        
        return true
      }
      return false
    },
    
    // 缩放图表 - 放大或缩小
    zoomChart(scale) {
      if (!this.chart) return false
      
      try {
        // 获取图表容器
        const $container = $(this.$refs.chartContainer)
        const $chart = $container.find('.orgchart')
        
        // 获取当前的transformOrigin样式
        const currentTransform = $chart.css('transform') || 'none'
        const currentScale = currentTransform !== 'none' ? 
          parseFloat(currentTransform.split('(')[1]) : 1
        
        // 计算新的缩放比例
        let newScale = currentScale * scale
        
        // 限制缩放范围，避免过小或过大
        newScale = Math.max(0.3, Math.min(2.0, newScale))
        
        // 应用新的缩放比例
        $chart.css({
          'transform': `scale(${newScale})`,
          'transform-origin': 'center top'
        })
        
        console.log(`图表缩放: ${newScale.toFixed(2)}倍`)
        return true
      } catch (error) {
        console.error('缩放图表时发生错误:', error)
        return false
      }
    },
    
    // 缩放图表到指定的比例
    zoomToScale(scale) {
      if (!this.chart) return false
      
      try {
        // 获取图表容器
        const $container = $(this.$refs.chartContainer)
        const $chart = $container.find('.orgchart')
        
        // 限制缩放范围，避免过小或过大
        const newScale = Math.max(0.2, Math.min(2.5, scale))
        
        // 应用新的缩放比例
        $chart.css({
          'transform': `scale(${newScale})`,
          'transform-origin': 'left top'
        })
        
        console.log(`图表缩放到指定比例: ${newScale.toFixed(2)}倍`)
        return true
      } catch (error) {
        console.error('缩放图表到指定比例时发生错误:', error)
        return false
      }
    },
    
    // 重置图表视图到初始状态
    resetView() {
      if (!this.chart) return false
      
      try {
        // 获取图表容器
        const $container = $(this.$refs.chartContainer)
        const $chart = $container.find('.orgchart')
        
        // 重置变换样式
        $chart.css({
          'transform': 'scale(1)',
          'transform-origin': 'center top'
        })
        
        // 滚动到顶部
        $container.scrollTop(0)
        $container.scrollLeft(0)
        
        console.log('重置图表视图到初始状态')
        return true
      } catch (error) {
        console.error('重置图表视图时发生错误:', error)
        return false
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
    // 监听国资委角色变化
    isStateOwnedAssetRole() {
      this.redraw()
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
.org-chart-container {
  position: relative;
  width: fit-content;
  min-width: 100%;
  // overflow: scroll !important;
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: transparent !important;
  margin: 0 auto;
  padding-top: 52px;
  /* 隐藏滚动条 - 兼容主流浏览器 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}


.org-chart-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Webkit */
}

.chart-node-styles {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

:deep(.node-operations) {
  position: absolute;
  top: -30px;
  left: 3px;
  display: none;
  align-items: center;
  /* gap: 0; */
  z-index: 10999990;
  background: #FFFFFF;
  border: 1px solid #E4E7ED;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  height: 28px;
  border-radius: 2px;
  padding: 0 4px;
}

:deep(.node-operations::before) {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: #FFFFFF;
  z-index: -1;
  border-radius: 3px;
}

:deep(.orgchart .node:hover .node-operations) {
  display: flex;
}

:deep(.node-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  margin: 0 9px;
  color: #666;
}

:deep(.icon-with-border) {
  border-right: 1px solid #D8D8D8;
  padding-right: 8px;
  margin-right: 0;
}

/* 为节点标题添加鼠标指针样式 */
:deep(.orgchart .node .title) {
  cursor: pointer;
  /* 强制英文字母和数字也自动换行 */
  word-break: break-all;
  line-break: anywhere;
  hyphens: auto;
  /* 确保换行属性生效 */
  white-space: normal !important;
  overflow-wrap: break-word !important;
}

/* 添加子节点数量标记的样式 */
:deep(.descendants-count) {
  position: absolute;
  bottom: -30px!important;  /* 向下移动30px */
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  min-height: 18px;
  /* 明确设置最大宽高，防止意外扩大 */
  max-width: 18px;
  max-height: 18px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5; /* 降低基础z-index，避免遮挡下层节点 */
  border: 1px solid #47A7F3;
  color: #000;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  /* 严格限制圆圈的事件区域，防止遮挡下层节点 */
  pointer-events: auto;
  /* 确保圆圈的大小固定，不会意外扩大 */
  flex-shrink: 0;
  box-sizing: border-box;
  /* 添加溢出隐藏，确保内容不会超出边界 */
  overflow: hidden;
  /* 确保圆圈不会影响周围布局 */
  isolation: isolate;
  /* 严格限制圆圈的影响范围 */
  contain: layout;

  /* 添加新的样式用于隐藏文本时的状态 */
  &.text-hidden {
    background: #fff;
  }

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 10px;
    background-color: #47A7F3;
    z-index: -1;
    /* 连线不参与鼠标事件 */
    pointer-events: none;
  }
  
  /* 确保圆圈点击区域严格限制在圆圈内 */
  &:hover {
    /* 只在hover时稍微提升层级 */
    z-index: 10;
  }
}

/* 当父节点hover时，提高圆圈的z-index以盖住连线 */
:deep(.orgchart .node:hover .descendants-count) {
  z-index: 1050;
}

/* 国资委角色时，圆圈需要更高的z-index来盖住连线 */
.org-chart-container.state-owned-asset-role :deep(.descendants-count) {
  z-index: 1000; /* 国资委角色时稍微提高基础z-index */
}

:deep(.no-pointer) {
  pointer-events: none;
}

/* 根本性修复：确保所有节点都有完整的hover区域 */
:deep(.orgchart .node) {
  /* 确保每个节点都有完整的hover能力 */
  pointer-events: auto !important;
  position: relative !important;
  z-index: auto;
  
  /* 清除所有可能干扰hover的元素 */
  &::before,
  &::after {
    pointer-events: none !important;
  }
  
  /* hover时确保最高优先级 */
  &:hover {
    z-index: 999 !important;
    pointer-events: auto !important;
    
    .node-operations {
      display: flex;
      z-index: 1099;
    }
  }
  
  /* 确保节点内容完全可交互 */
  .title,
  .content {
    pointer-events: auto !important;
    position: relative;
    z-index: 1;
  }
  
  /* 隐藏不需要的元素 */
  .symbol {
    display: none !important;
  }
  .toggleBtn {
    display: none !important;
  }
  .edge {
    visibility: hidden !important;
    pointer-events: none !important;
    position: absolute !important;
  }
}

/* 当isStateOwnedAssetRole为true时，hover状态下连线的层级要低于圆圈 */
.org-chart-container.state-owned-asset-role :deep(.orgchart) {
  /* 为连线元素设置较低的z-index，当国资委角色且节点hover时 */
  .node:hover {
    &::before,
    &::after {
      z-index: 1;
    }
  }
  
  /* 父节点hover时，影响其下级连线的层级 */
  .hierarchy:hover {
    &::before,
    &::after {
      z-index: 1;
    }
    
    /* 影响其子节点的连线 */
    .node::before,
    .node::after {
      z-index: 1;
    }
  }
}

/* 确保向下连线能正常显示（修复收起节点后的连线问题） */
:deep(.orgchart .hierarchy:not(.couple) > .node:has(+ .nodes)::after) {
  content: "" !important;
  position: absolute !important;
  bottom: -22px !important;
  left: calc(50% - 0.5px) !important;
  width: 1px !important;
  height: 20px !important;
  background-color: #47A7F3 !important;
  pointer-events: none !important;
  z-index: 1 !important;
  display: block !important;
}

/* 确保圆圈到父节点的连线正常显示 */
:deep(.descendants-count::before) {
  content: '' !important;
  position: absolute !important;
  top: -10px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 1px !important;
  height: 10px !important;
  background-color: #47A7F3 !important;
  z-index: -1 !important;
  pointer-events: none !important;
  display: block !important;
}

/* 确保搜索序号圆圈显示在节点之上 */
:deep(.search-index-circle) {
  z-index: 10000 !important;
  position: absolute !important;
  pointer-events: none !important;
}
</style> 