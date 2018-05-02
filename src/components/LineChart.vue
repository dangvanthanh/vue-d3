<template>
  <div>
    <h1>Line Chart</h1>
    <svg :width="width" :height="height" ref="svg">
      <path :d="path" stroke="#ff6347" strokeWidth="3" fill="none" />
    </svg>
  </div>
</template>

<script>
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { line, curveStep } from 'd3-shape';

const data = [
  {
    x: 0,
    y: 1,
  },
  {
    x: 1,
    y: 50,
  },
  {
    x: 2,
    y: 100,
  },
  {
    x: 3,
    y: 150,
  },
  {
    x: 4,
    y: 200,
  },
  {
    x: 5,
    y: 250,
  },
  {
    x: 6,
    y: 300,
  },
  {
    x: 7,
    y: 350,
  },
  {
    x: 8,
    y: 400,
  },
  {
    x: 9,
    y: 450,
  },
  {
    x: 10,
    y: 500,
  },
];

const xSelector = d => d.x;
const ySelector = d => d.y;

const xScale = scaleLinear().range([0, 500]).domain([0, 10]);
const yScale = scaleLinear().range([0, 500]).domain([0, 500]);

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

    data.forEach((d, i) => {
      select(this.$refs.svg)
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
