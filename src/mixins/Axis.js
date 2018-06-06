import * as d3 from 'd3';

const Axis = {
  props: ['orient', 'scale', 'range', 'domain', 'height', 'width'],
  computed: {
    _transform() {
      const x = this.orient === 'Right' ? this.width : 0;
      const y = this.orient === 'Bottom' ? this.height : 0;
      return `translate(${this.x}, ${this.y})`;
    },
    _orient: function() {
      return 'axis' + this.orient;
    },
    _scale: function() {
      return d3[this.scale]()
        .range(this.range)
        .domain(this.domain);
    }
  },
  mounted() {
    d3.select(this.$el).call(d3[this._orient](this._scale));
  }
};

export default Axis;
