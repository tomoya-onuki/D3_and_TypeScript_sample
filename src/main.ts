import * as d3 from 'd3';
import { DSVRowArray, DSVRowString } from 'd3';


window.addEventListener('load', () => {
    init();
}, false);

let width: number = 600;
let height: number = 600;
let marginTop: number = 50;
let marginRight: number = 50;
let marginBottom: number = 50;
let marginLeft: number = 50;

function init(): void {

    // データの読み込み
    d3.csv("../data/newly_confirmed_cases_daily.csv")
        .then((data) => {
            draw(data);
        })
        .catch((error) => {
            console.log(error)
        });
}


function draw(data: DSVRowArray): void {

    let chartWidth: number = width - marginLeft - marginRight;
    let chartHeight: number = height - marginTop - marginBottom;

    // SVGの設定
    const svg: any = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // x axis
    let xScale: any = d3.scaleTime()
        .domain(<Date[]>d3.extent(data, (d: DSVRowString) => new Date(String(d.Date)) ))
        .range([0, chartWidth]);
    svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
        .call(d3.axisBottom(xScale).tickFormat(<any>d3.timeFormat("%y/%m/%d")));


    // y axis
    let yScale: any = d3.scaleLinear()
        .domain([ 0, Number(d3.max(data, (d) => +Number(d.ALL) )) ])
        .range([chartHeight, 0]);
    svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .call(d3.axisLeft(yScale));


    // 面
    const area: any = d3.area()
        .x((d: any) => xScale(new Date(String(d.Date))))
        .y0(yScale(0))
        .y1((d: any) => yScale(Number(d.ALL)));

    // 描画
    svg.append("path")
        .datum(data)
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .attr("stroke", "none")
        .attr("fill", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", area);


}