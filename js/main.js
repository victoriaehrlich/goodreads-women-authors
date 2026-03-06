const svg = d3.select(".chart-1")
  .append("svg")
  .attr("viewBox", "0 0 900 600");

d3.csv("../data/book_ratings.csv", d => ({
  title: d.title,
  readers: +d.readers,
  rating: +d.rating,
  author: d.author,
})).then(data => {
    console.log(data);

    createVis(data);
});

function createVis(data) {
    //defining my margins
  const margin = { top: 60, right: 70, bottom: 10, left: 140 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.readers)])
    .range([0, width - 10 ]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.title))
    .range([0, height])
    .paddingInner(0.2);

  const fmt = d3.format(".1f");

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const barAndLabel = chart.selectAll("g.bar")
    .data(data)
    .join("g")
    .attr("class", "bar")
    .attr("transform", d => `translate(0, ${yScale(d.title)})`);

  barAndLabel.append("rect")
    .attr("width", d => xScale(d.readers))
    .attr("height", yScale.bandwidth())
    .attr("fill", "pink")
    .attr("fill-opacity", 0.2)
    .attr("stroke", "pink")
    .attr("stroke-opacity", 0.6);

  barAndLabel.append("text")
    .text(d => d.title)
    .attr("class", "book-title")
    .attr("x", -10)
    .attr("y", yScale.bandwidth()/2 - 4) //slightly above center
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle");

  barAndLabel.append("text")
    .text(d => d.author)
    .attr("class", "author")
    .attr("x", -10)
    .attr("y", yScale.bandwidth()/2 + 12) //below title
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "end");

  barAndLabel.append("text")
    .text(d => `${fmt(d.readers / 1000)}k readers`)
    .attr("class", "readers")
    .attr("x", d => xScale(d.readers) + 4)
    .attr("y", yScale.bandwidth()/2 + 12) //arrange with author
    .attr("fill", "grey")
    .attr("text-anchor", "start");

}

