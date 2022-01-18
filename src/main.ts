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

let chartWidth: number = width - marginLeft - marginRight;
let chartHeight: number = height - marginTop - marginBottom;


function init(): void {

    // データの読み込み
    d3.csv("../data/test.csv")
        // d3.csv("../data/newly_confirmed_cases_daily.csv")
        .then((data) => {
            draw(data);
        })
        .catch((error) => {
            console.log(error)
        });
}


function draw(data: DSVRowArray): void {

    // SVGの設定
    const svg: any = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // 積み上げデータの生成
    // 使うキー
    // const keys: string[] = ["Tokyo", "Saitama", "Kanagawa", "Chiba", "Tochigi", "Gunma", "Ibaraki"];
    const keys: string[] = ["Tokyo", "Kanagawa"];
    const colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(["#007FB1", "#3261AB", "#009F8C", "#6A8CC7", "#44A5CB", "#40BFB0", "#99CFE5"]);


    const braidedData: string[][][] = braided(data, keys);
    console.log(braidedData);

    // x axis
    let xScale: any = d3.scaleTime()
        .domain(<any>d3.extent(data, (d) => new Date(String(d.Date))))
        .range([0, chartWidth]);
    let xLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + Number(marginTop + chartHeight) + ")")
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(<any>d3.timeFormat("%y/%m/%d")));
    xLabel.selectAll("text")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("font-family", "Arial")
        .attr("x", "-5")
        .attr("y", "1")
        .attr("transform", "rotate(-45)");

    // y axis
    let yScale: any = d3.scaleLinear()
        .domain([0, Number(d3.max(braidedData[0], (d: any) => +Number(d[2])))])
        .range([chartHeight, 0]);
    let yLabel: any = svg.append("g")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .call(d3.axisLeft(yScale));
    yLabel.selectAll("text")
        .attr("display", "none");





    const area: any = d3.area()
        .x((d: any) => xScale(new Date(d[0])))
        .y0(yScale(0))
        .y1((d: any) => yScale(Number(d[2])));

    braidedData.forEach((data, i) => {
        if (true) {

            svg.append("linearGradient")
                .attr("id", "line-gradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", xScale(d3.min(data, (d) => new Date(d[0]))))
                .attr("y1", 0)
                .attr("x2", xScale(d3.max(data, (d) => new Date(d[0]))))
                .attr("y2", 0)
                .selectAll("stop")
                .data(colorGradient(data, colorScale, xScale))
                .enter().append("stop")
                .attr("offset", (d: any) => d.offset)
                .attr("stop-color", (d: any) => d.color);


            // 描画
            let path: any = svg.append("path")
                .datum(data)
                .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
                .style("fill", "url(#line-gradient)")
                .style("stroke", "url(#line-gradient)")
                // .style("fill", (d: any) => colorScale(d[1]))
                // .style("stroke", (d: any) => colorScale(d[1]))
                .attr("stroke-width", 1.5)
                .attr("d", area)
        }
    });

}



function braided(data: DSVRowArray, keys: string[]): string[][][] {
    let keysList: string[][] = new Array(data.length);
    let keysLen: number = keys.length;

    data.forEach((d: any, idx: number) => {

        // keyを昇順にソートする
        for (let i = 0; i < keys.length - 1; i++) {
            for (let j = i + 1; j < keys.length; j++) {
                console.log(Number(d[keys[i]]), Number(d[keys[j]]), Number(d[keys[i]]) - Number(d[keys[j]]))
                console.log(keys[i], keys[j]);
                
                if (Number(d[keys[i]]) - Number(d[keys[j]]) < 0) {
                    let tmp: string = d[keys[i]];
                    d[keys[i]] = d[keys[j]];
                    d[keys[j]] = tmp;

                    let tmp1: string = keys[i];
                    keys[i] = keys[j];
                    keys[j] = tmp1;

                    console.log("convert")
                }
                
            }
        }
        keysList[idx] = new Array(keys.length);
        for (let k = 0; k < keys.length; k++) {
            keysList[idx][k] = keys[k];
        }
    });
    // console.log(keysList);


    // 初期化
    let newData: string[][][] = new Array(keysLen);
    for (let j = 0; j < keysLen; j++) {
        newData[j] = new Array(keysList.length);
        for (let i = 0; i < keysList.length; i++) {
            newData[j][i] = new Array(3);
        }
    }

    // 重ね順を考慮したデータ形式に保管
    keysList.forEach((keys: string[], i: number) => {
        keys.forEach((key: string, j: number) => {
            newData[j][i][0] = String(data[i].Date);
            newData[j][i][1] = key;
            newData[j][i][2] = String(data[i][key]);
        });
    });

    return newData;
}

function colorGradient(data: string[][], colorScale: any, xScale: any): string[][] {
    let separateKeys: string[][] = [];
    let separateDate: string[] = [];

    // console.log(data);

    for (let i = 0; i < data.length - 1; i++) {
        let key0: string = data[i][1];
        let key1: string = data[i + 1][1];
        let date0: Date = new Date(data[i][0]);
        let date1: Date = new Date(data[i + 1][0]);
        if (key0 != key1) {
            const date: string = new Date((date1.getTime() - date0.getTime()) / 2 + date0.getTime()).toLocaleString();
            // console.log(date);

            separateKeys.push([key0, key1]);
            separateDate.push(date);
        }
    }

    // console.log(separateDate);
    let cdata: any[] = new Array(separateKeys.length * 2);
    separateKeys.forEach((keys: string[], i: number) => {
        
        let ratio: string = String(xScale(new Date(separateDate[i])) / chartWidth * 100) + "%";
        cdata[2 * i] = {
            offset: ratio, color: colorScale(keys[0])
        };
        cdata[2 * i + 1] = {
            offset: ratio, color: colorScale(keys[1])
        };
    });


    // console.log(cdata);
    return cdata;
}