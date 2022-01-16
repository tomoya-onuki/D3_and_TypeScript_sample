import * as d3 from 'd3';
import { DSVRowArray, DSVRowString, group, stack, text } from 'd3';


window.addEventListener('load', () => {
    init();
}, false);

let width: number = 600;
let height: number = 600;
let marginTop: number = 50;
let marginRight: number = 20;
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

    // 積み上げデータの生成
    // 使うキー
    const keys: string[] = ["Tokyo", "Saitama", "Kanagawa", "Chiba", "Tochigi", "Gunma", "Ibaraki"];
    const stakedData: any = d3.stack()
        .offset(d3.stackOffsetWiggle)
        .keys(keys)(<any>data);

    // 一番上に積み上げられたデータの最大値,最小値
    let max: number = Number(d3.max(stakedData[keys.length - 1], (d: any) => +Number(d[1])));

    // x axis
    let xScale: any = d3.scaleTime()
        .domain(<any>d3.extent(data, (d) => new Date(String(d.Date))))
        .range([0, chartWidth]);
    let xLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
        .call(d3.axisBottom(xScale).tickFormat(<any>d3.timeFormat("%y/%m/%d")));


    // y axis
    let yScale: any = d3.scaleLinear()
        .domain([-max, max])
        .range([chartHeight, 0]);
    let yLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .call(d3.axisLeft(yScale));

    const colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(["#007FB1", "#3261AB", "#009F8C", "#6A8CC7", "#44A5CB", "#40BFB0", "#99CFE5"]);
        
    // 面を作成
    const area: any = d3.area()
        .x((d: any) => xScale(new Date(String(d.data.Date))))
        .y0((d: any) => yScale(Number(d[0])))
        .y1((d: any) => yScale(Number(d[1])));

    // 描画
    svg.selectAll("mylayers")
        .data(stakedData)
        .join("path")
        .style("fill", (d: any) => colorScale(d.key))
        .style("stroke", (d: any) => colorScale(d.key))
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .attr("d", area);


}

