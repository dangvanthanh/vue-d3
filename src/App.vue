<template>
  <div class="app" id="app">
    <div class="grid">
      <bar-chart />
      <line-chart />
      <scatter-chart />
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue';
import LineChart from '@/components/LineChart.vue';
import ScatterChart from '@/components/ScatterChart.vue';

export default {
  name: 'app',
  components: {
    BarChart,
    LineChart,
    ScatterChart
  }
}
</script>

<style>
body {
    margin: 0;
}

.app {
    margin-top: 20px;
    max-width: 1020px;
    margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 500px);
  grid-gap: 20px;
}
</style>
