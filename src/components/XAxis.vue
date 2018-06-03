<template>
  <g>
  </g>
</template>

<script>
import * as d3 from 'd3';
import { xSelector } from '../utils';

export default {
  name: 'XAxis',
  props: ['data', 'width', 'height', 'x', 'y'],
  mounted() {
    var xScale = d3
      .scaleBand()
      .range([0, this.width])
      .domain(this.data.map(d => xSelector(d)));
    var xAxis = d3.axisBottom(xScale);
    d3.select(this.$el)
    .attr('transform', `translate(${this.x}, ${parseInt(this.width, 10) + parseInt(this.y, 10)})`)
    .call(xAxis);
  }
};
</script>

<style>
</style>
