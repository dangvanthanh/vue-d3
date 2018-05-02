<template>
  <div>
    <h1>Bar Chart</h1>
    <svg :width="width" :height="height">
      <rect
        v-for="(d, i) in data"
        :key="i"
        :width="w"
        :height="calcHeight(d)"
        :x="xScale(d)"
        :y="yScale(d)"
        stroke="#ff6347"
        strokeWidth="3"
        fill="#f5f5f5"/>
    </svg>
  </div>
</template>

<script>
import { scaleBand, scaleLinear } from 'd3-scale';

const data = [
  {
    x: 0,
    y: 1,
  },
  {
    x: 1,
    y: 50,
  },
  {
    x: 2,
    y: 100,
  },
  {
    x: 3,
    y: 150,
  },
  {
    x: 4,
    y: 200,
  },
  {
    x: 5,
    y: 250,
  },
  {
    x: 6,
    y: 300,
  },
  {
    x: 7,
    y: 350,
  },
  {
    x: 8,
    y: 400,
  },
  {
    x: 9,
    y: 450,
  },
  {
    x: 10,
    y: 500,
  },
];

const xSelector = d => d.x;
const ySelector = d => d.y;

const xScale = scaleBand().range([0, 500]).domain(data.map(d => xSelector(d))).padding(0.3);
const yScale = scaleLinear().range([500, 0]).domain([0, 500]);

export default {
  name: 'BarChart',
  data () {
    return {
      width: 500,
      height: 500,
      w: xScale.bandwidth(),
      data: data
    }
  },
  methods: {
    yScale: function (d) {
      return yScale(ySelector(d));
    },
    xScale: function (d) {
      return xScale(xSelector(d));
    },
    calcHeight: function (d) {
      const yValue = yScale(ySelector(d));
      const barHeight = this.height - yValue;
      return barHeight;
    }
  }
}
</script>

<style>
</style>
