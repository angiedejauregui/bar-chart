const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const json = data;
    const dataset = json.data;

    console.log(json);
    const title = json.source_name;

    document.getElementById("title").textContent = title;

    const width = 1000;
    const height = 500;
    const padding = 60;

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);


    const xScale = d3
      .scaleTime()
      .domain([
        new Date(dataset[0][0]),
        new Date(dataset[dataset.length - 1][0]),
      ])
      .range([padding, width - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis)

      .style("font-size", "16px")
      .selectAll(".tick")
      .attr("class", "tick");

    
    const yScale = d3
      .scaleLinear()
      .domain([0, (0, d3.max(dataset, (d) => d[1]))])
      .range([height - padding, padding]);

    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis)
      .selectAll(".tick")
      .attr("class", "tick")
      .style("font-size", "16px")


    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(new Date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .style("width", (width - 2 * padding) / dataset.length)
        .style("height", (d) => height - padding - yScale(d[1]))
        .attr("fill", "navy")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])


        .on("mousemove", function(e, d) {
            const tooltip = d3.select("#tooltip");

            tooltip
                .style("opacity", 0.9)
                .style("left", e.pageX + 10 + "px")
                .style("top", e.pageY + 10 + "px") 
                .style("font-size", "15px");

            tooltip
                .attr("data-date", d[0])
                .html(`${d[0].split(/-/)} <br/> $${d[1]} Billion`);
        }) 

        .on("mouseout", function(e) {
            d3.select("#tooltip").style("opacity", 0);
        })

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", "0")
            .style("position", "absolute")
            .style("background-color", "rgba(0, 0, 0, 0.8")
            .style("color", "#fff")
            .style("padding", "10px")
    

  });

