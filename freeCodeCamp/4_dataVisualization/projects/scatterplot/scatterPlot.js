//Operator which loads the data from the current file
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(data) {

    // Vars for the svg "box"
    const w = 850;
    const h = 450;
    const padding = 80;
  
  
    // DRAW SVG
    const svg = d3.select(".box")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);
                    //.style("background", "pink");
    
  
    // ADDRESSING Y AXIS FIRST
    // Generate dates for the Y axis
    // The Year, Month, Day, Hour don't really matter here and therefore will be kept the 
    // same for all elements. The only variables that matter for this particular case are
    // the Hour and Minute
    const yDataPoints = data.map(function(element){
        let time = element.Time.split(":");
        return (new Date(2021, 0, 1, 0, parseInt(time[0]), parseInt(time[1]), 0));
    });
  
    // Domain for the Y aixs
    const maxMinDate = d3.extent(yDataPoints);
  
    // yScale for the dates
    const yScale = d3.scaleTime()
                    .domain(maxMinDate)
                    .range([h - padding, padding]);
  
    // yScale2 to the build the dataPoints
    const yScale2 = d3.scaleTime()
                    .domain(maxMinDate)
                    .range([padding, h - padding]);
  
    // Instead of dates, the points are represented as Hour:Minute (e.g. 37:30)
    const yAxis = d3.axisLeft(yScale2).tickFormat(d3.timeFormat("%M:%S"));
  
  
    // ADDRESSING X AXIS
    // Plus one (minus one), to give a little extra space to the points
    const maxYear = d3.max(data, d => parseInt(d.Year)) + 1;
    const minYear = d3.min(data, d => parseInt(d.Year)) - 1;
  
    const xScale = d3.scaleLinear()
                    .domain([minYear, maxYear])
                    .range([padding, w - padding]);
  
    // The format here replaces "1,920" by "1920"
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  
    // DRAW AXIS
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)
        .attr("id", "x-axis");

    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)
        .attr("id", "y-axis");
  
    // Y AXIS NAME
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -270)
        .attr('y', 17)
        .style("font-family", "Opens Sans")
        .style("font-size", "24px")
        .text('Time in Minutes');
  
  
    // COLOR FOR DATA POINTS
    // d3.schemecategory10 corresponds to a pallet of colors. A single value in the domain
    // matches a single value in the range (color).
    // In this case, one needs only two colors. One for dopping and one for 
    // no doping
    const color = d3.scaleOrdinal()
                    .domain([true, false])
                    .range(d3.schemeCategory10);

  
    // TOOLTIP WITH DATA INFO
    const Tooltip = d3.select(".box")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .attr("id", "tooltip");

    // Functions for Tooltips
    const mouseover = function(d, i) {
        Tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);
        
        d3.select(this)
            .style("stroke", "black");
    }
    const mousemove = function(d, i) {
        Tooltip.html(buildInfo(d, i))
            .style('left', (d3.event.pageX) + "px")
            .style('top', (d3.event.pageY) + "px")
            .attr("data-year", d.Year);
    }
    const mouseleave = function(d, i) {
        Tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        
        d3.select(this)
        .style("stroke", "none");
    }
  
    function buildInfo(d, i){
        let name = "Name: " + d.Name + "<br>";
        let nationality = "Nationality: " + d.Nationality + "<br>";
        let year = "Year: " + d.Year + "<br>";
        let time = "Time: " + d.Time + "<br>";
        let doping = "Doping: " + (d.Doping == "" ? "No dopping allegations" : d.Doping) + "<br>";
        return name + nationality + year + time + doping;
    }
  
    // DATA POINTS
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d, i) => yDataPoints[i])
        .attr("cx", (d) => xScale(parseInt(d.Year)))
        .attr("cy", (d, i) => yScale2(yDataPoints[i]))
        .attr("r", (d) => 5)
        .style("fill", function(d, i){
            if(d.Doping == "")
            return color(true);
            return color(false);
        })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave);
  
  
    // Simpler example for Tooltip. Just an example for learning purposes
    /*svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(parseInt(d.Year)))
        .attr("cy", (d, i) => yScale2(yDataPoints[i]))
        .attr("r", (d) => 5)
        .style("fill", function(d, i){
            if(d.Doping == "")
            return color(true);
            return color(false);
        })
        .on('mouseover', function (d, i) {
            Tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
                
            d3.select(this)
            .style("stroke", "black");
        
            Tooltip.html('Hello')
                .style('left', (d3.event.pageX) + "px")
                .style('top', (d3.event.pageY) + "px");
        })
        .on('mouseout', function () {
        
            Tooltip.transition()
                .duration(200)
                .style('opacity', 0);
        
            d3.select(this)
            .style("stroke", "none");
        });*/

  
    // LEGEND
    // HELP: https://www.d3-graph-gallery.com/graph/custom_legend.html
    const squareSize = 15;
    
    const legend = svg.append("g")
                        .attr("id", "legend");
    
    legend.selectAll("#legend")
        .data(color.domain())
        .enter()
        .append("rect")
        .attr("x", w - 200)
        .attr("y", (d, i) => (h - padding)/2 + i*(squareSize + 3))
        .attr("width", squareSize)
        .attr("height", squareSize)
        .style("fill", (d) => color(d))
    
    legend.selectAll("#legend")
        .data(color.domain())
        .enter()
        .append("text")
        .attr("x", w - 200 + squareSize*1.3)
        .attr("y", (d, i) => (h - padding)/2 + i*(squareSize + 5) + (squareSize - 5))
        .text(d => d ? 'No doping allegations' : 'Riders with doping allegations')
        .style("fill", (d) => color(d))
        .style("font-size", "14px")
     
      
});
