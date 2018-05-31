<template>
  <svg :width="width" :height="height" ref="svg">
    <g ref="chart">
      <path :d="path" stroke="#ff6347" strokeWidth="3" fill="none" />
    </g>
    <g ref="circle"></g>
    <g ref="axis"></g>
  </svg>
</template>

<script>
import * as d3 from 'd3';
import { xSelector, ySelector } from '../utils';

export default {
  name: 'LineChart',
  props: ['data'],
  data() {
    return {
      width: 500,
      height: 500,
      path: '',
      selected: null
    };
  },
  mounted() {
    const xScale = d3
      .scaleLinear()
      .range([0, 400])
      .domain([0, 10]);
    const yScale = d3
      .scaleLinear()
      .range([0, 420])
      .domain([0, 500]);
    const path = d3
      .line()
      .x(d => xScale(xSelector(d)))
      .y(d => yScale(ySelector(d)))
      .curve(d3.curveStep);
    this.path = path(this.data);

    const margin = { top: 40, left: 40, bottom: 40, right: 0 };
    const yAxis = d3.axisLeft(yScale).tickSizeInner(-420);
    const xAxis = d3.axisBottom(xScale);

    const chartWidth = this.width - (margin.left + margin.right);
    const chartHeight = this.height - (margin.top + margin.bottom);

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
    xPoint: function(d) {
      const yScale = d3
        .scaleLinear()
        .range([0, 420])
        .domain([0, 500]);
      return yScale(ySelector(d));
    },
    yPoint: function(d) {
      const xScale = d3
        .scaleLinear()
        .range([0, 400])
        .domain([0, 10]);
      return xScale(xSelector(d));
    }
  }
};
</script>

<style>
</style>
