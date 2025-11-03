import type { VNode } from 'vue'

export interface OrgChartNode {
  id: string | number
  name: string
  title?: string
  avatar?: string
  children?: OrgChartNode[]
  [key: string]: any
}

export interface OrgChartProps {
  data: OrgChartNode
  direction?: 'horizontal' | 'vertical'
  nodeWidth?: number
  nodeHeight?: number
  spacing?: {
    horizontal: number
    vertical: number
  }
  showAvatar?: boolean
  showTitle?: boolean
  nodeClass?: string
  lineClass?: string
  customNode?: (node: OrgChartNode) => VNode
}

export interface OrgChartEmits {
  (e: 'node-click', node: OrgChartNode): void
  (e: 'node-hover', node: OrgChartNode): void
}
