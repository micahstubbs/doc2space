this example uses the [`diagram.find()`](https://github.com/d3/d3-voronoi#diagram_find) convention introduced in d3 version [4.3.0](https://github.com/d3/d3/releases/tag/v4.3.0)

a fork of [Philippe Rivière](https://twitter.com/recifs)'s block [Nadieh Bremer's Scatterplot with Voronoi - ported to d3.v4, and no SVG overlay](http://bl.ocks.org/fil/f49b5cf943a0210212994aa5860ac4a8)

------ 8X --------

This is a D3.v4 port by Philippe Rivière of <a href='http://bl.ocks.org/nbremer/'>Nadieh Bremer</a>'s block: <a href='http://bl.ocks.org/nbremer/61cd485e399b6a71d5fb2b1072fbc6c1'>Step 6 - Final - Voronoi (Distance Limited Tooltip) Scatterplot</a>.

In addition, we use [d3.voronoi.find(x,y,radius)](https://github.com/d3/d3-voronoi/pull/18) to locate the point, instead of relying on a SVG overlay of clipped circles.

This gives:
1) lazy computation of the Voronoi
2) other objects are allowed capture the mouse before `svg`.


------ 8X --------

Nadieh:

This scatterplot is part of the extension of my blog on [Using a D3 Voronoi grid to improve a chart's interactive experience](http://www.visualcinnamon.com/2015/07/voronoi.html). After writing that blog [Franck Lebeau came with another version](http://bl.ocks.org/Kcnarf/c6e9c98a55287e6cd03aae7080b9ec90) which uses large circles to define the tooltip region. I thought this was a great idea! But I made this variation on his code, because I felt that the extra code used in this example (versus [the previous version 4]((http://bl.ocks.org/nbremer/801c4bb101e86d19a1d0))) is more in line with the rest of the code.

The tooltip now reacts when you hover over an invisible large circular region around each circle.

You can find all of the steps here

- [Step 1: Tooltip attached to circle element](http://bl.ocks.org/nbremer/d5ef6c58f85aba2da48b)
- [Step 2: Tooltip attached to voronoi cell](http://bl.ocks.org/nbremer/65f03d1ebd1742196200)
- [Step 3: Tooltip attached to circle](http://bl.ocks.org/nbremer/c0ffc07b23b1c556a66b)
- [Step 4: Extra hover effects and interactivity](http://bl.ocks.org/nbremer/801c4bb101e86d19a1d0)
- [Step 5: Update with distance limiting circles - made visible](http://bl.ocks.org/nbremer/1ff72d1ab2340710d851c50f6ead7415)
- Step 6: This is step 6 :)



forked from <a href='http://bl.ocks.org/Fil/'>Fil</a>'s block: <a href='http://bl.ocks.org/Fil/7d4ac8a6c259e3d4329c54c4f1abed34'>Step 6 - d3.v4 [UNLISTED]</a>