// Publically available graph functions to clear out html file page clutter (hopefully).

// Import hopefully all necessary stuff in here
import {
    select,
    selectAll,
    geoEquirectangular,
    geoPath,
    axisBottom,
    scaleLinear,
    axisLeft,
    axisRight,
    ticks,
    csv,
    group,
    pointer,
    timeParse,
    area,
    min,
    scaleTime,
    format,
    bisector,
    timeFormat,
    line,
    max,
    scaleOrdinal,
    extent,
} from "https://cdn.skypack.dev/d3@7";




// Now we can begin - lets remake the simple line graph on the home page
// Note that this should be called within the useEffect hook on react.
export function createSimpleLineGraphTimeSeriesCSV(csvLink, divId, margin, width, height, cutOff, annotation, annotations, tickCount) {

    // Create the SVG element to use
    // Use a viewbox to make them re-sizable
    // Note that diplay: flex and justify content center vanishes any viewbox graph
    // IDK why but dont house the divs inside another div with those aspects.
    var svg = select(divId)
        .append("svg")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Read in the CSV file for use
    csv(csvLink,

        // Format variables
        function (d) {
            return { date: timeParse("%Y-%m-%d")(d.date), value: d.value }
        }).then(

            // Now I can use this dataset:
            function (data) {

                // Filter data to a certain point
                if (cutOff == true) {
                    var cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 150);
                    data = data.filter(function (d) {
                        return d.date > cutoffDate
                    })
                }

                // Add X axis --> it is a date format
                const x = scaleTime()
                    .domain(extent(data, function (d) { return d.date; }))
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(axisBottom(x).ticks(tickCount).tickSizeOuter(0));

                // Add Y axis
                const y = scaleLinear()
                    .domain([0, max(data, function (d) { return +d.value; })])
                    .range([height, 0]);
                svg.append("g")
                    .call(axisLeft(y).tickSizeOuter(0));

                // Add the line
                svg.append("path")
                    .datum(data)
                    .attr("d", line()
                        .x(function (d) { return x(d.date) })
                        .y(function (d) { return y(d.value) })
                    )
                    .attr("class", "line")

            }
        )
}

// Election scatter plots.
export function buildScatterPlotTimeCSV(csvLink, divId, margin, width, height, cutOff, sub_links, labels, annotation, annotations, min_zero, timeFormatCheck) {
    // Create the SVG element to use
    // Use a viewbox to make them re-sizable
    // Note that diplay: flex and justify content center vanishes any viewbox graph
    // IDK why but dont house the divs inside another div with those aspects.
    var svg = select(divId)
        .append("svg")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Read in the CSV file for use
    csv(csvLink,

        // Format variables
        function (d) {
            return { date: timeParse("%Y-%m-%d")(d.end_date), value: d.value, name: d.variable }
        }).then(

            // Now I can use this dataset:
            function (data) {

                // Filter data to a certain point
                if (cutOff == true) {
                    var cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 150);
                    data = data.filter(function (d) {
                        return d.date > cutoffDate
                    })
                }

                // X scale based on date
                let xDomain = extent(data, function (d) { return d.date; });

                const x = scaleTime()
                    .domain(xDomain)
                    .range([0, width]);

                if (timeFormatCheck == true) {
                    svg.append("g")
                        .attr("transform", `translate(0, ${height})`)
                        .call(axisBottom(x).tickFormat(timeFormat("%m/%y")).tickSizeOuter(0));
                } else {
                    svg.append("g")
                        .attr("transform", `translate(0, ${height})`)
                        .call(axisBottom(x).tickSizeOuter(0));
                }

                function formatTick(d) {
                    const s = (d).toFixed(1);
                    return this.parentNode.nextSibling ? `\xa0${s}` : `% ${s}`;
                }

                // Y scale based on value
                let yDomain = [0, max(data, function (d) { return +d.value; })];
                if (min_zero != true) {
                    yDomain = [min(data, function (d) { return +d.value; }) - 5, max(data, function (d) { return +d.value; }) + 5];
                }

                const y = scaleLinear(yDomain)
                    .domain(yDomain)
                    .range([height, 0]);

                svg.append("g")
                    .call(axisLeft(y).tickFormat(formatTick).tickSizeOuter(0));

                const xAxisGrid = axisBottom(x).tickSize(-height).tickFormat('').ticks(15).tickSizeOuter(0);
                const yAxisGrid = axisLeft(y).tickSize(-width).tickFormat('').ticks(10).tickSizeOuter(0);

                // add the X gridlines
                svg.append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("stroke-width", 0.5)
                    .call(xAxisGrid)

                // add the Y gridlines
                svg.append("g")
                    .attr("class", "grid")
                    .attr("stroke-width", 0.5)
                    .call(yAxisGrid)



                // Colours for Aus parties
                const color = scaleOrdinal()
                    .domain(labels[0])
                    .range(labels[1])

                // Add dots
                svg.append('g')
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function (d) { return "dot " + d.name })
                    .attr("cx", function (d) { return x(d.date); })
                    .attr("cy", function (d) { return y(d.value); })
                    .attr("r", 2)
                    .style("fill", function (d) { return color(d.name) })

                // Add in CI

                for (let i = 0; i < sub_links[0].length; i++) {
                    // Import data
                    csv(sub_links[0][i],

                        // Format import.
                        function (d) {
                            return { date_line: timeParse("%Y-%m-%d")(d.end_date), value_line: d.smooth, name_line: d.variable, cit: d.ci_top, cib: d.ci_bot }
                        }).then(function (data_int) {

                            // Filter data to a certain point
                            if (cutOff == true) {
                                var cutoffDate = new Date();
                                cutoffDate.setDate(cutoffDate.getDate() - 150);
                                data_int = data_int.filter(function (d) {
                                    return d.end_date > cutoffDate
                                })
                            }

                            // Show confidence interval
                            svg.append("path")
                                .datum(data_int)
                                .attr("fill", sub_links[1][i])
                                .attr("stroke", "none")
                                .style("opacity", 0.3)
                                .attr("class", function (d) { return sub_links[0][i] })
                                .attr("d", area()
                                    .x(function (d) { return x(d.date_line) })
                                    .y0(function (d) { return y(d.cit) })
                                    .y1(function (d) { return y(d.cib) })
                                )

                            // Show line
                            svg.append("path")
                                .datum(data_int)
                                .attr("fill", "none")
                                .attr("class", function (d) { return sub_links[0][i] })
                                .attr("stroke", sub_links[2][i])
                                .attr("stroke-width", 2)
                                .attr("d", line()
                                    .x(function (d) { return x(d.date_line) })
                                    .y(function (d) { return y(d.value_line) }).defined(function (d) { return d.value_line; })
                                )

                        })
                }

                // Legend
                for (let i = 0; i < labels[0].length; i++) {
                    svg.append("circle").attr("cx", `${i * 150} `).attr("cy", `${height + 40}`).attr("r", 5).style("fill", labels[1][i])
                    svg.append("text").attr("x", `${i * 150 + 20} `).attr("y", `${height + 45}`).text(labels[2][i]).style("font-size", "12px").style("fill", "var(--text)").attr("alignment-baseline", "middle")
                }

               

                // Legend
                for (let i = 0; i < labels[0].length; i++) {
                    svg.append("circle").attr("cx", `${i * 150} `).attr("cy", `${height + 40}`).attr("r", 5).style("fill", labels[1][i])
                    svg.append("text").attr("x", `${i * 150 + 20} `).attr("y", `${height + 45}`).text(labels[2][i]).style("font-size", "12px").style("fill", "var(--text)").attr("alignment-baseline", "middle")
                }
            }
        )
}

// Multiple graphs in one svg
export function creatMultiTimeSeriesGraphCSV(csvLink, divId, margin, width, height, cutOff, annotation, annotations, tickCount) {

    // Read in the CSV file for use
    csv(csvLink,

        // Format variables
        function (d) {
            return { date: timeParse("%Y-%m-%d")(d.date), value: d.value, name: d.name }
        }).then(

            // Now I can use this dataset:
            function (data) {

                // group the data: I want to draw one line per group
                var sumstat = group(data, d => d.name) // nest function allows to group the calculation per level of a factor


                // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
                const svg = select(divId)
                    .selectAll("uniqueChart")
                    .data(sumstat)
                    .enter()
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        `translate(${margin.left},${margin.top})`);

                // Filter data to a certain point
                if (cutOff == true) {
                    var cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 150);
                    data = data.filter(function (d) {
                        return d.date > cutoffDate
                    })
                }

                // Add X axis --> it is a date format
                const x = scaleTime()
                    .domain(extent(data, function (d) { return d.date; }))
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(axisBottom(x).tickFormat(timeFormat("%b")).ticks(tickCount).tickSizeOuter(0));

                // Add Y axis
                const y = scaleLinear()
                    .domain([0, max(data, function (d) { return +d.value; })])
                    .range([height, 0]);
                svg.append("g")
                    .call(axisLeft(y).tickSizeOuter(0));

                // Draw the line
                svg
                    .append("path")
                    .attr("fill", "none")
                    .attr("d", function (d) {
                        return line()
                            .x(function (d) { return x(d.date); })
                            .y(function (d) { return y(+d.value); })
                            (d[1])
                    })
                    .attr("class", "line")

                // Add titles
                // Add titles
                svg
                    .append("text")
                    .attr("text-anchor", "start")
                    .attr("y", -5)
                    .attr("x", 0)
                    .text(function (d) {
                        if (d[0] == 'Campbelltown (C) (NSW)') {
                            return ('Campbelltown (C)')
                        } else if (d[0] == 'Canterbury-Bankstown (A)') {
                            return ('C-burry-Bankstown (A)')
                        } else {
                            return (d[0])
                        }
                    })
                    .attr("class", "graphText")
            }
        )
}

// Function to make a two line graph (used mostly in footnotes to the bus artile)
export function createDoubleLineGraphTimeSeriesCSV(csvLink, divId, margin, width, height, cutOff, tickCount, colourTwo, legend) {

    // Create the SVG element to use
    // Use a viewbox to make them re-sizable
    // Note that diplay: flex and justify content center vanishes any viewbox graph
    // IDK why but dont house the divs inside another div with those aspects.
    var svg = select(divId)
        .append("svg")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Read in the CSV file for use
    csv(csvLink,

        // Format variables
        function (d) {
            return { date: timeParse("%Y-%m-%d")(d.date), value1: d.value1, value2: d.value2 }
        }).then(

            // Now I can use this dataset:
            function (data) {

                // Filter data to a certain point
                if (cutOff == true) {
                    var cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 150);
                    data = data.filter(function (d) {
                        return d.date > cutoffDate
                    })
                }

                // Add X axis --> it is a date format
                const x = scaleTime()
                    .domain(extent(data, function (d) { return d.date; }))
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(axisBottom(x).ticks(tickCount).tickSizeOuter(0));

                // First y axis
                const y1 = scaleLinear()
                    .domain([0, max(data, function (d) { return +d.value1; })])
                    .range([height, 0]);
                svg.append("g")
                    .call(axisLeft(y1).tickFormat(function (d) {
                        if (d > 1000000) {
                            return d / 1000000 + " Million"
                        } else {
                            return d
                        }
                    }));

                // Second y axis
                const y2 = scaleLinear()
                    .domain([0, max(data, function (d) { return +d.value2; })])
                    .range([height, 0]);
                svg.append("g")
                    .attr("class", colourTwo[0])
                    .attr("transform", "translate( " + width + ", 0 )")
                    .call(axisRight(y2).tickFormat(function (d) {
                        if (d > 1000000) {
                            return d / 1000000 + " Million"
                        } else {
                            return d
                        }
                    }));

                var valueline = line()
                    .x(function (d) { return x(d.date); })
                    .y(function (d) { return y1(d.value1); });

                var valueline1 = line()
                    .x(function (d) { return x(d.date); })
                    .y(function (d) { return y2(d.value2); });

                // Add lines
                svg.append("path")
                    .data([data])
                    .attr("class", "line")
                    .style("fill", "none")
                    .attr("d", valueline);

                svg.append("path")
                    .data([data])
                    .attr("class", colourTwo[1])
                    .style("fill", "none")
                    .attr("d", valueline1);

                // Add legend
                svg.append("circle").attr("cx", 100).attr("cy", 130).attr("r", 6).style("fill", "var(--graph)")
                svg.append("circle").attr("cx", 100).attr("cy", 160).attr("r", 6).style("fill", colourTwo[2])
                svg.append("text").attr("x", 120).attr("y", 135).text(legend[0]).style("font-size", "15px").attr("alignment-baseline", "middle").style("fill", "var(--text)")
                svg.append("text").attr("x", 120).attr("y", 165).text(legend[1]).style("font-size", "15px").attr("alignment-baseline", "middle").style("fill", "var(--text)")
            }
        )
}