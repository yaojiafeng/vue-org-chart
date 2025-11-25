<template>
  <div id="app">
    <header class="app-header">
      <h1>Vue Org Chart Demo</h1>
      <div class="controls">
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
    </header>

    <main class="app-main">
      <div class="chart-container">
        <OrgChart
          :datasource="orgData"
          :direction="direction"
          :draggable="draggable"
          :zoom="zoom"
          :pan="pan"
          node-content="title"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { OrgChart } from '@org-chart'

const direction = ref<'t2b' | 'b2t' | 'l2r' | 'r2l'>('t2b')
const draggable = ref(false)
const zoom = ref(false)
const pan = ref(false)

// orgchart 插件需要的数据格式
const orgData = {
  id: 1,
  title: '张三 - CEO',
  children: [
    {
      id: 2,
      title: '李四 - CTO',
      children: [
        {
          id: 4,
          title: '王五 - 前端工程师'
        },
        {
          id: 5,
          title: '赵六 - 后端工程师'
        }
      ]
    },
    {
      id: 3,
      title: '钱七 - CFO',
      children: [
        {
          id: 6,
          title: '孙八 - 财务经理'
        }
      ]
    }
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
  padding: 20px;
}
</style>
