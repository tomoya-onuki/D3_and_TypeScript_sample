import * as d3 from 'd3';
import { DSVRowArray, DSVRowString, svg } from 'd3';
import $ = require('jquery');

window.addEventListener('load', () => {
    // データの読み込み
    d3.csv("../data/newly_confirmed_cases_daily.csv")
        .then((data) => {
            new App(data).init();
        })
        .catch((error) => {
            console.log(error)
        });
}, false);



class App {
    private div: number = 1;
    private data: DSVRowArray;

    private width: number = 600;
    private height: number = 60;
    private marginTop: number = 0;
    private marginRight: number = 20;
    private marginBottom: number = 20;
    private marginLeft: number = 10;

    private keys: string[] = ["Tokyo", "Saitama", "Kanagawa", "Chiba", "Aichi", "Osaka", "Fukuoka", "Okinawa"];

    constructor(data: DSVRowArray) {
        this.data = data;
        // this.keys = Object.keys(data[0]);
    }

    public init(): void {
        const me: App = this;
        const svgList: any[] = [];

        let max: number = 0;
        me.keys.forEach(key => {
            if (key != 'ALL' && key != 'Date') {
                // 最大値を求める (これをしないと縦軸のスケールが揃わない)
                let tmp: number = Number(d3.max(this.data, (d) => +Number(d[key])));
                if (tmp > max) {
                    max = tmp;
                }

                // SVGの設定
                const svg: any = d3.select("#chart")
                    .append("svg")
                    .attr("id", key)
                    .attr("width", this.width)
                    .attr("height", this.height);
                svgList.push(svg);
            }
        });

        me.keys.forEach((key: string, i: number) => {
            if (key != 'ALL' && key != 'Date') {
                me.draw(svgList[i], key, max);
            }

        });



        $('#div_slider').on('input', function () {
            $('#div_slider_label').text('分割数: ' + $(this).val());
            me.div = Number($(this).val());
            me.keys.forEach((key: string, i: number) => {
                me.clear(svgList[i]);
                me.draw(svgList[i], key, max);
            });
        });
        $('#width_slider').on('input', function () {
            $('#width_slider_label').text('横幅: ' + $(this).val() + "px");
            me.width = Number($(this).val());
            me.keys.forEach((key: string, i: number) => {
                svgList[i].attr("width", me.width)
                svgList[i].attr("height", me.height);
                me.clear(svgList[i]);
                me.draw(svgList[i], key, max);
            });
        });
        $('#height_slider').on('input', function () {
            $('#height_slider_label').text('縦幅: ' + $(this).val() + "px");
            me.height = Number($(this).val());
            me.keys.forEach((key: string, i: number) => {
                svgList[i].attr("width", me.width)
                svgList[i].attr("height", me.height);
                me.clear(svgList[i]);
                me.draw(svgList[i], key, max);
            });
        });
    }

    private clear(svg: any) {
        svg.selectAll("g").remove();
        svg.selectAll("text").remove();
        svg.selectAll("path").remove();
    }

    private draw(svg: any, key: string, max: number): void {

        let chartWidth: number = this.width - this.marginLeft - this.marginRight;
        let chartHeight: number = this.height - this.marginTop - this.marginBottom;
        const vAxisMax: number = Math.floor(max / this.div) // 縦軸のメモリの上限

        const data = this.data;

        // console.log("draw! ", this.div);

        // keys.forEach((key: string) => {
        if (key != 'ALL' && key != 'Date') {

            let horizonData: any = this.horizon(data, this.div, vAxisMax, key);

            // x axis
            const term = <any>d3.extent(data, (d) => new Date(String(d.Date)));
            let xScale: any = d3.scaleTime()
                .domain(term)
                .range([0, chartWidth]);

            svg.append("g")
                .attr("transform", "translate(" + this.marginLeft + "," + Number(this.marginTop + chartHeight) + ")")
                .call(d3.axisBottom(xScale).ticks(chartWidth/100).tickFormat(<any>d3.timeFormat("%y/%m/%d")).tickSize(1));



            // y axis
            let yScale: any = d3.scaleLinear()
                .domain([0, max / this.div])
                .range([chartHeight, 0]);
            svg.append("g")
                .attr("transform", "translate(" + this.marginLeft + "," + this.marginTop + ")")
                .call(d3.axisLeft(yScale).ticks(0).tickSize(0));


            horizonData.forEach((data0: any, i: number) => {

                // カラーラベル
                let lightness: string = String(90 - 90 * i / this.div);
                let color: string = "hsl(225, 60%, " + lightness + "%)";
                let vMargin: number = 0;
                let hMargin: number = i;
                if (i > this.div / 2) {
                    vMargin = 10;
                    hMargin = i - Math.floor(this.div / 2);
                }

                if (key == this.keys[0]) {
                    svg.append("text")
                        .attr("text-anchor", "end")
                        .attr("y", this.marginTop + 10 + vMargin)
                        .attr("x", this.marginLeft + 100 + 75 * hMargin)
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
                    .attr("transform", "translate(" + this.marginLeft + "," + this.marginTop + ")")
                    .attr("stroke", "none")
                    .attr("fill", color)
                    .attr("stroke-width", 1.5)
                    .attr("d", area);
            });

            // ラベル
            svg.append("text")
                .attr("text-anchor", "start")
                .attr("y", this.marginTop + 10)
                .attr("x", this.marginLeft + 5)
                .attr("font-size", "10px")
                .attr("font-family", "Arial")
                .text(key);
        }
        // });
    }

    private horizon(data: DSVRowArray, div: number, vAxisMax: number, key: string): any {

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
}
