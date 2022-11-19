<template>
  <div class="d3-home w-100 h-100" id="d3"></div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import * as d3 from 'd3';

export default defineComponent({
  setup() {
    const initBar = () => {
      const width = 600;
      const height = 400;
      const svg = d3.select('#d3').append('svg').attr('width', width).attr('height', height);
      const padding = {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30,
      }
      const dataList = [5, 60, 30, 45, 25, 55, 10, 25, 40, 60, 35];
      const xScale = d3.scaleBand().domain(d3.range(dataList.length)).range([0, width - padding.left - padding.right]);
      const yScale = d3.scaleLinear().domain([0, d3.max(dataList)]).range([height - padding.top - padding.bottom, 0]);
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
      const rectPadding = 4;
      const rects = svg.selectAll('.myRect')
        .data(dataList)
        .enter()
        .append('rect')
        .attr('class', 'myRect')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .attr('x', function(d, i) {
          return xScale(i) + rectPadding / 2;
        })
        .attr('y', function(d) {
          return yScale(d);
        })
        .attr('width', xScale.bandwidth() - rectPadding)
        .attr('height', function(d) {
          return height - padding.top - padding.bottom - yScale(d);
        })
        .attr('fill', 'green')
        .on('mouseover', function() {
          d3.select(this).attr('fill', 'black');
        })
        .on('mouseout', function() {
          d3.select(this).transition().duration(500).attr('fill', 'green')
        })
      const texts = svg.selectAll('.myText')
        .data(dataList)
        .enter()
        .append('text')
        .attr('class', 'myText')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .attr('x', function(d, i) {
          return xScale(i) + rectPadding / 2;
        })
        .attr('y', function() {
          const min = yScale.domain()[0];
          return yScale(min);
        })
        .transition()
        .delay(function(d, i) {
          return i * 200;
        })
        .duration(2000)
        .attr('y', function(d) {
          return yScale(d);
        })
        .attr('dx', function(d) {
          return (xScale.bandwidth() - rectPadding) / 2 - (4 * (d + '').length);
        })
        .attr('dy', function() {
          return 20;
        })
        .text(function(d) {
          return d;
        })
        .style('fill', '#fff')
      svg.append('g').attr('class', 'axis').attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')').call(xAxis);
      svg.append('g').attr('class', 'axis').attr('transform', 'translate(' + padding.left + ',' + padding.top + ')').call(yAxis);
    }
    onMounted(() => {
      initBar();
    })
  }
})

</script>