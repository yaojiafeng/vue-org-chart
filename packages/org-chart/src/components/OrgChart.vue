<template>
  <div class="vue-org-chart" :class="chartClass">
    <div class="org-chart-container">
      <OrgChartNode
        :node="data"
        :level="0"
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
import type { OrgChartProps, OrgChartEmits } from '../types'
import OrgChartNode from './OrgChartNode.vue'

const props = defineProps<OrgChartProps>()
defineEmits<OrgChartEmits>()

const chartClass = computed(() => ({
  'vue-org-chart--horizontal': props.direction === 'horizontal',
  'vue-org-chart--vertical': props.direction === 'vertical'
}))
</script>

<style scoped>
.vue-org-chart {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.org-chart-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  padding: 20px;
}
</style>
