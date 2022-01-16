import * as d3 from 'd3';
import { DSVRowArray, DSVRowString } from 'd3';


window.addEventListener('load', () => {
    init();
}, false);

let width: number = 800;
let height: number = 600;
let marginTop: number = 50;
let marginRight: number = 100;
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

    // キーを取り出す
    let keys: string[] = Object.keys(data[0]);

    // 全体の最大値(全国は除く)を求める
    let max: number = 0;
    keys.forEach(key => {
        if (key != 'ALL' && key != 'Date') {
            let tmp: number = Number(d3.max(data, (d) => +Number(d[key])));
            if (tmp > max) {
                max = tmp;
            }
        }
    });


    // SVGの設定
    const svg: any = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // x axis
    let xScale: any = d3.scaleTime()
        .domain(<any>d3.extent(data, (d) => new Date(String(d.Date))))
        .range([0, chartWidth]);

    const xAxis: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
        .call(
            d3.axisBottom(xScale)
                .ticks(10)
                .tickFormat(<any>d3.timeFormat("%y/%m/%d")));

    xAxis.selectAll("text")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("font-family", "Arial")
        .attr("x", "-5")
        .attr("y", "1")
        .attr("transform", "rotate(-45)");

    // y axis
    let yScale: any = d3.scaleLinear()
        .domain([0, max])
        .range([chartHeight, 0]);

    const yAxis: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .call(d3.axisLeft(yScale).ticks(10));

    yAxis.selectAll("text")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("font-family", "Arial");

    const colorScale = d3.scaleOrdinal()
        .range(['#3261ab', '#d5e0f1']);



    let labelY: number = marginTop;
    let i: number = 0;
    keys.forEach(key => {
        if (key != 'ALL' && key != 'Date') {

            // 折線
            const line: any = d3.line()
                .x((d: any) => xScale(new Date(String(d.Date))))
                .y((d: any) => yScale(Number(d[key])));

            const color: string = "hsla(" + String(360 / keys.length * i) + ", 100%, 75%, 1.0)";
            i++;

            // 描画
            let path: any = svg.append("path")
                .datum(data)
                .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 1.5)
                .attr("d", line);

            svg.append("text")
                .attr("text-anchor", "start")
                .attr("y", labelY += 11)
                .attr("x", marginLeft + chartWidth + 20)
                .attr("fill", color)
                .attr("font-size", "10px")
                .attr("font-family", "Arial")
                .text(key);
        }
    });

}