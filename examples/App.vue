<template>
  <div id="app">
    <h1>Vue Organization Chart Demo</h1>
    <org-chart
      :datasource="orgData"
    />
  </div>
</template>

<script>
import { treeData } from './tree'
export default {
  name: 'App',
  data() {
    return {
      orgData: treeData.data
    }
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