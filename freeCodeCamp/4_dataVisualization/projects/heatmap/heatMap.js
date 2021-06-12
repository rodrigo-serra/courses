// Color Schemes from: https://observablehq.com/@d3/color-schemes
const COLORMAP = ["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"];
COLORMAP.reverse();

//Operator which loads the data from the current file
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(data) {

    // Vars for the svg "box"
    const w = 1100;
    const h = 450;
    const paddingHorizontal = 80;
    const paddingVertical = 50;
  
    // Monthly Variance vector from data
    const monthlyVariance = data.monthlyVariance;
    
    // Get the oldest date (Year) and the youngest, for later use
    const maxYear = d3.max(monthlyVariance, d => d.year);
    const minYear = d3.min(monthlyVariance, d => d.year);
    
    function generateDate(month){
        return (new Date(2021, month - 1, 1, 0, 0, 0, 0));
    }
  
    // Variable for storing the years
    const listYears = [];
    // Variable for storing variance
    const tempVar = [];
    // Variable to store the temperature per month/year
    // i.e. (baseTemperature + variance)
    const temp = [];
  
    // Generates dates for all points and fills the listYears var
    const yDataPoints = monthlyVariance.map(function(element){
        if (listYears.includes(element.year) == false)
            listYears.push(element.year);
        // Store Variance
        tempVar.push(element.variance);
        // Compute and store temperature
        temp.push(Math.round((data.baseTemperature + element.variance) *10)/10);
        return (generateDate(element.month));
    });

    // Var with the list of Months
    const listMonths = yDataPoints.slice(0, 12);
  
  
 //////////////////////////////////////////////////////////////////////////////////////////
    // Generate second tilte
    const secondTitle = d3.select(".headings")
                            .append("p")
                            .attr("class", "second_title")
                            .attr("id", "description")
                            .text(minYear + " - " + maxYear + ": base temperature " + data.baseTemperature + "ºC");
    
  
  
    // DRAW SVG
    const svg = d3.select(".box")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);
                    //.style("background", "pink");

  
  
  
    // ADDRESSING Y AXIS FIRST
    // Generate dates for the Y axis
    // It only matters the month. The remaining variables should be the same for all points.
    // yScale for the dates. d3.scaleBand instead.
    const yScale = d3.scaleBand()
                    .domain(listMonths)
                    .range([h - paddingVertical, paddingVertical]);
    
    // yScale2 to the build the dataPoints
    const yScale2 = d3.scaleBand()
                    .domain(listMonths)
                    .range([paddingVertical, h - paddingVertical]);
  
    // Instead of dates, the points are represented as Months (e.g. January)
    const yAxis = d3.axisLeft(yScale2).tickFormat(d3.timeFormat("%B"));
  
  
  
  
    // ADDRESSING X AXIS
    const xScale = d3.scaleBand()
                    .domain(listYears)
                    .range([paddingHorizontal, w - paddingHorizontal]);
  
    // The tickValues allows the x axis to be represented from 10 to 10 years
    const xAxis = d3.axisBottom(xScale).tickValues(xScale.domain().filter(year => year % 10 === 0));  
  
  
  
  
  
    // DRAW AXIS
    svg.append("g")
        .attr("transform", "translate(0," + (h - paddingVertical) + ")")
        .call(xAxis)
        .attr("id", "x-axis");
    // -1 to bring the axis slightly to the left. Bars were being generated above the axis
    // and so one couldn't see it.
    svg.append("g")
        .attr("transform", "translate(" + (paddingHorizontal - 1) + ",0)")
        .call(yAxis)
        .attr("id", "y-axis");
  
  
    // Y AXIS NAME
    // In both axis the x coordinates aim at centering both names.
    // That's why its used h, w, paddingVerical and paddingHorizontal.
    // The y is generated from the padding variable.
    // Important to note that the x axis is rotated ('transform').
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', ((h - 2*paddingVertical)/2 + paddingVertical)* -1)
        .attr('y', paddingHorizontal/3)
        .style("font-family", "Opens Sans")
        .style("font-size", "20px")
        .text('Months');
    // X AXIS NAME
    svg.append('text')
        .attr('x', (w - 2*paddingHorizontal)/2 + paddingHorizontal)
        .attr('y', h - paddingVertical/4)
        .style("font-family", "Opens Sans")
        .style("font-size", "20px")
        .text('Years');
  
  
  
    // COLOR FOR DATA POINTS
    // scaleQuantize to select the thresholds automatically
    // See https://observablehq.com/@d3/quantile-quantize-and-threshold-scales
    const color = d3.scaleQuantize()
                    .domain([d3.min(temp), d3.max(temp)])
                    .range(COLORMAP);
  
 
  
  
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
            .attr("data-year", d.year);
    }
    const mouseleave = function(d, i) {
        Tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        
        d3.select(this)
        .style("stroke", "none");
    }
    
    function buildInfo(d, i){
        let dateInfo = d.year + " - " + numberToMonth(d.month) +"<br>";
        let temperature = "T: " + temp[i] + "ºC<br>";
        let tVar = "Var(T): " + tempVar[i] + "ºC<br>";
        return dateInfo + temperature + tVar;
    }
  
    function numberToMonth(num) {
        switch(num) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            default:
                return "December";
        }
    }
  
    // DATA POINTS
    svg.selectAll()
        .data(monthlyVariance)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", (d, i) => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", (d, i) => temp[i])
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale2(generateDate(d.month)))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale2.bandwidth())
        .style("fill", (d, i) => color(temp[i]))
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave);
  
  
  ////////////////////////////////////////////////////////////////////////////////////////
    // LEGEND
    // See very useful libraries:
    // https://observablehq.com/@d3/color-legend
    // http://bl.ocks.org/syntagmatic/29bccce80df0f253c97e
    
    // Generating thresholds for colors, i.e first color corresponds to [1.7, 3.1], and so on
    const colorThresholds = [];
    COLORMAP.forEach(function(element, i) {
        let interval = color.invertExtent(element);
        colorThresholds.push(Math.round(interval[0] * 10) / 10);
        if(i === COLORMAP.length - 1)
            colorThresholds.push(Math.round(interval[1] * 10) / 10)
    });
  
    // Vars for SVG
    const hLegend = 110;
    const wLegend = 490;
    const padding = 50;
    const heightRect = 30;
  
    // SVG for legend
    const svgLegend = d3.select(".info")
                    .append("svg")
                    .attr("width", wLegend)
                    .attr("height", hLegend);
                    //.style("background", "pink");
  
  
    const x = d3.scaleLinear()
                .domain(d3.extent(colorThresholds))
                .range([padding, wLegend - padding]);
  
    const xLegend = d3.axisBottom(x).tickValues(colorThresholds).tickFormat(d3.format(".1f")).tickSize(10);
  
  
    svgLegend.append("g")
            .attr("transform", "translate(0," + (hLegend/2) + ")")
            .call(xLegend);
  
    // This step is really important. Separate "g" => axis, from "g" => legend
    const legend = svgLegend.append("g")
                            .attr("id", "legend");
  
    // Extra array which is a copy of colorThreshold except for the first element.
    // One must also remove the last element in the original array.
    // This way, it's possible to iterate over all elements.  
    const colorThresholdsShift = colorThresholds.slice(1, colorThresholds.length);
    colorThresholds.pop();
  
    // In the fill attr, one was added so the color could be attributed to a number in the
    // middle of the interval, i.e, [1.7, 3.1] => 2.7
    legend.selectAll()
        .data(colorThresholds)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(d))
        .attr("y", hLegend/2 - heightRect)
        .attr("width", (d, i) => x(colorThresholdsShift[i]) - x(d))
        .attr("height", heightRect)
        .style("fill", (d, i) => color(d + 1));

  
  
  
  
    // TESTS
    //console.log(document.querySelectorAll("#legend rect").length);
  
});
