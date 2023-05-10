const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

let values = [];

let xScale;
let yScale
let yAxisScale;
let xAxisScale;

let width = 900;
let height = 550;
let padding = 40;

let svg = d3.select('svg');
let tooltip = d3.select('#tooltip');

const drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
}

const generateScales = () => {
    xScale = d3.scaleLinear()
        .domain([d3.min(values, item => item['Year']) - 1, d3.max(values, item => item['Year']) + 1])
        .range([padding, width - padding])

    yScale = d3.scaleLinear()
        .domain([d3.min(values, item => new Date(item['Seconds'] * 1000)), d3.max(values, item => new Date(item['Seconds'] * 1000))])
        .range([padding, height - padding])
}

const drawPoints = () => {

    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('position', 'absolute')


    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '7')
        .attr('stroke','#000')
        .attr('strokeWidth','2')
        .attr('data-xvalue', item => item['Year'])
        .attr('data-yvalue', item => new Date(item['Seconds'] * 1000))
        .attr('cx', item => xScale(item['Year']))
        .attr('cy', item => yScale(new Date(item['Seconds'] * 1000)))
        .attr('fill', item => item['Doping'] ? 'orange' : 'lightgreen')
        .on('mouseover', item => {
            tooltip.transition()
                .style('visibility', 'visible')

            if (item['Doping']) {
                tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
            } else {
                tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations')
            }

            tooltip.style('left', xScale(item['Year']) + 75 + 'px')
            tooltip.style('top', yScale(new Date(item['Seconds'] * 1000)) + 'px')

            tooltip.attr('data-year', item['Year']);
        })
        .on('mouseout', item => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

const generateAxes = () => {
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'));
    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S'));

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')');

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ',0)')
}

fetch(url)
    .then(response => response.json())
    .then(json => {
        values = json;

        drawCanvas();
        generateScales();
        drawPoints();
        generateAxes();
    })

