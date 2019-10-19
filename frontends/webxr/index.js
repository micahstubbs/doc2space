async function render() {
  const data = await d3.csv("tsne-coords-labels-run-1.csv");

  console.log("data", data);

  // setup an arcScale for laying objects out
  // in a half circle
  const arcScale = d3
    .scaleLinear()
    .domain([0, blocks.length])
    .range([Math.PI, 2 * Math.PI]); // remember, angles in radians

  //
  // for each d3 example in the blocks data
  // add an a-box to the scene
  // with the thumbnail of that d3 example
  // as the image texture for that a-box
  //
  const r = 0.5;
  d3.select("a-scene")
    .append("a-entity")
    .attr("id", "blocks")
    .selectAll(".throwable")
    .data(blocks)
    .enter()
    .append("a-box")
    .classed("block", true)
    .classed("throwable", true)
    // .attr("dynamic-body", "")
    // .attr("velcity", "")
    .attr("scale", { x: 0.96, y: 0.5, z: 0.05 })
    .attr("position", (d, i) => ({
      x: 6.5 - 2 * Math.PI + r * Math.cos(arcScale(i)),
      y: (blocks.length - i) / 5 + 0,
      z: -0.5 * Math.PI + r * Math.sin(arcScale(i))
    }));
  // .attr("material", d => ({
  //   src: `url(http://bl.ocks.org/${d.owner.login}/raw/${d.id}/thumbnail.png)`
  // }));
}

const sceneEl = document.querySelector("a-scene");
if (sceneEl && sceneEl.hasLoaded) {
  render();
} else {
  sceneEl.addEventListener("loaded", render);
}
