## 全局变量

全局变量在所有的作用域中都可见。在为新程序中可能带来便利，但在大型应用中会难以管理。

共有三种声明全局变量的方式：

- 在任何函数之外通过 var 关键字声明：var foo = value;
- 直接给全局对象添加一个属性：window.foo = value;
- 使用未经声明的变量: foo = value;

## 作用域

es5 没有块级作用域。用 var 声明的变量会存在于最近的函数作用域中。
es6 可以用 let 声明块级作用域。

## 自动插入分号

Javascript 有一个自动修复机制，试图通过自动插入分号来修复有缺损的程序。

但是，它可能会造成更为严重的错误。

## 保留字

保留字用作对象字面量的键值时，必须用引号括起来。不能用点表示法访问。

## parseInt(value: any, radix: number) => number

parseInt 解析第一个字符为 0 的字符串时，会按 8 进制来求值。所以最好带上第二个参数，基数。

## NaN

由于 NaN 不等于自身，所以用 IsNaN(value) 检测 NaN。

检测一个值是否可做数字的最佳方法是使用 isFinite 函数，它可以筛选掉 NaN 和 Infinity，但它也会试图把非数字参数转化为数字。所以自定义一个函数：

    var isNumber = function isNumber (value) {
        return typeof value === 'number' && isFinite(value);
    }