©︎ 2022 OnukiTomoya  

作成：2022/1/15  
更新：2022/1/15  


# D3.js + TypeScriptによる可視化サンプル

## サンプル集
#### a. 時刻データ
1. [Line Chart](https://github.com/tomoya-onuki/D3_and_TypeScript_sample/tree/1a_LineChart)
2. Line Chart (Juxtaposition)
3. Line Chart (Super Position)
4. Area Chart
5. Staked Area Chart
6. Blaided Graph
7. Horizon Graph
8. Two-Tone Pseudo Coloring
9. Stream Graph
10. Theme River

### b. 多変量量的データ 
1. Scatter Plot
2. Panel Matrix
3. Scatter Plot Matrix
4. Bubble Chart
5. Radar Chart
6. Parallel Coordinates
7. Parallel Sets
8. Mosaic Plot

### c. 多変量質的データ
1. Bar Chart
2. Pie Chart
3. Staked Bar Chart
4. Heat Map (Tile Map)
5. Tile Map (Small Multiples)

### d. 階層データ
1. Tree Map
2. Dendrogram
3. Icicle diagram
4. Sunburst diagram

### e. 地理データ


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

7. 実行
```
live server でGoLiveする
```