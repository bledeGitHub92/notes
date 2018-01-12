## babel 编译 es6 / es7

### babel-core

### babel-loader

### babel-preset-es2015

### babel-preset-stage-0

### babel-plugin-transform-runtime

```js
// .babelrc

{
    "presets": [
        "es2015",
        "stage-0"
    ],
    "plugins": [
        "transform-runtime"
    ]
}

// webpack.base.js

{
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
}

```

### vue-loader

### css-loader

### style-loader

### [file-loader](https://www.npmjs.com/package/file-loader)

### [url-loader](https://www.npmjs.com/package/url-loader)

### image-webpack-loader

### ts-loader

### vue-ts-loader