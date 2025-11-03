<template>
  <div class="org-chart-node-wrapper">
    <div
      class="org-chart-node"
      :class="[nodeClass, { 'has-children': hasChildren }]"
      :style="nodeStyle"
      @click="handleNodeClick"
      @mouseenter="handleNodeHover"
    >
      <slot name="node" :node="node">
        <div v-if="customNode" class="custom-node">
          <component :is="customNode(node)" />
        </div>
        <div v-else class="default-node">
          <div v-if="showAvatar && node.avatar" class="node-avatar">
            <img :src="node.avatar" :alt="node.name" />
          </div>
          <div class="node-content">
            <div class="node-name">{{ node.name }}</div>
            <div v-if="showTitle && node.title" class="node-title">
              {{ node.title }}
            </div>
          </div>
        </div>
      </slot>
    </div>

    <!-- 连接线 -->
    <div v-if="hasChildren" class="org-chart-lines" :class="lineClass">
      <div
        v-for="(child, index) in node.children"
        :key="child.id"
        class="org-chart-line"
        :class="`line-${index}`"
      ></div>
    </div>

    <!-- 子节点 -->
    <div v-if="hasChildren" class="org-chart-children">
      <OrgChartNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :direction="direction"
        :node-width="nodeWidth"
        :node-height="nodeHeight"
        :spacing="spacing"
        :show-avatar="showAvatar"
        :show-title="showTitle"
        :node-class="nodeClass"
        :line-class="lineClass"
        :custom-node="customNode"
        @node-click="$emit('node-click', $event)"
        @node-hover="$emit('node-hover', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrgChartNode, OrgChartProps } from '../types'

interface Props extends Partial<OrgChartProps> {
  node: OrgChartNode
  level: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'node-click': [node: OrgChartNode]
  'node-hover': [node: OrgChartNode]
}>()

const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

const nodeStyle = computed(() => ({
  width: `${props.nodeWidth || 200}px`,
  height: `${props.nodeHeight || 80}px`
}))

const handleNodeClick = () => {
  emit('node-click', props.node)
}

const handleNodeHover = () => {
  emit('node-hover', props.node)
}
</script>

<style scoped>
.org-chart-node-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.org-chart-node {
  background: #fff;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
  min-height: 80px;
}

.org-chart-node:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.default-node {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.node-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.node-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.node-content {
  flex: 1;
  min-width: 0;
}

.node-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-title {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.org-chart-lines {
  position: relative;
  width: 100%;
  height: 20px;
}

.org-chart-line {
  position: absolute;
  background: #e1e5e9;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
}

.org-chart-children {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

/* 水平布局 */
.vue-org-chart--horizontal .org-chart-children {
  flex-direction: row;
}

.vue-org-chart--horizontal .org-chart-line {
  width: 100%;
  left: 0;
}

/* 垂直布局 */
.vue-org-chart--vertical .org-chart-children {
  flex-direction: column;
}

.vue-org-chart--vertical .org-chart-line {
  width: 2px;
  height: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
