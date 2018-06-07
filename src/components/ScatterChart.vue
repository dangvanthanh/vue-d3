<template>
  <svg :width="width" :height="height" ref="svg">
    <g ref="chart"></g>
    <g ref="circle"></g>
    <g ref="axis"></g>
  </svg>
</template>

<script>
import * as d3 from 'd3';
import { xSelector, ySelector } from '../utils';

export default {
  name: 'ScatterChart',
  props: ['data'],
  data() {
    return {
      width: 500,
      height: 500,
      path: ''
    }
  },
  mounted() {
    const xScale = d3
      .scaleLinear()
      .range([0, 400])
      .domain([0, 10]);
    const yScale = d3
      .scaleLinear()
      .range([420, 0])
      .domain([0, 420]);
    const path = d3
      .line()
      .x(d => xScale(xSelector(d)))
      .y(d => yScale(ySelector(d)));
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

    this.data.forEach((d, i) => {
      d3
        .select(this.$refs.circle)
        .attr('transform', `translate(130, ${margin.top})`)
        .append('circle')
        .attr('cx', this.xPoint(d))
        .attr('cy', this.yPoint(d))
        .attr('r', '5')
        .attr('stroke', '#fff')
        .attr('strokeWidth', 2)
        .attr('fill', '#ff6347');
    });
  },
  methods: {
    xPoint(d) {
      const xScale = d3
        .scaleLinear()
        .range([0, 400])
        .domain([0, 10]);
      const yScale = d3
        .scaleLinear()
        .range([420, 0])
        .domain([0, 420]);
      return yScale(ySelector(d));
    },
    yPoint(d) {
      const xScale = d3
        .scaleLinear()
        .range([0, 400])
        .domain([0, 10]);
      const yScale = d3
        .scaleLinear()
        .range([420, 0])
        .domain([0, 420]);
      return xScale(xSelector(d));
    }
  }
}
</script>

<style>
</style>
