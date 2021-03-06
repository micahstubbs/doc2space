async function render() {
  const inputData = await d3.csv('./tsne-coords-labels-run-1.csv')

  // make a small sample dataset of just the first 5 papers
  // so that the Quest does not crash on page load
  const data = inputData.slice(0, 5)
  console.log('data', data)

  const xVariable = 'tsne-2d-one'
  const zVariable = 'tsne-2d-two'
  const labelVariable = 'label'

  // setup an arcScale for laying objects out
  // in a half circle
  // const arcScale = d3
  //   .scaleLinear()
  //   .domain([0, blocks.length])
  //   .range([Math.PI, 2 * Math.PI]); // remember, angles in radians

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map(d => d[xVariable])))
    .range([-12, 12])

  const zScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map(d => d[zVariable])))
    .range([-12, 12])

  const letterPaperAspectRatio = 1.2941
  const paperWidth = 0.6
  const paperHeight = paperWidth * letterPaperAspectRatio

  //
  // for each d3 example in the blocks data
  // add an a-box to the scene
  // with the thumbnail of that d3 example
  // as the image texture for that a-box
  //

  const localDataDir = '../../../data'

  const bucketUrl = `https://storage.googleapis.com/${bucketName}`

  const r = 0.5
  d3.select('a-scene')
    .append('a-entity')
    .attr('id', 'blocks')
    .selectAll('.throwable')
    .data(data)
    .enter()
    .append('a-box')
    .classed('block', true)
    .classed('throwable', true)
    .classed('collidable', true)
    .attr('static-body', '')
    .attr('scale', { x: paperWidth, y: paperHeight, z: 0.05 })
    .attr('position', (d, i) => ({
      x: xScale(d[xVariable]),
      y: 1.5,
      z: zScale(d[zVariable])
    }))
    .attr('material', d => {
      const fileStem = d[labelVariable].replace('.txt', '')
      const filename = `${fileStem}_300dpi.jpg`
      const cloudFilename = encodeURIComponent(filename)
      const localUrl = `${localDataDir}/${filename}`
      const cloudUrl = `${bucketUrl}/${cloudFilename}`

      return {
        src: `url(${localUrl})`
      }
    })
}

const sceneEl = document.querySelector('a-scene')
if (sceneEl.hasLoaded) {
  render()
} else {
  sceneEl.addEventListener('loaded', render)
}
