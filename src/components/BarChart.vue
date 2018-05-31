<template>
  <svg :width="width" :height="height">
    <g ref="chart">
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
    </g>
    <g ref="axis"></g>
  </svg>
</template>

<script>
import * as d3 from 'd3';
import { xSelector, ySelector } from '../utils';

export default {
  name: 'BarChart',
  props: ['data'],
  data() {
    return {
      width: 500,
      height: 500,
      w: 0
    };
  },
  mounted() {
    const xScale = d3
      .scaleBand()
      .range([0, 400])
      .domain(this.data.map(d => xSelector(d)))
      .padding(0.3);
    const yScale = d3
      .scaleLinear()
      .range([420, 0])
      .domain([0, 500]);

    const margin = { top: 40, left: 40, bottom: 40, right: 0 };
    const yAxis = d3.axisLeft(yScale).tickSizeInner(-420);
    const xAxis = d3.axisBottom(xScale);

    const chartWidth = this.width - (margin.left + margin.right);
    const chartHeight = this.height - (margin.top + margin.bottom);

    this.w = xScale.bandwidth();

    d3
      .select(this.$refs.chart)
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    d3
      .select(this.$refs.axis)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('class', 'axis y')
      .call(yAxis);

    d3
      .select(this.$refs.axis)
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left}, ${chartHeight + margin.top})`
      )
      .attr('class', 'axis x')
      .call(xAxis);
  },
  methods: {
    yScale: function(d) {
      const yScale = d3
        .scaleLinear()
        .range([420, 0])
        .domain([0, 500]);
      return yScale(ySelector(d));
    },
    xScale: function(d) {
      const xScale = d3
        .scaleBand()
        .range([0, 400])
        .domain(this.data.map(d => xSelector(d)))
        .padding(0.3);
      return xScale(xSelector(d));
    },
    calcHeight: function(d) {
      const yScale = d3
        .scaleLinear()
        .range([420, 0])
        .domain([0, 500]);
      const margin = { top: 40, left: 100, bottom: 40, right: 0 };

      const chartHeight = this.height - (margin.top + margin.bottom);

      const yValue = yScale(ySelector(d));
      const barHeight = chartHeight - yValue;
      return barHeight;
    }
  }
};
</script>

<style>
.tick line {
  stroke-dasharray: 2 2;
  stroke: #ccc;
}
</style>
