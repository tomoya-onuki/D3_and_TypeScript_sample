import * as d3 from 'd3';
import { DSVRowArray, DSVRowString } from 'd3';


window.addEventListener('load', () => {
    init();
}, false);

let width: number = 400;
let height: number = 300;
let marginTop: number = 50;
let marginRight: number = 10;
let marginBottom: number = 50;
let marginLeft: number = 70;

function init(): void {


    // SVGの設定
    const svg: any = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // データの読み込み
    d3.csv("../data/newly_confirmed_severe_cases_20220123.csv")
        .then((data) => {
            draw(svg, data);
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
        .domain(<Number[]>d3.extent(data, (d: DSVRowString) => Number(d.newly_confirmed)))
        .range([0, chartWidth]);
    let xLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
        .call(d3.axisBottom(xScale));

    xLabel.selectAll("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "Arial")


    // y axis
    let yScale: any = d3.scaleLinear()
        .domain(<Number[]>d3.extent(data, (d: DSVRowString) => Number(d.severe_cases)))
        .range([chartHeight, 0]);
    let yLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .call(d3.axisLeft(yScale));

    yLabel.selectAll("text")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("font-family", "Arial")

    svg.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", (d: DSVRowString) => xScale(d.newly_confirmed))
            .attr("cy", (d: DSVRowString) => yScale(d.severe_cases))
            .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
            .attr("r", 3)
            .attr("fill", "steelblue")
            .attr("stroke", "none")
}