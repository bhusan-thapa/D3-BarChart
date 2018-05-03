var margin = { left: 100, right: 10, top: 10, bottom: 100 };
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);
var g = svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
d3.json('data/revenues.json').then(data => {
  data.forEach(data => {
    data.revenue = +data.revenue;
  });
  // Ordinal Scale
  var color = d3
    .scaleOrdinal()
    .domain(data.map(d => d.month))
    .range(d3.schemeSet1);
  // Y-scale: Linear scale
  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, data => data.revenue)])
    .range([height, 0]);
  // X-scale: Band scale
  var x = d3
    .scaleBand()
    .domain(data.map(d => d.month))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.2);
  // X-Axis
  var xAxis = d3.axisBottom(x);
  g
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);
  // X Label
  g
    .append('text')
    .attr('x', width / 2)
    .attr('y', height + 80)
    .attr('text-anchor', 'middle')
    .attr('font-size', '20px')
    .text('Months');
  // Y-Axis
  var yAxis = d3.axisLeft(y);
  g.append('g').attr('class', 'y-axis').call(yAxis);
  // Y-Label
  g
    .append('text')
    .attr('x', -(height / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Total Revenue in USD');
  var rects = g
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', data => x(data.month))
    .attr('y', data => y(data.revenue))
    .attr('width', x.bandwidth)
    .attr('height', data => height - y(data.revenue))
    .attr('fill', data => color(data.month));
});
