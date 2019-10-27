async function draw() {
  ////////////////////////////////////////////////////////////
  //////////////////////// Config ////////////////////////////
  ////////////////////////////////////////////////////////////

  const xVariable = 'tsne-2d-one'
  const yVariable = 'tsne-2d-two'
  const sizeVariable = 'size'
  const colorVariable = '1'
  const colorVariableType = 'continuous'
  const idVariable = 'id'
  const labelVariable = 'label'

  const yAxisLabel = ''
  const xAxisLabel = ''
  const pageTitle = '20D to 2D with t-SNE'
  const title = 'doc2vec data space on my Zotero papers'
  const subtitle = '20D to 2D with t-SNE'

  const colorPalette = [
    '#EFB605',
    '#E58903',
    '#E01A25',
    '#C20049',
    '#991C71',
    '#66489F',
    '#2074A0',
    '#10A66E',
    '#7EB852'
  ]

  const customXDomain = false

  ////////////////////////////////////////////////////////////
  /////////////////////// Load Data //////////////////////////
  ////////////////////////////////////////////////////////////

  const marks = await d3.csv('./tsne-coords-labels-run-1.csv')
  marks.forEach((mark, i) => {
    mark.color = i
    mark.size = 1
    mark.id = `id${i}`
    mark[xVariable] = Number(mark[xVariable])
    mark[yVariable] = Number(mark[yVariable])
  })

  ////////////////////////////////////////////////////////////
  //////////////////// Setup the Page ////////////////////////
  ////////////////////////////////////////////////////////////

  d3.select('title').html(pageTitle)
  d3.select('#title').html(title)
  d3.select('#subtitle').html(subtitle)

  // Quick fix for resizing some things for mobile-ish viewers
  const mobileScreen = $(window).innerWidth() < 500 ? true : false

  // Scatterplot
  const margin = { left: 60, top: 20, right: 20, bottom: 60 }

  const width = Math.max($('#chart').width(), 960) - margin.left - margin.right
  const height = (width * 2) / 3

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  const wrapper = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  //////////////////////////////////////////////////////
  ///////////// Initialize Axes & Scales ///////////////
  //////////////////////////////////////////////////////

  const opacityCircles = 0.7

  const maxDistanceFromPoint = 50

  let colorDomain

  // Set the color
  let color
  if (colorVariableType === 'continuous') {
    colorDomain = Array.from(
      new Set(marks.map(d => Number(d[colorVariable])))
    ).sort()
    color = d3
      .scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(colorDomain, d => d))
  } else {
    // ordinal
    colorDomain = Array.from(new Set(marks.map(d => d[colorVariable]))).sort()
    color = d3
      .scaleOrdinal()
      .range(colorPalette)
      .domain(colorDomain)
  }

  // Set the new x axis range
  const xScale = d3.scaleLinear().range([0, width])

  if (customXDomain) {
    xScale.domain(customXDomain) // I prefer this exact scale over the true range and then using "nice"
  } else {
    xScale.domain(d3.extent(marks, d => d[xVariable])).nice()
  }
  // Set new x-axis
  const xAxis = d3
    .axisBottom()
    .ticks(6)
    // .tickFormat(d =>
    //   xScale.tickFormat(mobileScreen ? 4 : 8, d => d3.format('$.2s')(d))(d)
    // )
    .scale(xScale)
  // Append the x-axis
  wrapper
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${0},${height})`)
    .call(xAxis)

  // Set the new y axis range
  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(marks, d => d[yVariable]))
    .nice()

  const yAxis = d3
    .axisLeft()
    .ticks(6) // Set rough # of ticks
    .scale(yScale)

  // Append the y-axis
  wrapper
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${0},${0})`)
    .call(yAxis)

  // Scale for the bubble size
  const rScale = d3
    .scaleSqrt()
    .range([mobileScreen ? 1 : 1, mobileScreen ? 10 : 4])
    // .range([mobileScreen ? 1 : 2, mobileScreen ? 10 : 16])
    .domain(d3.extent(marks, d => d[sizeVariable]))

  //////////////////////////////////////////////////////
  ///////////////// Initialize Labels //////////////////
  //////////////////////////////////////////////////////

  // Set up X axis label
  wrapper
    .append('g')
    .append('text')
    .attr('class', 'x title')
    .attr('text-anchor', 'end')
    .style('font-size', `${mobileScreen ? 8 : 12}px`)
    .attr('transform', `translate(${width},${height - 10})`)
    .text(xAxisLabel)

  // Set up y axis label
  wrapper
    .append('g')
    .append('text')
    .attr('class', 'y title')
    .attr('text-anchor', 'end')
    .style('font-size', `${mobileScreen ? 8 : 12}px`)
    .attr('transform', 'translate(18, 0) rotate(-90)')
    .text(yAxisLabel)

  ////////////////////////////////////////////////////////////
  ///// Capture mouse events and voronoi.find() the site /////
  ////////////////////////////////////////////////////////////

  // Use the same variables of the data in the .x and .y as used in the cx and cy of the circle call
  svg._tooltipped = svg.diagram = null
  svg.on('mousemove', function() {
    if (!svg.diagram) {
      console.log('computing the voronoi…')
      svg.diagram = d3
        .voronoi()
        .x(d => xScale(d[xVariable]))
        .y(d => yScale(d[yVariable]))(marks)
      console.log('…done.')
    }
    const p = d3.mouse(this)
    let site
    p[0] -= margin.left
    p[1] -= margin.top
    // don't react if the mouse is close to one of the axis
    if (p[0] < 5 || p[1] < 5) {
      site = null
    } else {
      site = svg.diagram.find(p[0], p[1], maxDistanceFromPoint)
    }
    if (site !== svg._tooltipped) {
      if (svg._tooltipped) removeTooltip(svg._tooltipped.data)
      if (site) showTooltip(site.data)
      svg._tooltipped = site
    }
  })

  ////////////////////////////////////////////////////////////
  /////////////////// Scatterplot Circles ////////////////////
  ////////////////////////////////////////////////////////////

  // Initiate a group element for the circles
  const circleGroup = wrapper.append('g').attr('class', 'circleWrapper')

  // Place the circle marks
  circleGroup
    .selectAll('marks')
    .data(marks.sort((a, b) => b[sizeVariable] > a[sizeVariable])) // Sort so the biggest circles are below
    .enter()
    .append('circle')
    .attr('class', (d, i) => `marks ${d[idVariable]}`)
    .attr('cx', d => xScale(d[xVariable]))
    .attr('cy', d => yScale(d[yVariable]))
    .attr('r', d => rScale(d[sizeVariable]))
    .style('opacity', opacityCircles)
    .style('fill', d => color(d[colorVariable]))

  ///////////////////////////////////////////////////////////////////////////
  /////////////////// Hover functions of the circles ////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  // Hide the tooltip when the mouse moves away
  function removeTooltip(d, i) {
    // Save the chosen circle (so not the voronoi)
    const element = d3.selectAll(`.marks.${d[idVariable]}`)

    // Fade out the bubble again
    element.style('opacity', opacityCircles)

    // Hide tooltip
    $('.popover').each(function() {
      $(this).remove()
    })

    // Fade out guide lines, then remove them
    d3.selectAll('.guide')
      .transition()
      .duration(200)
      .style('opacity', 0)
      .remove()
  } // function removeTooltip

  // Show the tooltip on the hovered over slice
  function showTooltip(d, i) {
    // Save the chosen circle (so not the voronoi)
    const element = d3.select(`.marks.${d[idVariable]}`)

    const el = element._groups[0]
    // Define and show the tooltip
    $(el).popover({
      placement: 'auto top',
      container: '#chart',
      trigger: 'manual',
      html: true,
      content() {
        return `<span style='font-size: 11px; text-align: center;'>${d[labelVariable]}</span>`
      }
    })
    $(el).popover('show')

    // Make chosen circle more visible
    element.style('opacity', 1)

    // Place and show tooltip
    const x = +element.attr('cx')

    const y = +element.attr('cy')
    const color = element.style('fill')

    // Append lines to bubbles that will be used to show the precise data points

    // vertical line
    wrapper
      .append('line')
      .attr('class', 'guide')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', y)
      .attr('y2', height + 20)
      .style('stroke', color)
      .style('opacity', 0)
      .transition()
      .duration(200)
      .style('opacity', 0.5)
    // Value on the axis
    wrapper
      .append('text')
      .attr('class', 'guide')
      .attr('x', x)
      .attr('y', height + 38)
      .style('fill', color)
      .style('opacity', 0)
      .style('text-anchor', 'middle')
      .text(`${d3.format('.2s')(d[xVariable])}`)
      .transition()
      .duration(200)
      .style('opacity', 0.5)

    // horizontal line
    wrapper
      .append('line')
      .attr('class', 'guide')
      .attr('x1', x)
      .attr('x2', -20)
      .attr('y1', y)
      .attr('y2', y)
      .style('stroke', color)
      .style('opacity', 0)
      .transition()
      .duration(200)
      .style('opacity', 0.5)
    // Value on the axis
    wrapper
      .append('text')
      .attr('class', 'guide')
      .attr('x', -25)
      .attr('y', y)
      .attr('dy', '0.35em')
      .style('fill', color)
      .style('opacity', 0)
      .style('text-anchor', 'end')
      .text(d3.format('.1f')(d[yVariable]))
      .transition()
      .duration(200)
      .style('opacity', 0.5)
  } // function showTooltip
}

draw()
