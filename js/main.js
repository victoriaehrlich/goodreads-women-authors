const svg = d3.select(".chart-1")
  .append("svg")
  .attr("viewBox", "0 0 900 600");

d3.csv("../data/book_ratings.csv", d => ({
  title: d.title,
  readers: +d.readers,
  rating: +d.rating,
  author: d.author,
})).then(books => {
    console.log(books);

    createVis(books); //books can be called anything you want
});

function createVis(books) {
    //defining my margins
  const margin = { top: 60, right: 70, bottom: 10, left: 140 };
  const width = 900 - margin.left - margin.right; //width of the chart
  const height = 600 - margin.top - margin.bottom;

  const xScale = d3.scaleLinear() // continuous input and a continuous output
    .domain([0, d3.max(books, c => c.readers)]) //this is called an array function -- domain takes the input 
    .range([0, width - 10 ]);// range takes the output 

  const yScale = d3.scaleBand() //discrete input and a continous output looking at 0 to 900 for my height reference later 
    .domain(books.map(d => d.title)) // .map creates a new array of titles -- see whether you can do d.title, d.author within the same array if working with multiple columns
    .range([0, height])
    .paddingInner(0.2);

  const fmt = d3.format(".1f");

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const barAndLabel = chart.selectAll("g.bar")
    .data(books) //binding the data .data is part of d3 library
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

