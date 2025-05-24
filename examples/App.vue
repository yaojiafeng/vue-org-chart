<template>
  <div id="app">
    <h1>Vue Organization Chart Demo</h1>
    <org-chart
      :data="orgData"
      :horizontal="false"
      :collapsable="true"
      :label-width="160"
      :label-height="80"
    />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      orgData: {
        name: 'CEO',
        title: 'Chief Executive Officer',
        children: [
          {
            name: 'CTO',
            title: 'Chief Technology Officer',
            children: [
              {
                name: 'Team Lead 1',
                title: 'Development Team Lead',
                children: [
                  { name: 'Developer 1', title: 'Software Developer' },
                  { name: 'Developer 2', title: 'Software Developer' }
                ]
              },
              {
                name: 'Team Lead 2',
                title: 'Development Team Lead',
                children: [
                  { name: 'Developer 3', title: 'Software Developer' },
                  { name: 'Developer 4', title: 'Software Developer' }
                ]
              }
            ]
          },
          {
            name: 'CFO',
            title: 'Chief Financial Officer',
            children: [
              { name: 'Accountant 1', title: 'Senior Accountant' },
              { name: 'Accountant 2', title: 'Junior Accountant' }
            ]
          }
        ]
      }
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