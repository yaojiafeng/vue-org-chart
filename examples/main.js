import Vue from 'vue'
import App from './App.vue'
import OrgChart from '../src/index'

Vue.use(OrgChart)

new Vue({
  render: h => h(App)
}).$mount('#app') 