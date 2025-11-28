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
              value="standard"
            />
            标准布局
          </label>
          <label>
            <input
              v-model="layoutMode"
              type="radio"
              value="compact"
            />
            Compact 布局
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
          :compact-layout="compactLayoutConfig"
          node-content="title"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { OrgChart } from '@org-chart'

const layoutMode = ref<'standard' | 'compact'>('standard')
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

// orgchart 插件需要的数据格式
// 第二层有3个节点，其中一个没有子节点，另外的有子节点，形成对比
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
          title: '王五 - 前端工程师',
          children: [
            {
              id: 10,
              title: '前端实习生A'
            },
            {
              id: 11,
              title: '前端实习生B'
            }
          ]
        },
        {
          id: 5,
          title: '赵六 - 后端工程师',
          children: [
            {
              id: 12,
              title: '后端实习生A'
            }
          ]
        },
        {
          id: 7,
          title: '周九 - 测试工程师'
        }
      ]
    },
    {
      id: 3,
      title: '钱七 - CFO',
      children: [
        {
          id: 6,
          title: '孙八 - 财务经理',
          children: [
            {
              id: 13,
              title: '财务助理A'
            },
            {
              id: 14,
              title: '财务助理B'
            },
            {
              id: 15,
              title: '财务助理C'
            }
          ]
        },
        {
          id: 8,
          title: '吴十 - 会计'
        }
      ]
    },
    {
      id: 9,
      title: '郑十一 - COO'
      // 这个节点没有子节点，用于对比
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
