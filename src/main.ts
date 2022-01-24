import * as d3 from 'd3';
import { DSVRowArray, DSVRowString } from 'd3';


window.addEventListener('load', () => {
    init();
}, false);

let width: number = 120;
let height: number = 120;
let marginTop: number = 20;
let marginRight: number = 0;
let marginBottom: number = 30;
let marginLeft: number = 40;

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

    // 最大値を求める (これをしないと縦軸のスケールが揃わない)
    let max: number = 0;
    keys.forEach(key => {
        if (key != 'ALL' && key != 'Date') {
            let tmp: number = Number(d3.max(data, (d) => +Number(d[key])));
            if (tmp > max) {
                max = tmp;
            }
        }
    })

    keys.forEach(key => {

        if (key != 'ALL' && key != 'Date') {

            // SVGの設定
            const svg: any = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            // x axis
            let xScale: any = d3.scaleTime()
                .domain(<Date[]>d3.extent(data, (d: DSVRowString) => new Date(String(d.Date))))
                .range([0, chartWidth]);

            const xAxis: any = svg.append("g")
                .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
                .call(
                    d3.axisBottom(xScale)
                        .ticks(3)
                        .tickFormat(<any>d3.timeFormat("%y/%m/%d")));

            xAxis.selectAll("text")
                .attr("text-anchor", "end")
                .attr("font-size", "7px")
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
                .call(d3.axisLeft(yScale).ticks(3));

            yAxis.selectAll("text")
                .attr("text-anchor", "end")
                .attr("font-size", "7px")
                .attr("font-family", "Arial");



            // 折線
            const line: any = d3.line()
                .x((d: any) => xScale(new Date(String(d.Date))))
                .y((d: any) => yScale(Number(d[key])));

            // 描画
            svg.append("path")
                .datum(data)
                .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);
                    
            // ラベル
            svg.append("text")
                .attr("text-anchor", "start")
                .attr("y", 15)
                .attr("x", 15)
                .attr("font-size", "10px")
                .attr("font-family", "Arial")
                .text(key);
        }
    });

}