<template>
  <g>
    <rect
      v-for="(d, i) in data"
      :key="i"
      :width="w"
      :height="calcHeight(d)"
      :x="xScale(d)"
      :y="yScale(d)"
      stroke="#00c253"
      strokeWidth="3"
      fill="#00c253"/>
  </g>
</template>

<script>
import * as d3 from 'd3';
import { xSelector, ySelector } from '../utils';

export default {
  name: 'NewBarChart',
  props: ['data', 'width', 'height', 'x', 'y'],
  data() {
    return {
      w: 0
    };
  },
  mounted() {
    const widthScale = d3
      .scaleBand()
      .range([0, this.width])
      .domain(this.data.map(d => xSelector(d)))
      .padding(0.3);
    const heightScale = d3
      .scaleLinear()
      .range([this.height, 0])
      .domain([0, 500]);

    this.w = widthScale.bandwidth();

    d3
      .select(this.$el)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', `translate(${this.x}, ${this.y})`);
  },
  methods: {
    yScale: function(d) {
      const heightScale = d3
        .scaleLinear()
        .range([this.height, 0])
        .domain([0, 500]);
      return heightScale(ySelector(d));
    },
    xScale: function(d) {
      const widthScale = d3
        .scaleBand()
        .range([0, this.width])
        .domain(this.data.map(d => xSelector(d)))
        .padding(0.3);
      return widthScale(xSelector(d));
    },
    calcHeight: function(d) {
      const heightScale = d3
        .scaleLinear()
        .range([this.height, 0])
        .domain([0, 500]);

      const yValue = heightScale(ySelector(d));
      const barHeight = this.height - yValue;
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
