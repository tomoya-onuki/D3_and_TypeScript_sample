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
    const colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(["#007FB1", "#3261AB", "#009F8C", "#6A8CC7", "#44A5CB", "#40BFB0", "#99CFE5"]);


    const keysList: string[][] = blaided(data, keys);


    // x axis
    let xScale: any = d3.scaleTime()
        .domain(<any>d3.extent(data, (d) => new Date(String(d.Date))))
        .range([0, chartWidth]);
    let xLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
        .call(d3.axisBottom(xScale).tickFormat(<any>d3.timeFormat("%y/%m/%d")));


    // y axis
    let yScale: any = d3.scaleLinear()
        .domain([0, 1000])
        .range([chartHeight, 0]);
    let yLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .call(d3.axisLeft(yScale));
    yLabel.selectAll("text")
        .attr("display", "none");




    // keys.forEach((key: string) => {

    // });
    const area: any[] = [];

    // 描画
    let path: any = svg.append("path")
        .datum(keysList)
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .style("fill", "none")
        // .style("stroke", (d: any) => colorScale(d.key))
        .style("stroke", "#00a0c")
        .attr("stroke-width", 1.5)
        .attr("d", area)


    // keysList.forEach((keys: string[], i: number) => {
    //     if (i < keysList.length - 1) {
    //         const area: any[] = [];

    //         keys.forEach((key: string) => {
    //             // 面を作成
    //             area.push(d3.area()
    //                 .x(xScale(data[i].Date))
    //                 .y0(0)
    //                 .y1(yScale(Number(data[i][key]))));
    //             // area.push(d3.area()
    //             //     .x(xScale(data[i+1].Date))
    //             //     .y0(0)
    //             //     .y1(yScale(Number(data[i+2][key]))));
    //         });

    //         // 描画
    //         let path: any = svg.append("path")
    //             .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
    //             .style("fill", "none")
    //             // .style("stroke", (d: any) => colorScale(d.key))
    //             .style("stroke", "#00a0c")
    //             .attr("stroke-width", 1.5)
    //             .attr("d", area)
    //     }
    // });

}



function blaided(data: DSVRowArray, keys: string[]): string[][] {
    let keysList: string[][] = [];
    data.forEach((d: any) => {

        // keyを昇順にソートする
        for (let i = 0; i < keys.length - 1; i++) {
            for (let j = 1; j < keys.length - i + 1; j++) {
                if (Number(d[keys[j - 1]]) > Number(d[keys[j]])) {
                    let tmp: string = keys[j - 1];
                    keys[j - 1] = keys[j];
                    keys[j] = tmp;
                }
            }
        }

        keysList.push(keys);
    });
    // keysList.forEach((keys, i) => {
    //     keys.forEach(key => {
    //         console.log(key, data[i][key]);
    //         // console.log(key, data[i][key]);
    //     });
    // });

    return keysList;
}