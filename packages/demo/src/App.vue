<template>
  <div id="app">
    <header class="app-header">
      <h1>Vue Org Chart Demo</h1>
      <div class="controls">
        <div class="control-group">
          <span class="control-label">布局模式：</span>
          <label>
            <input
              v-model="layoutMode"
              type="radio"
              value="compact"
            />
            Compact 布局
          </label>
          <label>
            <input
              v-model="layoutMode"
              type="radio"
              value="standard"
            />
            标准布局
          </label>
        </div>
        <div
          v-if="layoutMode === 'standard'"
          class="control-group"
        >
          <span class="control-label">方向：</span>
          <label>
            <input
              v-model="direction"
              type="radio"
              value="t2b"
            />
            从上到下
          </label>
          <label>
            <input
              v-model="direction"
              type="radio"
              value="b2t"
            />
            从下到上
          </label>
          <label>
            <input
              v-model="direction"
              type="radio"
              value="l2r"
            />
            从左到右
          </label>
          <label>
            <input
              v-model="direction"
              type="radio"
              value="r2l"
            />
            从右到左
          </label>
        </div>
        <div
          v-if="layoutMode === 'compact'"
          class="control-group"
        >
          <span class="control-label">从第几层开始 Compact (verticalLevel):</span>
          <input
            v-model.number="compactLayoutConfig.compactFromLevel"
            type="number"
            min="1"
            style="width: 80px; padding: 4px 8px; border: 1px solid #dcdfe6; border-radius: 4px;"
          />
        </div>
        <div class="control-group">
          <span class="control-label">功能：</span>
          <label>
            <input
              v-model="draggable"
              type="checkbox"
            />
            可拖拽
          </label>
          <label>
            <input
              v-model="zoom"
              type="checkbox"
            />
            可缩放
          </label>
          <label>
            <input
              v-model="pan"
              type="checkbox"
            />
            可平移
          </label>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="chart-container">
        <OrgChart
          :datasource="orgData"
          :layout-mode="layoutMode"
          :direction="direction"
          :draggable="draggable"
          :zoom="zoom"
          :pan="pan"
          :node-content="'department'"
          :node-title="'name'"
          :compact-layout="compactLayoutConfig"
          :node-template="nodeTemplate"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { OrgChart } from '@org-chart'

const layoutMode = ref<'standard' | 'compact'>('compact')
const direction = ref<'t2b' | 'b2t' | 'l2r' | 'r2l'>('t2b')
const draggable = ref(false)
const zoom = ref(false)
const pan = ref(false)

// Compact 布局配置（直接使用响应式对象）
const compactLayoutConfig = ref({
  paddingLeft: '52%',
  marginRight: '92px',
  nestedPaddingLeft: '101px',
  nodeSpacing: '40px',
  compactFromLevel: 3,
  connectionLine: {
    width: '11px',
    height: '56px',
    offset: '-6px',
    color: '#47A7F3'
  },
  firstNode: {
    connectionHeight: '70px',
    connectionTop: '-14px'
  },
  textAlign: 'left' as const
})

// 自定义节点模板
const nodeTemplate = (data: Record<string, any>): string => {
  return `
    <div class="title node-name">${data.name || ''}</div>
    <div class="content node-title">${data.department || ''}</div>
  `
}

// 组织结构数据
const orgData = {
  id: 1,
  name: '张三 - CEO',
  department: '总经理办公室',
  children: [
    {
      id: 2,
      name: '李四 - CTO',
      department: '总经理办公室',
      children: [
        {
          id: 4,
          name: '王五 - 前端工程师',
          department: '总经理办公室',
          children: [
            { id: 10, name: '前端实习生A', department: '总经理办公室' },
            { id: 11, name: '前端实习生B', department: '总经理办公室' }
          ]
        },
        {
          id: 5,
          name: '赵六 - 后端工程师',
          department: '总经理办公室',
          children: [
            { id: 12, name: '后端实习生A', department: '总经理办公室' }
          ]
        },
        { id: 7, name: '周九 - 测试工程师', department: '总经理办公室' }
      ]
    },
    {
      id: 3,
      name: '钱七 - CFO',
      department: '总经理办公室',
      children: [
        {
          id: 6,
          name: '孙八 - 财务经理',
          department: '总经理办公室',
          children: [
            { id: 13, name: '财务助理A', department: '总经理办公室' },
            { id: 14, name: '财务助理B', department: '总经理办公室' },
            { id: 15, name: '财务助理C', department: '总经理办公室' }
          ]
        },
        { id: 8, name: '吴十 - 会计', department: '总经理办公室' }
      ]
    },
    { id: 9, name: '郑十一 - COO', department: '总经理办公室' }
  ]
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e1e5e9;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  color: #303133;
  margin-bottom: 16px;
}

.controls {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.control-label {
  font-weight: 500;
  color: #303133;
  margin-right: 4px;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #606266;
}

.controls input[type="radio"],
.controls input[type="checkbox"] {
  margin: 0;
}

.controls input[type="text"] {
  font-size: 14px;
}

.root-node-editor {
  background: #e8f4fd;
  border: 1px solid #b3d8ff;
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chart-container {
  flex: 1;
  background: #f5f7fa;
  overflow: auto;
  padding: 20px;
}

/* 自定义节点样式 */
.orgchart .node .title.node-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 10px 12px;
  border-radius: 4px 4px 0 0;
  text-align: center;
  line-height: 1.4;
  margin-bottom: 0;
}

.orgchart .node .content.node-title {
  font-size: 13px;
  color: #606266;
  background: #fff;
  padding: 8px 12px;
  border-radius: 0 0 4px 4px;
  text-align: center;
  border-top: 1px solid #e4e7ed;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 节点悬停效果 */
.orgchart .node:hover .title.node-name {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.orgchart .node:hover .content.node-title {
  background: #f5f7fa;
  border-top-color: #c0c4cc;
  transition: all 0.3s ease;
}

/* 节点选中状态 */
.orgchart .node.selected .title.node-name {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.orgchart .node.selected .content.node-title {
  background: #fff5f7;
  border-top-color: #f5576c;
}

/* 根节点特殊样式 */
.orgchart > .nodes > .hierarchy > .node .title.node-name {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  font-size: 18px;
  padding: 12px 16px;
}

.orgchart > .nodes > .hierarchy > .node .content.node-title {
  font-size: 14px;
  padding: 10px 16px;
}
</style>
