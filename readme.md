©︎ 2022 OnukiTomoya  

作成：2022/1/15  
更新：2022/1/16  


# D3.js + TypeScriptによる可視化サンプル

## サンプル集

### 時刻データ
- [Line Chart](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/tree/1a_LineChart)
- [Line Chart (Small Multiples)](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/tree/1b_LineChart)
- [Line Chart (Superposition)](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/tree/1c_LineChart)
- [Area Chart](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/tree/1d_AreaChart)
- [Staked Area Chart](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/tree/1e_StakedAreaChart)
- [Stream Graph](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/blob/1f_StreamGraph/readme.md)
- [Theme River](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/tree/1g_ThemeRiver)
- Blaided Graph
- [Horizon Graph](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/tree/1i_HorizonGraph)
- Two-Tone Pseudo Coloring


### 多変量量的データ 
- Scatter Plot
- Panel Matrix
- Scatter Plot Matrix
- Bubble Chart
- Radar Chart
- Parallel Coordinates
-  Parallel Sets
- Mosaic Plot

### 多変量質的データ
- Bar Chart
- Pie Chart
- Staked Bar Chart
- Heat Map (Tile Map)
- Tile Map (Small Multiples)

### 階層データ
- Tree Map
- Dendrogram
- Icicle diagram
- Sunburst diagram

### 地理データ


## Setup
1. package.jsonの作成
```
npm init -y
```
scriptの部分に以下を追加  
```
"build": "webpack",
"watch": "webpack -w"
```

2. モジュールのインストール
```
npm i -D webpack webpack-cli typescript ts-loader
npm install @types/d3 d3
```

1. tsconfig.jsonを作る
```
npx tsc --init
```
必要な行もコメントアウトされている可能性があるので注意
必要な行↓
```
{
  "compilerOptions": {
    "target": "ES2016",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true
  }
}
```

5. webpack.config.jsをつくる
```
module.exports = {
    module.exports = {
    mode: "development",
  
    entry: "./src/main.ts",
  
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader"
        }
      ]
    },

    resolve: {
      extensions: [".ts"]
    }
  };
```

6. コンパイル
```
npm run build
```
or
```
mac: Shift + Command + B
win: Shift + Control + B
```

7. 実行
live serverでGoLiveし、index.htmlを開く  
以下のような折れ線グラフが表示されれば成功

<img src="./img/sample.png" width="50%">
