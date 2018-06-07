<template>
    <g>
      <path :d="path" :fill="color"/>
    </g>
</template>

<script>
import * as d3 from 'd3';
import { xSelector, ySelector } from '../utils';

export default {
  name: 'BubbleChart',
  props: ['data', 'width', 'height'],
  data() {
    return {
      path: '',
      color: 'red'
    };
  },
  mounted() {
    let area = d3
      .area()
      .x(d => this.xScale(d))
      .y0(this.height)
      .y1(d => ySelector(d));

    this.color = d3.interpolateCool(Math.random());
    this.path = area(this.data);
  },
  methods: {
    xScale(d) {
      const xScale = d3
        .scaleBand()
        .range([0, this.width])
        .domain(this.data.map(d => xSelector(d)));
      return xScale(xSelector(d));
    }
  }
};
</script>

<style>
</style>
