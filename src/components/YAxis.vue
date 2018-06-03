<template>
  <g>
  </g>
</template>

<script>
import * as d3 from 'd3';
import { ySelector } from '../utils';

export default {
  name: 'YAxis',
  props: ['width', 'x', 'y'],
  mounted() {
    var yScale = d3
      .scaleLinear()
      .range([this.width - this.x - this.y, 0])
      .domain([0, this.width]);
    var yAxis = d3.axisLeft(yScale).tickSizeInner(-(this.width - this.y));
    d3
      .select(this.$el)
      .attr('transform', `translate(${this.x}, ${this.y})`)
      .call(yAxis);
  }
};
</script>

<style>
</style>
