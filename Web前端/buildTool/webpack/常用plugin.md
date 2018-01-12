## 热重载

### webpack.HotModuleReplacementPlugin

添加到开发环境配置（webpack.dev.js）的 plugins 列表。

```js
// webpack.dev.js

{
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
```

### [webpack-dev-middleware](https://www.npmjs.com/package/webpack-dev-middleware)

### [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware)

```js
// webpack.dev.js
const base = require('./webpack.base.js');    // 通用配置

Object.keys(base.entry).forEach(function (name) {
    base.entry[name] = [
        'webpack-hot-middleware/client?timeout=2000&reload=true'
    ].concat(base.entry[name]);
});

// dev-server.js

const app = require('express')();
const webpack = require('webpack');
const config = require('./webpack.dev.js');    // webpack 开发环境配置
const compiler = webpack(require('./webpack.dev.js'));

app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, callback);
```

## 路由

### [connect-history-api-fallback](https://www.npmjs.com/package/connect-history-api-fallback)

```js
const express = require('express');
const app = express();

app.use(require('connect-history-api-fallback')({
    rewrites: [
        { from: '/index/', to: '/index.html' }
    ]
}));

app.listen(port, callback)
```

### webpack.DefinePlugin

### html-webpack-plugin

### extract-text-webpack-plugin

### clean-webpack-plugin

### uglifyjs-webpack-plugin

### commonChunksPlugin

### webpack-manifest-plugin

### babel-minify-webpack-plugin

### webpack-closure-compiler

### webpack-merge

### webpack-config