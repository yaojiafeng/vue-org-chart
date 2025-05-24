# vue-org-chart

A Vue.js 2.7 organization chart component.

## Installation

```bash
npm install vue-org-chart
```

## Usage

```javascript
import Vue from 'vue'
import OrgChart from 'vue-org-chart'

Vue.use(OrgChart)
```

```vue
<template>
  <org-chart
    :data="orgData"
    :horizontal="false"
    :collapsable="true"
    :label-width="160"
    :label-height="80"
  />
</template>

<script>
export default {
  data() {
    return {
      orgData: {
        name: 'CEO',
        title: 'Chief Executive Officer',
        children: [
          {
            name: 'Manager',
            title: 'Department Manager',
            children: [
              { name: 'Staff 1', title: 'Staff' },
              { name: 'Staff 2', title: 'Staff' }
            ]
          }
        ]
      }
    }
  }
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Object | {} | Organization chart data |
| horizontal | Boolean | false | Whether to display the chart horizontally |
| collapsable | Boolean | true | Whether nodes can be collapsed |
| labelWidth | String/Number | 'auto' | Width of node labels |
| labelHeight | String/Number | 'auto' | Height of node labels |

## Development

```bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run serve

# Build for production
npm run build

# Build component library
npm run lib

# Lint and fix files
npm run lint
```

## License

MIT