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
    d3.csv("./temperature.csv")
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
        .domain([1, 12])
        .range([0, chartWidth]);
    let xLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
        .call(d3.axisBottom(xScale));

    xLabel.selectAll("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "Arial")

    svg.append("text")
        .attr("y", height - 10)
        .attr("x", chartWidth / 2 + marginLeft)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "Arial")
        .text("月")

    // y axis
    let yScale: any = d3.scaleLinear()
        .domain([0, 30])
        .range([chartHeight, 0]);
    let yLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .call(d3.axisLeft(yScale));

    yLabel.selectAll("text")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("font-family", "Arial")

    svg.append("text")
        .attr("y", height / 2)
        .attr("x", 40)
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("font-family", "Arial")
        .text("気温(℃)")


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

    svg.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop - 10)
        .attr("font-size", "10px")
        .attr("text-anchor", "top")
        .attr("font-family", "Arial")
        .text("月平均気温の推移(東京都)");
}