import * as d3 from 'd3';
import { DSVRowArray, DSVRowString } from 'd3';


window.addEventListener('load', () => {
    init();
}, false);

let width: number = 400;
let height: number = 400;
let marginTop: number = 50;
let marginRight: number = 50;
let marginBottom: number = 50;
let marginLeft: number = 50;

function init(): void {


    // SVGの設定
    const svg: any = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // データの読み込み
    // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
    d3.csv("../data/temperature.csv")
        .then((data) => {
            draw(svg, data);
            // console.log(data);

        })
        .catch((error) => {
            console.log(error)
        });
}

function draw(svg: any, data: DSVRowArray): void {

    let chartWidth: number = width - marginLeft - marginRight;
    let chartHeight: number = height - marginTop - marginBottom;

    // x axis
    let xScale: any = d3.scaleLinear()
        .domain([1, 12])
        .range([0, chartWidth]);
    svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + Number(marginTop+chartHeight) + ")")
        .call(d3.axisBottom(xScale));


    // y axis
    let yScale: any = d3.scaleLinear()
        .domain([
            Number(d3.min(data, function (d) { return +Number(d.temp) })),
            Number(d3.max(data, function (d) { return +Number(d.temp) }))
        ])
        .range([chartHeight, 0]);
    svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .call(d3.axisLeft(yScale));


    const line: any = d3.line()
        .x((d: any) => xScale(d.month))
        .y((d: any) => yScale(d.temp));

    svg.append("path")
        .datum(data)
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
        

}