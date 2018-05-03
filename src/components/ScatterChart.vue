<template>
  <div>
    <h1>Scatter Chart</h1>
    <svg :width="width" :height="height" ref="svg">
      <g ref="chart"></g>
      <g ref="circle"></g>
      <g ref="axis"></g>
    </svg>
  </div>
</template>

<script>
import { select } from 'd3-selection';
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { line, curveStep } from 'd3-shape';
import { data } from '../store';

const xSelector = d => d.x;
const ySelector = d => d.y;

const xScale = scaleLinear().range([0, 400]).domain([0, 10]);
const yScale = scaleLinear().range([420, 0]).domain([0, 420]);

export default {
  name: 'LineChart',
  data () {
    return {
      width: 500,
      height: 500,
      data: data,
      path: '',
    }
  },
  mounted () {
    const path = line().x(d => xScale(xSelector(d))).y(d => yScale(ySelector(d)));
    this.path = path(data);

    const margin = { top: 40, left: 40, bottom: 40, right: 0 };
    const yAxis = axisLeft(yScale).tickSizeInner(-420);
    const xAxis = axisBottom(xScale);

    const chartWidth = this.width - (margin.left + margin.right);
    const chartHeight = this.height - (margin.top + margin.bottom);

    select(this.$refs.chart)
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    select(this.$refs.axis).append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('class', 'axis y')
      .call(yAxis);

    select(this.$refs.axis).append('g')
      .attr('transform', `translate(${margin.left}, ${chartHeight + margin.top})`)
      .attr('class', 'axis x')
      .call(xAxis);

    data.forEach((d, i) => {
      select(this.$refs.circle)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
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
    xPoint: function (d) {
      return yScale(ySelector(d));
    },
    yPoint: function (d) {
      return xScale(xSelector(d));
    }
  }
}
</script>

<style>
</style>
