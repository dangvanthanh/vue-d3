<template>
  <div>
    <h1>Line Chart</h1>
    <svg :width="width" :height="height" ref="svg">
      <g ref="chart">
        <path :d="path" stroke="#ff6347" strokeWidth="3" fill="none" />
      </g>
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
const yScale = scaleLinear().range([0, 420]).domain([0, 500]);

export default {
  name: 'LineChart',
  data () {
    return {
      width: 500,
      height: 500,
      data: data,
      path: '',
      selected: null
    }
  },
  mounted () {
    // const path = line().x(d => xScale(xSelector(d))).y(d => yScale(ySelector(d))).curve(curveStep);
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
