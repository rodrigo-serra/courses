const COUNTIESFILE = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const MAPFILE = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";


const COLORMAP = ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"];

// LOADS FILE FROM WHICH WILL BE BUILT THE MAP AND THE INFORMATION EXTRACTED
// The d3.json function is used in the same way as the other projects.
// When done, calls ready function
d3.queue()
  .defer(d3.json, COUNTIESFILE)
  .defer(d3.json, MAPFILE)
  .await(ready);


function ready(error, countiesInfo, mapInfo) {
  
    if(error){
        throw error;
    }
  
    // VARS
    // Vars for the svg "box"
    const w = 1400;
    const h = 800;
    const paddingHorizontal = 50;
    const paddingVertical = 50;
  
  
    // Get max and min %    
    const maxBachelorValue = d3.max(countiesInfo, d => d.bachelorsOrHigher);
    const minBachelorValue = d3.min(countiesInfo, d => d.bachelorsOrHigher);
  
    // Get ID list. Useful later to find correspondences between files.
    const idList = countiesInfo.map(d => d.fips);
  
  ////////////////////////////////////////////////////////////////////////
    // DRAW SVG
    const svg = d3.select(".box")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);
                    //.style("background", "green");
  
  
    // COLOR FOR DATA POINTS
    // scaleQuantize to select the thresholds automatically
    // See https://observablehq.com/@d3/quantile-quantize-and-threshold-scales
    const color = d3.scaleQuantize()
                    .domain([minBachelorValue, maxBachelorValue])
                    .range(COLORMAP);
  
  
  ///////////////////////////////////////////////////////////////////////////
    // LEGEND
    
    // Legend rects height
    const legRectHeight = 20;
    const legPadding = w/4;
  
  
    // Generating thresholds for colors
    const colorThresholds = [];
    COLORMAP.forEach(function(element, i) {
        let interval = color.invertExtent(element);
        colorThresholds.push(Math.round(interval[0] * 10) / 10);
        if(i === COLORMAP.length - 1)
        colorThresholds.push(Math.round(interval[1] * 10) / 10)
    });
  
  
    const x = d3.scaleLinear()
                .domain(d3.extent(colorThresholds))
                .range([legPadding, w - legPadding]);
  
    const xLegend = d3.axisBottom(x).tickValues(colorThresholds).tickFormat(d => Math.round(d) + '%').tickSize(10);
  
  
    svg.append("g")
        .attr("transform", "translate(0," + (paddingVertical + legRectHeight) + ")")
        .call(xLegend);
  
  
    const legend = svg.append("g")
                        .attr("id", "legend");
  
    // Extra array which is a copy of colorThreshold except for the first element.
    // One must also remove the last element in the original array.
    // This way, it's possible to iterate over all elements.  
    const colorThresholdsShift = colorThresholds.slice(1, colorThresholds.length);
    colorThresholds.pop();
  
    // In the fill attr, one was added so the color could be attributed to a number in the
    // middle of the interval
    legend.selectAll()
        .data(colorThresholds)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(d))
        .attr("y", paddingVertical)
        .attr("width", (d, i) => x(colorThresholdsShift[i]) - x(d))
        .attr("height", legRectHeight)
        .style("fill", (d, i) => color(d + 1));
  
  //////////////////////////////////////////////////////////////////////////////////////////////////
  
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
        let index = idList.indexOf(d.id);
        Tooltip.html(buildInfo(d))
            .style('left', (d3.event.pageX) + "px")
            .style('top', (d3.event.pageY) + "px")
            .attr("data-education", countiesInfo[index].bachelorsOrHigher);
    }
    const mouseleave = function(d, i) {
        Tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        
        d3.select(this)
        .style("stroke", "none");
    }
  
    function buildInfo(d){
        let i = idList.indexOf(d.id);
        let percentage = countiesInfo[i].bachelorsOrHigher;
        let county = countiesInfo[i].area_name;
        let state = countiesInfo[i].state;
        return county + ", " + state + ": " + percentage + "%";
    }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////
  
    // MAP
    // See the following links:
    // https://observablehq.com/@d3/choropleth
    // https://www.d3-graph-gallery.com/graph/choropleth_basic.html
    path = d3.geoPath();
  
    const yMapCord = paddingVertical + 80;
    const xMapCord = paddingHorizontal + 150;
    
    // Responsible for the map with the counties
    svg.append("g")
        .attr("transform", "translate(" + xMapCord + "," + yMapCord + ")")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(mapInfo, mapInfo.objects.counties).features)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("data-fips", d => d.id)
        .attr("data-education", function(d){
            let index = idList.indexOf(d.id);
            return countiesInfo[index].bachelorsOrHigher;
        })
        .attr("fill", function(d){
            let index = idList.indexOf(d.id);
            return color(countiesInfo[index].bachelorsOrHigher);
        })
        .attr("d", path)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave);
  
    // Responsible for the lines between states
    svg.append("path")
        .attr("transform", "translate(" + xMapCord + "," + yMapCord + ")")
        .datum(topojson.mesh(mapInfo, mapInfo.objects.states, (a, b) => a !== b))
        .attr("class", "states")
        .attr("d", path);
  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  
    //LINK TO SOURCE
    const source = d3.select(".box")
                    .append("div")
                    .attr("id", "source");
  
    source.append("p")
            .text("Source")
            .attr("id", "pSource");
  
    source.append("a")
            .attr("href", "https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx")
            .attr("target", "_blank")
            .text("USDA Economic Research Service")
            .attr("id", "aSource");
  
}