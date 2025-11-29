# @yxst/vue-org-chart

Vue 3 组织架构图组件。

## 安装

```bash
npm install @yxst/vue-org-chart
# 或
pnpm add @yxst/vue-org-chart
# 或
yarn add @yxst/vue-org-chart
```

## 快速上手

### 全局注册

```typescript
import { createApp } from 'vue'
import VueOrgChart from '@yxst/vue-org-chart'
import '@yxst/vue-org-chart/dist/style.css'

const app = createApp(App)
app.use(VueOrgChart)
```

### 按需引入

```vue
<template>
  <OrgChart
    :datasource="orgData"
    :layout-mode="'compact'"
    :direction="'t2b'"
    :node-title="'name'"
    :node-content="'department'"
  />
</template>

<script setup>
import { OrgChart } from '@yxst/vue-org-chart'
import '@yxst/vue-org-chart/dist/style.css'
</script>
```

### 用法示例

```vue
<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { OrgChart } from '@yxst/vue-org-chart'
import '@yxst/vue-org-chart/dist/style.css'

const layoutMode = ref<'standard' | 'compact'>('compact')
const direction = ref<'t2b' | 'b2t' | 'l2r' | 'r2l'>('t2b')
const draggable = ref(false)
const zoom = ref(false)
const pan = ref(false)

// Compact 布局配置
const compactLayoutConfig = ref({
  paddingLeft: '52%',
  marginRight: '92px',
  nestedPaddingLeft: '101px',
  nodeSpacing: '40px',
  compactFromLevel: 3,
  connectionLine: {
    width: '11px',
    height: '56px',
    offset: '-8px',
    color: '#47A7F3'
  },
  firstNode: {
    connectionHeight: '96px',
    connectionTop: '-40px'
  },
  textAlign: 'left' as const
})

// 自定义节点模板（返回 HTML 字符串）
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
```

## 组件 API

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `datasource` | `Record<string, any>` | **必填** | 组织结构数据源，字段结构与 jQuery orgchart 插件一致（`id` / `name` / `children` 等） |
| `node-content` | `string` | `'content'` | 节点内容字段名，对应 `datasource` 中显示在节点正文区域的字段，如 `department` |
| `node-title` | `string` | `'title'` | 节点标题字段名，对应 `datasource` 中显示在节点标题区域的字段，如 `name` |
| `layout-mode` | `'standard' \| 'compact'` | `'standard'` | 布局模式：标准模式或紧凑模式（竖向压缩，适合大量层级） |
| `direction` | `'t2b' \| 'b2t' \| 'l2r' \| 'r2l'` | `'t2b'` | 标准模式下的布局方向：自上而下 / 自下而上 / 自左到右 / 自右到左 |
| `vertical-level` | `number` | `undefined` | 在标准模式下，从第几层开始垂直布局（插件原生参数） |
| `visible-level` | `number` | `999` | 初始可见层级，超出层级默认折叠 |
| `draggable` | `boolean` | `false` | 是否允许拖拽节点调整组织结构 |
| `pan` | `boolean` | `false` | 是否允许拖动画布平移 |
| `zoom` | `boolean` | `false` | 是否允许缩放 |
| `zoomin-limit` | `number` | `7` | 最大放大倍数 |
| `zoomout-limit` | `number` | `0.5` | 最小缩小倍数 |
| `toggle-siblings-resp` | `boolean` | `false` | 是否响应兄弟节点折叠/展开（插件原生参数） |
| `chart-class` | `string` | `''` | 传给内部 orgchart 容器的自定义类名 |
| `node-id` | `string` | `'id'` | 数据源中唯一标识字段名 |
| `parent-node-symbol` | `string` | `'oci-menu'` | 父节点图标类名 |
| `export-button` | `boolean` | `false` | 是否显示导出按钮 |
| `export-button-name` | `string` | `'Export'` | 导出按钮文案 |
| `export-filename` | `string` | `'Orgchart'` | 导出文件名 |
| `export-fileextension` | `'png' \| 'pdf'` | `'png'` | 导出文件类型 |
| `icons` | `Icons` | `undefined` | 自定义图标配置（覆盖默认的展开/收起图标等） |
| `compact` | `(data: Record<string, any>) => boolean` | `undefined` | 判断某个节点是否使用紧凑模式的函数（高级用法） |
| `compact-layout` | `CompactLayoutConfig` | `undefined` | 全局紧凑布局样式配置（见下文） |
| `node-template` | `(data: Record<string, any>) => string` | `undefined` | 自定义节点模板，返回 HTML 字符串（参考 demo） |
| `create-node` | `($node, data) => void` | `undefined` | 节点创建回调，可在这里绑定自定义事件或改 DOM |
| `drop-criteria` | `(draggedNode, dragZone, dropZone) => boolean` | `undefined` | 拖拽放置前的校验函数，返回 `true` 才允许放置 |
| `init-completed` | `($chart) => void` | `undefined` | orgchart 初始化完成回调，参数为 jQuery 包装的图表根元素 |

### CompactLayoutConfig

```ts
interface CompactLayoutConfig {
  paddingLeft?: string | number       // 根节点左侧偏移，默认: '52%'
  marginRight?: string | number       // 右侧边距，默认: '92px'
  nestedPaddingLeft?: string | number // 嵌套层级左侧偏移，默认: '101px'
  nodeSpacing?: string | number       // 节点垂直间距，默认: '20px' / '40px'
  textAlign?: 'left' | 'center' | 'right'
  compactFromLevel?: number           // 从第几层开始使用 Compact 布局，默认: 3
  connectionLine?: {
    width?: string | number           // L 形连接线宽度，默认: '11px'
    height?: string | number          // 垂直线高度，默认: '56px'
    offset?: string | number          // 左侧偏移，默认: '-8px'
    color?: string                    // 线条颜色，默认: '#47A7F3'
  }
  firstNode?: {
    connectionHeight?: string | number // 首节点连接线高度，默认: '70px'
    connectionTop?: string | number    // 首节点连接线顶部偏移，默认: '-20px'
  }
}
```

### 事件（通过 Vue `emit` 暴露）

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `nodedrop` | `(draggedNode, dragZone, dropZone)` | 节点拖拽放置完成 |
| `init` | `(chart)` | 图表初始化完成，`chart` 为内部 orgchart 实例 |
| `show-parent` / `hide-parent` | 无 | 展开 / 收起父节点时触发 |
| `show-children` / `hide-children` | 无 | 展开 / 收起子节点时触发 |
| `show-siblings` / `hide-siblings` | 无 | 展开 / 收起兄弟节点时触发 |

### 方法（通过组件 ref 调用）

组件内部通过 `defineExpose` 暴露了一系列方法，你可以这样使用：

```vue
<template>
  <OrgChart ref="orgChartRef" :datasource="orgData" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { OrgChart } from '@yxst/vue-org-chart'

type OrgChartInstance = ComponentPublicInstance<{
  init: (options?: Record<string, any>) => void
  getHierarchy: (includeNodeData?: boolean) => any
  export: (filename?: string, ext?: 'png' | 'pdf') => void
  // 以及其他操作节点的方法...
}>

const orgChartRef = ref<OrgChartInstance | null>(null)

onMounted(() => {
  const api = orgChartRef.value
  api?.export?.('OrgChart', 'png')
})
</script>
```

可用的方法包括（部分）：

- **结构操作**
  - `addAncestors(data, parentId)`
  - `addDescendants(data[], $parent)`
  - `addParent(data)`
  - `addSiblings($node, data[])`
  - `addChildren($node, data[])`
  - `removeNodes($node)`
- **关系获取**
  - `getHierarchy(includeNodeData?)`
  - `getParent($node)` / `getSiblings($node)` / `getChildren($node)`
  - `getNodeState($node, relation)` / `getRelatedNodes($node, relation)`
- **显示 / 折叠控制**
  - `hideParent($node)` / `showParent($node)`
  - `hideChildren($node)` / `showChildren($node)`
  - `hideSiblings($node, direction?)` / `showSiblings($node, direction?)`
- **视图控制**
  - `setChartScale($chart, newScale)`：设置缩放比例
  - `export(filename?, ext?)`：导出为 `png` / `pdf`
  - `getChartInstance()`：获取内部 orgchart 实例

> ⚠️ 以上方法中的 `$node` / `$chart` 参数为 jQuery 对象，具体使用方式可参考 [OrgChart 插件文档](https://github.com/dabeng/OrgChart)。

## 示例

```vue
<template>
  <OrgChart
    :datasource="orgData"
    :layout-mode="'compact'"
    :direction="'t2b'"
    :node-title="'name'"
    :node-content="'department'"
  />
</template>

<script setup>
import { ref } from 'vue'
import { OrgChart } from '@yxst/vue-org-chart'
import '@yxst/vue-org-chart/dist/style.css'

const orgData = ref({
  id: 1,
  name: '张三 - CEO',
  department: '总经理办公室',
  children: [
    { id: 2, name: '李四 - CTO', department: '总经理办公室' },
    { id: 3, name: '钱七 - CFO', department: '总经理办公室' },
    { id: 4, name: '郑十一 - COO', department: '总经理办公室' }
  ]
})
</script>
```
