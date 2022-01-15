©︎ 2022 OnukiTomoya  

作成：2022/1/15  
更新：2022/1/15  


# D3.js + TypeScriptによる可視化サンプル

## サンプル集
1. Line Chart
2. Small Multiples (Line Chart)
3. Small Multiples (Tile Map)
4. Blaided Graph
5. Horizon Graph
6. SuperpositionとのExplictEncodingの併用

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