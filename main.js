
function drawPlot(dataset){

    const w = 1500;
    const h = 700;
    const padding = 70;
    const monthlyVariance = dataset.monthlyVariance;
    // console.log(monthlyVariance)

    const monthNames = ["January","February","March","April","May","June","July","August",
        "September","October","November","December"];
    const colors = ["#1B5E20","#388E3C","#4CAF50","#81C784","#C8E6C9","#FFE0B2","#FFB74D",
        "#FF9800","#F57C00","#E65100","#DD2C00"];

    // const colors = ["#f9f1cf","#df96dc","#ce0a3b","#630944","#49062e","#76167c","#943e3e",
    //     "#d297dd","#88f4e1","#2b3256","#DD2C00"];

    const minYear = d3.min(monthlyVariance,function (d) {
        return d.year;
    });
    const maxYear = d3.max(monthlyVariance,function (d) {
        return d.year;
    });

    const svg = d3.select("#main").append("svg").attr("width",w).attr("height",h);


    var yScale = d3.scaleBand()
        .domain([0,1,2,3,4,5,6,7,8,9,10,11])
        .range([padding,h-padding]);

    var xScale = d3.scaleLinear()
        .domain([minYear,maxYear])
        .range([padding, w-padding]);

    var tooltip = d3.select("body").append("div").attr("class","tooltip").attr("id","tooltip");

    //define axis

    const yAxis = d3.axisLeft(yScale)
        .tickValues(yScale.domain())
        .tickFormat(function (d) {
            return monthNames[d];
        })
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"))
        .ticks(26);


    //rect drawing

    const widthConst = parseFloat(w/(maxYear-minYear));
    const heightConst = yScale.bandwidth();
    console.log(widthConst);

    svg.selectAll("rect")
        .data(monthlyVariance)
        .enter()
        .append("rect")
        .attr("class","cell")
        .attr("x",(d)=>{
            return xScale(d.year)
        })
        .attr("y",(d)=>{
            return yScale(d.month-1);
        })
        .attr("width",widthConst)
        .attr("height",heightConst)
        .attr("data-month",(d)=>d.month-1)
        .attr("data-year",(d)=>d.year)
        .attr("data-temp",(d)=>d.variance)
        .style("fill",(d,i)=>{

            const temp =  parseFloat(d.variance + dataset.baseTemperature);

            if(temp < 2.8)
                return colors[0];
            else if(temp < 3.9)
            {
                return colors[1];
            }
            else if(temp < 5.0)
            {
                return colors[2];
            }
            else if(temp < 6.1)
            {
                return colors[3];
            }

            else if(temp < 7.2)
            {
                return colors[4];
            }
            else if(temp < 8.3)
            {
                return colors[5];
            }
            else if(temp < 9.4)
            {
                return colors[6];
            }
            else if(temp < 10.5)
            {
                return colors[7];
            }
            else if(temp < 11.6)
            {
                return colors[8];
            }
            else if(temp < 12.7)
            {
                return colors[9];
            }
            else
            {
                return colors[10];
            }

        })
        .on("mouseover",function (d,i) {
            var tempCalc = parseFloat(d.variance + dataset.baseTemperature);
            tooltip.attr("data-year",d.year)
                .style("left",d3.event.pageX + 20 + "px")
                .style("top",d3.event.pageY + 20 + "px")
                .style("display","inline-block")
                .style("opacity",1)
                .html("Variance: " + d.variance + "<br>" + "temperature: " + tempCalc.toFixed(1));
        })
        .on("mouseout",function (d) {
            tooltip.style("opacity",0)
        })

    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 + padding-60)
        .attr("x", 0-h/2.5)
        .attr("dy","1em")
        .style("text-anchor","middle")
        .text("Months");

    svg.append("text")
        .attr("transform","translate(680,"+(h-padding+40)+")")
        .style("text-anchor","middle")
        .text("Year");

    //appending axis
    svg.append("g")
        .attr("transform","translate("+padding+","+0+")")
        .attr("id","y-axis")
        .call(yAxis)
    svg.append("g")
        .attr("transform","translate(0,"+(h-padding)+")")
        .attr("id","x-axis")
        .call(xAxis);


    const legendsvg = d3.select("#main")
        .append("svg")
        .attr("class","svglegend")
        .attr("width",w)
        .attr("height",60)
        .attr("x",padding)
        .attr("y",h)
        .attr("id","legend");

    const xScaleLegend = d3.scaleLinear().domain([0,9]).range([padding,(w/3)-padding]);

    const xAxisLegend = d3.axisBottom(xScaleLegend).tickFormat(function (d,i) {
        const scaleLabel = (2.8 + (1.1*(i)));
        return scaleLabel.toFixed(1);
    })
    legendsvg
        .append("g")
        .attr("transform", "translate(0," + (40) + ")")
        .attr("id", "x-axislegend")
        .call(xAxisLegend);

    legendsvg
        .selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", (d,i)=>{
            return xScaleLegend(i-1);
        })
        .attr("y", (d) => {
            return 10;
        })
        .attr("width", 50)
        .attr("height", 30)
        .style("fill",(d,i)=>{
            return colors[i];
        })



}

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",function (data) {
    var dataset = data;
    // console.log(dataset)
    drawPlot(dataset);
})