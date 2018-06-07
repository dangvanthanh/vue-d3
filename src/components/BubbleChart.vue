<template>
  <svg :width="width" :height="height" transform>
    <g transform="translate(50, 50)">
      <circle fill="orange" r="30"/>
      <circle fill="orange" r="10" cx="120"/>
      <circle fill="orange" r="5" cx="240"/>
      <circle fill="orange" r="20" cx="280"/>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3';
import { xSelector, ySelector } from '../utils';

export default {
  name: 'BubbleChart',
  props: ['data', 'width', 'height'],
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style>
</style>
