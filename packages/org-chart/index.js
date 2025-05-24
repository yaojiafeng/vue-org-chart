import OrgChart from './src/org-chart.vue'

OrgChart.install = function(Vue) {
  Vue.component(OrgChart.name, OrgChart)
}

export default OrgChart 