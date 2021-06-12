//Operator which loads the data from the current file
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(data) {
    // Taking data from the file. It only matters the data var.
    const dataset = data.data;
    
    // Vars for the svg "box"
    const w = 850;
    const h = 450;
    const padding = 60;
  
  
    // Scales for the plot
    // xScale uses scaleTime() considering with deals with dates. new Date must be used
    const xScale = d3.scaleTime()
                    .domain([new Date (d3.min(dataset, (d) => d[0])), new Date (d3.max(dataset, (d) => d[0]))])
                    .range([padding, w - padding]);
    // xScale2 helps to set the x position of each bar. It has the same number of elements of xScale
    // Not used anymore
    const xScale2 = d3.scaleLinear()
                    .domain([0, dataset.length - 1])
                    .range([padding, w - padding]);
  
    // yScale for the GDP values
    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, (d) => d[1])])
                    .range([h - padding, padding]);
    // yScale2 to the build the rects in a simpler version
    const yScale2 = d3.scaleLinear()
                    .domain([0, d3.max(dataset, (d) => d[1])])
                    .range([padding, h - padding]);
  
  
  
    // Set the svg
    const svg = d3.select(".box")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
                //.style("background", "pink");
  
    // Set both axis according to the xScale and yScale
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)
        .attr("id", "x-axis");

    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)
        .attr("id", "y-axis");
  
  /////////////////////////////////////////////////////////////////////////////////////////////
  // Funtions for the Tooltip
  // Major help from https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html#mostbasic
  // Create Tooltip
    var Tooltip = d3.select(".box")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .attr("id", "tooltip")
  
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
        Tooltip
        .html(tooltipText(d[0], d[1]))
        //.style("left", (d3.mouse(this)[0]+390) + "px")
        .style("left", (d3.event.clientX + 30) + "px")
        .style("top", (d3.event.clientY - 80) + "px")
        .attr("data-date", d[0])
        
        //console.log("x coord: " + d3.event.clientX);
        //console.log("y coord: " + d3.event.clientY);
    }
    var mouseleave = function(d) {
        Tooltip
        .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
    }

    // Set the text for the Tooltip
    function tooltipText(date, num) {
        let dateSplit = date.split("-");
        let quarter;
        if(dateSplit[1] == "01") {
            quarter = "Q1";
        } else if (dateSplit[1] == "04") {
            quarter = "Q2";
        } else if (dateSplit[1] == "07") {
            quarter = "Q3";
        } else {
            quarter = "Q4";
        }
        return dateSplit[0] + " " + quarter + "<br>$" + numberWithCommas(num) + " Billion";
    }
  
    // From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  /////////////////////////////////////////////////////////////////////////////////////////////
  
    // Add the bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr('data-date', (d, i) => d[0])
        .attr('data-gdp', (d, i) => d[1])
        .attr("x", (d, i) => xScale(new Date(d[0])))
        .attr("y", (d, i) => h - yScale2(d[1]))
        .attr("width", 2)
        .attr("height", (d, i) => yScale2(d[1]) - padding)
        .style("fill", "lightblue")
        .attr("class", "bar")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
  
    //Add Y axis name
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -250)
        .attr('y', 80)
        .style("font-family", "Opens Sans")
        .text('Gross Domestic Product');
  
    // Add extra info
    svg.append("text")
        .attr("x", 460)
        .attr("y", 435)
        .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
        .style("font-family", "Open Sans")
        .style("font-size", "12px");
  
});
