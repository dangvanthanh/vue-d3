<template>
  <g>
    <g v-for="arc in arcs" :key="arc.index">
      <path :d="arcCorner(arc)" stroke="gray" :fill="arc.color" :id="arc.id" />
      <text dx="10" dy="-5"><textPath :xlink:href="arc.href" v-text="arc.value"></textPath></text>
    </g>
  </g>
</template>

<script>
import * as d3 from 'd3';
import { xSelector, ySelector } from '../utils';

export default {
  name: 'PieChart',
  props: ['data', 'width', 'height', 'x', 'y'],
  data() {
    return {
      arcs: {}
    }
  },
  mounted() {
    d3
      .select(this.$el)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', `translate(${this.x}, ${this.y})`);

    this.arcCorner = d3
      .arc()
      .outerRadius(this.width / 2)
      .innerRadius(this.height / 4)
      .padAngle(0.03)
      .cornerRadius(8);

    this.arcs = d3.pie().value(function(d) {
      return d.y;
    })(this.data);

    this.arcs = this.arcs.map(function(arc) {
      arc.id = 'arc-' + arc.index;
      arc.href = '#arc-' + arc.index;
      arc.color = d3.interpolateCool(Math.random());
      return arc;
    });
  }
}
</script>

<style>
</style>
