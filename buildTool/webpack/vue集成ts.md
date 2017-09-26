## 初始化项目

安装TypeScript相关依赖和项目其余依赖，用npm或cnpm

    npm install typescript ts-loader --save-dev

## 配置

修改目录下bulid/webpack.base.conf.js文件，在文件内 module > rules 添加以下规则

```js
{
    test: /\.tsx?$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
    options: {
        appendTsSuffixTo: [/\.vue$/],
    }
},
```

在src目录下新建一个文件vue-shims.d.ts，用于识别单文件vue内的ts代码

```js
declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}
```

在项目根目录下建立TypeScript配置文件tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "es2015",
    "moduleResolution": "node",
    "target": "es5",
    "allowSyntheticDefaultImports": true,
    "lib": [
      "es2017",
      "dom"
    ]
  }
}
```

重命名 src 下的 main.js 为 main.ts

修改 webpack.base.js 下的 entry > app 为 './src/app.ts'

修改src下的App.vue文件，在

```js
<script lang="ts">
```

## 进阶

配置官方推荐的 [vue-class-component](https://cn.vuejs.org/v2/guide/typescript.html)

安装开发依赖

    npm install --save-dev vue-class-component

修改ts配置文件，增加以下两项配置

```json
"allowSyntheticDefaultImports": true,
"experimentalDecorators": true,
```

改写我们的Hello组件

```ts
<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    @Component
    export default class Hello extends Vue {
      msg: string = 'this is a typescript project now'    
    }
</script>
```

使用vue-class-component后，初始数据可以直接声明为实例的属性，而不需放入data() {return{}}中，组件方法也可以直接声明为实例的方法，如官方实例，更多使用方法可以参考其[官方文档](https://github.com/vuejs/vue-class-component#vue-class-component)

```ts
import Vue from 'vue'
import Component from 'vue-class-component'
// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
    // 所有的组件选项都可以放在这里
    template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
    // 初始数据可以直接声明为实例的属性
    message: string = 'Hello!'
    // 组件方法也可以直接声明为实例的方法
    onClick (): void {
      window.alert(this.message)
    }
}
```