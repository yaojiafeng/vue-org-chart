# vue-org-chart

Vue 3 组织架构图组件。

## 安装

```bash
npm install vue-org-chart
# 或
pnpm add vue-org-chart
# 或
yarn add vue-org-chart
```

## 使用

### 全局注册

```typescript
import { createApp } from 'vue'
import VueOrgChart from 'vue-org-chart'
import 'vue-org-chart/dist/style.css'

const app = createApp(App)
app.use(VueOrgChart)
```

### 按需引入

```vue
<template>
  <OrgChart :data="orgData" />
</template>

<script setup>
import { OrgChart } from 'vue-org-chart'
import 'vue-org-chart/dist/style.css'
</script>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | OrgChartNode | - | 组织架构数据 |
| direction | 'horizontal' \| 'vertical' | 'vertical' | 布局方向 |
| nodeWidth | number | 200 | 节点宽度 |
| nodeHeight | number | 80 | 节点高度 |
| spacing | { horizontal: number, vertical: number } | { horizontal: 20, vertical: 20 } | 节点间距 |
| showAvatar | boolean | true | 是否显示头像 |
| showTitle | boolean | true | 是否显示职位 |
| nodeClass | string | - | 节点自定义类名 |
| lineClass | string | - | 连接线自定义类名 |
| customNode | (node: OrgChartNode) => VNode | - | 自定义节点渲染函数 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| node-click | node: OrgChartNode | 节点点击事件 |
| node-hover | node: OrgChartNode | 节点悬停事件 |

### Types

```typescript
interface OrgChartNode {
  id: string | number
  name: string
  title?: string
  avatar?: string
  children?: OrgChartNode[]
  [key: string]: any
}
```

## 示例

```vue
<template>
  <OrgChart
    :data="orgData"
    direction="vertical"
    :show-avatar="true"
    :show-title="true"
    @node-click="handleNodeClick"
  />
</template>

<script setup>
import { ref } from 'vue'
import { OrgChart } from 'vue-org-chart'

const orgData = ref({
  id: 1,
  name: '张三',
  title: 'CEO',
  avatar: 'https://example.com/avatar.jpg',
  children: [
    {
      id: 2,
      name: '李四',
      title: 'CTO',
      children: [
        {
          id: 3,
          name: '王五',
          title: '前端工程师'
        }
      ]
    }
  ]
})

const handleNodeClick = (node) => {
  console.log('点击节点:', node)
}
</script>
```
