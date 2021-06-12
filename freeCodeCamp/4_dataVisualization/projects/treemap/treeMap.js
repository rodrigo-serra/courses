const FILEVIDEOGAME = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

d3.json(FILEVIDEOGAME, function(error, data) {
    // In case of any problem in the file reading
    if(error)
        throw error;
  
    // Extract data
    const fileTitle = data.name;
    const filePlatform = data.children;
    
    const platforms = filePlatform.map(element => element.name);
    
    // Add tilte and description
    d3.select(".box")
        .append("h1")
        .attr("id", "title")
        .text("Video Game Sales");
    
    d3.select(".box")
        .append("p")
        .attr("id", "description")
        .text("Top 100 Most Sold Video Games Grouped by Platform");
  
  /////////////////////////////////////////////////////////////////
  
    // COLOR
    // Generate a color for each platform
    const color = d3.scaleOrdinal()
                    .domain(platforms)
                    .range(d3.schemeCategory20);
  
  ////////////////////////////////////////////////////////////////
  
    // SVG
    const w = 800;
    const h = 800;
    
    const svg = d3.select(".box")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .style("background", "#757575");
  
  //////////////////////////////////////////////////////////////
  
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
    const mousemove = function(d) {
        Tooltip.html(buildInfo(d))
            .style('left', (d3.event.pageX) + "px")
            .style('top', (d3.event.pageY) + "px")
            .attr("data-value", d.data.value);
    }
    const mouseleave = function(d, i) {
        Tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        
        d3.select(this)
        .style("stroke", "none");
    }
    
    function buildInfo(d){
        let name = "Name: " + d.data.name + "<br>";
        let category = "Category: " + d.data.category + "<br>";
        let value = "Value: " + d.data.value;
        return name + category + value;
    }
  
  
  ///////////////////////////////////////////////////////////////
  
    // TREE
    // See https://observablehq.com/@d3/treemap
    // Initialize tree element
    const treemap = d3.treemap()
                        .size([w, h])
                        .padding(1);
  
    // Generate tree structure element
    // Organizes tree element according to the values of the children (leafs).
    // The file was already organized as tree JSON file, but was not sorted. 
    // It also didn't have the values for the parents.
    // If it had, one could have called treemap(data).
    const root = d3.hierarchy(data)
                    .sum(d => d.value)
                    .sort((a, b) => b.value - a.value);
  
  
    treemap(root);
  
    // root.leaves() return an array with all leaf elements. Inside it, it has the 
    // position of each leaf in the treemap, according to the specified w and h
    // vars.
    //console.log(root.leaves());
  
  
    // Assign "g" elements for the leafs depending on the d.x0 and d.y0
    // enter().append("g") === join("g")
    const leaf = svg.selectAll("g")
                    .data(root.leaves())
                    .enter()
                    .append("g")
                    .attr("transform", (d) => "translate(" + d.x0 + "," + d.y0 + ")");
        
    // Draw leafs
    leaf.append("rect")
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => color(d.data.category))
        .attr("fill-opacity", 0.7)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave);
  
  
    // Add text to rects
    // x and y coordinates tested, not specific value.
    leaf.append("text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))  
        .enter()
        .append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 20 + i*10)
        .text(d => d)
        .attr("font-size", "10px");
  
  ///////////////////////////////////////////////////////////////
  
    // LEGEND
    const wLegend = 1400;
    const hLegend = 100;
    
    const paddingVertical = 50;
    const paddingHorizontal = 50;
    
    const squareSize = 15;    
  
    const evenSpacesSize = (wLegend - (color.domain().length * squareSize)) / (color.domain().length + 1);
 
    const svgLegend = d3.select(".box")
                    .append("svg")
                    .attr("width", wLegend)
                    .attr("height", hLegend);
                    //.style("background", "green");
  
    const legend = svgLegend.append("g")
                            .attr("id", "legend");
  
  
    legend.selectAll("#legend")
            .data(color.domain())
            .enter()
            .append("rect")
            .attr("class", "legend-item")
            .attr("x", (d, i) => evenSpacesSize*(i + 1) + squareSize * i)
            .attr("y", hLegend/2 - squareSize)
            .attr("width", squareSize)
            .attr("height", squareSize)
            .style("fill", (d) => color(d));
  
  
    legend.selectAll("#legend")
            .data(color.domain())
            .enter()
            .append("text")
            .attr("x", (d, i) => evenSpacesSize*(i + 1) + squareSize * i + evenSpacesSize/2)
            .attr("y", hLegend/2 - 3)
            .text((d, i) => platforms[i])
            .style("font-family", 'Open Sans')
            .style("fill", "#212121")
            .style("font-size", "16px");
  
});