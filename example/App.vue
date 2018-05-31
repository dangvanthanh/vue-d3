<template>
  <div class="app" id="app">
    <div class="grid">
      <div class="grid__item">
        <h1>Bar Chart</h1>
        <bar-chart :data="dataChart"/>
      </div>
      <div class="grid__item">
        <h1>Line Chart</h1>
        <line-chart :data="dataChart"/>
      </div>
      <div class="grid__item">
        <h1>Scatter Chart</h1>
        <scatter-chart :data="dataChart"/>
      </div>
      <div class="grid__item">
        <h1>New Bar Chart (No Axis)</h1>
        <svg width="100%" height="500">
          <new-bar-chart :data="dataChart" width="400" height="400" x="50" y="50"/>
        </svg>
      </div>
      <div class="grid__item">
        <h1>Pie Chart</h1>
        <svg width="100%" height="500">
          <pie-chart :data="dataChart" width="400" height="400" x="270" y="270"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { BarChart, LineChart, ScatterChart, NewBarChart, PieChart } from '../src/';
import { data } from './store';

export default {
  name: 'app',
  data () {
    return {
      dataChart: data
    }
  },
  components: {
    BarChart,
    LineChart,
    ScatterChart,
    NewBarChart,
    PieChart
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
