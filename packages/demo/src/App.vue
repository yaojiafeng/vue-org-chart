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
</style>
