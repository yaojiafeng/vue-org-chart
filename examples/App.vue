<template>
  <div id="app">
    <h1>Vue Organization Chart Demo</h1>
    <org-chart
      :datasource="orgData"
      nodeContent="title"
      :verticalLevel="4"
      :visibleLevel="4"
      direction="t2b"
      :draggable="false"
      :pan="false"
      :zoom="zoom"
      :toggleSiblingsResp="false"
      chartClass=""
      :nodeClassColors="{}"
      height="fit-content"
    />
  </div>
</template>

<script>
import { treeData } from './tree'
export default {
  name: 'App',
  data() {
    return {
      orgData: treeData.data,
      zoom: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.zoom = true
      console.log('zoom', this.zoom)
    }, 5000)
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 1200px;
}

h1 {
  margin-bottom: 40px;
}
</style> 