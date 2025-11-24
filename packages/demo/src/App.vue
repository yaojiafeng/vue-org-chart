<template>
  <div id="app">
    <header class="app-header">
      <h1>Vue Org Chart Demo</h1>
      <div class="controls">
        <label>
          <input
            v-model="direction"
            type="radio"
            value="vertical"
          />
          垂直布局
        </label>
        <label>
          <input
            v-model="direction"
            type="radio"
            value="horizontal"
          />
          水平布局
        </label>
        <label>
          <input
            v-model="showAvatar"
            type="checkbox"
          />
          显示头像
        </label>
        <label>
          <input
            v-model="showTitle"
            type="checkbox"
          />
          显示职位
        </label>
      </div>
    </header>

    <main class="app-main">
      <div class="chart-container">
        <OrgChart
          :data="orgData"
          :direction="direction"
          :show-avatar="showAvatar"
          :show-title="showTitle"
          @node-click="handleNodeClick"
          @node-hover="handleNodeHover"
        />
      </div>

      <div class="info-panel">
        <h3>点击的节点信息：</h3>
        <pre v-if="clickedNode">{{ JSON.stringify(clickedNode, null, 2) }}</pre>
        <p v-else>点击节点查看信息</p>

        <h3>悬停的节点信息：</h3>
        <pre v-if="hoveredNode">{{ JSON.stringify(hoveredNode, null, 2) }}</pre>
        <p v-else>悬停节点查看信息</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { OrgChart } from '@org-chart'
import type { OrgChartNode } from '@org-chart'

const direction = ref<'horizontal' | 'vertical'>('vertical')
const showAvatar = ref(true)
const showTitle = ref(true)
const clickedNode = ref<OrgChartNode | null>(null)
const hoveredNode = ref<OrgChartNode | null>(null)

const orgData: OrgChartNode = {
  id: 1,
  name: '张三',
  title: 'CEO',
  avatar: 'https://via.placeholder.com/40x40/409eff/ffffff?text=张',
  children: [
    {
      id: 2,
      name: '李四',
      title: 'CTO',
      avatar: 'https://via.placeholder.com/40x40/67c23a/ffffff?text=李',
      children: [
        {
          id: 4,
          name: '王五',
          title: '前端工程师',
          avatar: 'https://via.placeholder.com/40x40/e6a23c/ffffff?text=王'
        },
        {
          id: 5,
          name: '赵六',
          title: '后端工程师',
          avatar: 'https://via.placeholder.com/40x40/f56c6c/ffffff?text=赵'
        }
      ]
    },
    {
      id: 3,
      name: '钱七',
      title: 'CFO',
      avatar: 'https://via.placeholder.com/40x40/909399/ffffff?text=钱',
      children: [
        {
          id: 6,
          name: '孙八',
          title: '财务经理',
          avatar: 'https://via.placeholder.com/40x40/409eff/ffffff?text=孙'
        }
      ]
    }
  ]
}

const handleNodeClick = (node: OrgChartNode) => {
  clickedNode.value = node
  console.log('点击节点:', node)
}

const handleNodeHover = (node: OrgChartNode) => {
  hoveredNode.value = node
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

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chart-container {
  flex: 1;
  background: #f5f7fa;
  overflow: auto;
}

.info-panel {
  width: 300px;
  background: #fff;
  border-left: 1px solid #e1e5e9;
  padding: 20px;
  overflow-y: auto;
}

.info-panel h3 {
  color: #303133;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-panel pre {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-all;
  margin-bottom: 20px;
}

.info-panel p {
  color: #909399;
  font-size: 12px;
  margin-bottom: 20px;
}
</style>
