import * as d3 from 'd3';
import { DSVRowArray, DSVRowString } from 'd3';


window.addEventListener('load', () => {
    init();
}, false);

let width: number = 500;
let height: number = 100;
let marginTop: number = 10;
let marginRight: number = 20;
let marginBottom: number = 20;
let marginLeft: number = 10;

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

    const keys: string[] = Object.keys(data[0]);
    // const keys: string[] = ["Tokyo", "Saitama", "Kanagawa", "Chiba", "Aichi", "Osaka", "Fukuoka", "Okinawa"];

    // 最大値を求める (これをしないと縦軸のスケールが揃わない)
    let max: number = 0;
    keys.forEach(key => {
        if (key != 'ALL' && key != 'Date') {
            let tmp: number = Number(d3.max(data, (d) => +Number(d[key])));
            if (tmp > max) {
                max = tmp;
            }
        }
    });

    const vAxisMax: number = 500; // 縦軸のメモリの上限
    const div: number = Math.floor(max / vAxisMax); // 分割数

    let count: number = 0;
    keys.forEach((key: string) => {
        if (key != 'ALL' && key != 'Date') {

            // SVGの設定
            const svg: any = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            let horizonData: any = horizon(data, div, vAxisMax, key);

            // x axis
            const term = <any>d3.extent(data, (d) => new Date(String(d.Date)));
            let xScale: any = d3.scaleTime()
                .domain(term)
                .range([0, chartWidth]);
            svg.append("g")
                .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
                .call(d3.axisBottom(xScale).ticks(10).tickFormat(<any>d3.timeFormat("%y/%m/%d")).tickSize(1));


            // y axis
            let yScale: any = d3.scaleLinear()
                .domain([0, max / div])
                .range([chartHeight, 0]);
            svg.append("g")
                .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
                .call(d3.axisLeft(yScale).ticks(0).tickSize(0));


            horizonData.forEach((data0: any, i: number) => {

                // カラーラベル
                let lightness: string = String(90 - 90 * i / div);
                let color: string = "hsl(225, 60%, " + lightness + "%)";
                let vMargin: number = 0;
                let hMargin: number = i;
                if (i > div / 2) {
                    vMargin = 10;
                    hMargin = i - Math.floor(div/2);
                }
                if (count === 0) {
                    svg.append("text")
                        .attr("text-anchor", "end")
                        .attr("y", marginTop + 10 + vMargin)
                        .attr("x", marginLeft + 100 + 75 * hMargin)
                        .attr("font-size", "10px")
                        .attr("font-family", "Arial")
                        .attr("fill", color)
                        .text("・" + String(Math.floor(i * vAxisMax)) + " ~ " + String(Math.floor((i + 1) * vAxisMax)));
                }

                

                // 面
                const area: any = d3.area()
                    .x((d: any) => xScale(new Date(String(d.Date))))
                    .y0(yScale(0))
                    .y1((d: any) => yScale(Number(d[key])));


                // 描画
                svg.append("path")
                    .datum(data0)
                    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
                    .attr("stroke", "none")
                    .attr("fill", color)
                    .attr("stroke-width", 1.5)
                    .attr("d", area);
            });

            count++;
            // ラベル
            svg.append("text")
                .attr("text-anchor", "start")
                .attr("y", marginTop + 10)
                .attr("x", marginLeft + 5)
                .attr("font-size", "10px")
                .attr("font-family", "Arial")
                .text(key);
        }
    });
}

function horizon(data: DSVRowArray, div: number, vAxisMax: number, key: string): any {

    // 初期化
    let newData: any[][] = new Array(div);
    for (let i = 0; i < div; i++) {
        newData[i] = new Array(data[0].length);
    }

    data.forEach((d: any, i: number) => {

        let value: number = Number(d[key]);

        for (let j = 0; j < div; j++) {
            if (value < j * vAxisMax) {
                newData[j][i] = { [key]: 0, Date: d.Date };
            }
            else if (j * vAxisMax <= value && value < (j + 1) * vAxisMax) {
                newData[j][i] = { [key]: value - vAxisMax * j, Date: d.Date };
            }
            else if ((j + 1) * vAxisMax <= value) {
                newData[j][i] = { [key]: vAxisMax, Date: d.Date };
            }
        }

    });

    // console.log(newData);
    return newData;
}