## Global

### isNaN

### isFinite

### parseInt

### parseFloat

### encodeURI(uri: string) => string

对 URI 进行编码，以便发送给浏览器。有效的 URI 不包含某些字符，例如空格。

不会对 URI 本身进行编码。例如，冒号、正斜杠、问号、井字号。

可以对整个 URI 使用encodeURI。

### decodeURI(uri: string) => string

对使用 encodeURI 编码的 uri 进行解码。

### encodeURIComponent(uri: string) => string

会对发现的任何非标准字符进行编码。

对附加在 URI 后面的字符串使用 encodeURIComponent。

这个使用较多，一般对查询字符串进行编码，而不是对基础 URI 编码。

### decodeURIComponent(uri: string) => string

对使用 encodeURIComponent 编码的 uri 进行解码。

## Array

### array.every( ({ item, index, array }) => { ... }， ctx ) => boolean

对数组每一项执行给定函数，如果每一项都返回 true，则返回 true。

### array.some( ({ item, index, array }) => { ... }， ctx ) => boolean

对数组每一项执行给定函数，如果任意一项都返回 true，则返回 true。

### array.filter( ({ item, index, array }) => { ... }， ctx ) => array

对数组每一项执行给定函数，返回 true 的项组成的数组。

### array.map( ({ item, index, array }) => { ... }， ctx ) => array

对数组每一项执行给定函数，返回每次函数调用结果组成的函数。

### array.forEach( ({ item, index, array }) => { ... }， ctx ) => array

对数组每一项执行给定函数，该函数没有返回值。

### array.reduce( ({ prev, cur, index, array }) => { ... }, initial ) => any

迭代数组所有项，并构建一个最终返回的值。

### array.reduceRight( ({ prev, cur, index, array }) => { ... }, initial ) => any

从最后一项开始归并数组。

### array.concat

产生一个新数组。

包含一份 array 的浅复制，并把一份或多份 item 附加在其后。

如果 item 是一个数组，那么它的每个元素都会被分别添加。

    array.concat(item: any, ...) => array

### array.join

join 把一个 array 构造成一个字符串。它先把 array 的每个元素构造成字符串，再用 separator 分隔符把它们连接在一起。

    array.join(separator?: string = ',') => string

### array.pop

修改原数组。

移除 array 末尾的元素，并返回该元素。

    array.pop() => any

### array.push

修改原数组。

把一个或多个参数 item 附加到一个数组的尾部，并返回数组的长度。

    array.push(item: any, ...) => number

### array.reverse

修改原数组。

反转数组里的元素，返回 array 本身。

    array.reverse() => array

### array.shift

修改原数组。

移除数组的第一个元素，并返回该元素。

    array.shift() => any

### array.unshift

修改原数组。

在数组头部插入指定元素，并返回数组的长度。

    array.unshift(item: any, ...) => number

### array.slice

返回新书组。

对 array 中的一段做浅复制。如果参数为负数，与 array.length 相加。

    <!-- 含头不含尾  -->
    array.slice(start: number, end?: number = array.length) => array

### array.sort

修改原数组。

默认把排序元素视为字符串。可以使用自己的比较函数。

比较函数接受两个参数，这个两个参数相等返回 0，需排序返回正数，不排序返回负数。

    array.sort(
        (a, b) => a - b
    ) => array

### array.splice

修改原数组。

从指定位置移除指定个数，然后在该位置后添加指定的元素。返回被删除的元素。

    array.splice(start: number, deleteCount: number, item: any, ...) => any 

## Function

### function.apply

把函数的 this 绑定到指定对象上，并传递指定参数。

    function.apply(thisArg: object, argArray?: array) => any

## Number

### number.toExponential

把 number 转化成一个指数形式的字符串。可选参数控制小数的精度，范围 0 ~ 20。

    number.toExponential(fractionDigits?: number) => string

### number.toFixed

把 number 转化成一个十进制形式的字符串。可选参数控制小数的精度，范围 0 ~ 20。

    number.toFixed(fractionDigits?: number) => string

### number.toPrecision

把 number 转化成一个十进制形式的字符串。可选参数控制数字的精度，范围 0 ~ 21。

    number.toPrecision(precision?: number) => string

### number.toString

把 number 转化为字符串。可选参数控制基数，范围 2 ~ 36，默认 10。

在普通的情况下，number.toString() 可以简写为 String(number)

    number.toString(radix?: number = 10) => string

## Object

### Object.defineProperty(obj: object, property: string, descriptor: object) => void

数据属性的 descriptor：value、writable、enumerable、configurable。

访问器属性的 descriptor：get、set、enumerable、configurable。

修改指定对象的指定属性的特性值。若不指定描述符对象，configurable、enumberable、writable 特性的默认值都是 false。

### Object.defineProperties(obj: object, descriptor: object) => void

在同一个对象上同时定义多个属性：

    var book = {};

    Object.defineProperties(book, {
        _year: {
            value: 1990
        },
        year: {
            get() { return this._year },
            set(value) { this._year = value }
        }
    });

### Object.getOwnPropertyDescriptor(obj: object, property: string) => object

获取指定对象的指定属性的描述符对象：

    var book = {};
    var book = Object.defineProperties(book, {
        _year: {
            value: 1990
        }
    });
    var descriptor = Object.getOwnPropertyDescriptor(book, 'year');

### Object.getPrototypeOf(obj: object) => object

ECMAScript5 新增的这个方法用于获取 [[prototype]] 的值。

### Object.keys(obj: object) => array

返回由参数对象的所有可枚举的实例属性组成的数组，与在 for-in 循环中出现的顺序相同。

### Object.getOwnPropretyNames(obj: object) => array

获取由参数对象的所有实例属性组成的数组，无论是否可以枚举。

### object.isPrototypeOf(obj: object) => boolean

如果参数对象的 [[prototype]] 指向调用 isPrototypeOf 方法的对象，那么这个方法返回 true。

### object.hasOwnProperty

判断标识符是否是 obj 的成员。原型链中的属性不会被检查。

    obj.hasOwnProperty(property: string) => boolean

## RegExp

### regexp.exec

如果成功匹配，返回一个数组。数组下标为 0 的元素是匹配的子字符串，下标为 1 的元素是第一个捕获组，以此类推。匹配失败返回 null。

如果 regexp 带有 g 标识。查找从 regexp.lastIndex 位置开始。

匹配成功，更新 regexp.lastIndex，匹配失败则重置 regexp.lastIndex 为 0。

^ 因子仅匹配 regexp.lastIndex 为 0 的情况。

    regexp.exec(string: string) => array

### regexp.test

匹配返回 true，否则返回 false。不要对这个方法使用 g 标识。

    regexp.test(string: string) => boolean

## String

### string.charAt

返回指定位置的字符。如果参数小于 0 或大于等于字符串长度，返回空字符串。

    string.charAt(pos: number) => string

### string.charCodeAt

返回指定位置的字符码位。如果参数小于 0 或大于等于字符串的长度，返回 NaN。

    string.charCodeAt(pos: number) => number

### string.fromCharCode(char: number, ...) => string

根据一串数字编码返回一个字符串。

### string.concat

连接字符串，很少使用。基本用 +。

    string.concat(string: string, ...) => string

### string.indexOf

在指定字符串里查找另一个字符串，返回匹配字符串的起始位置，否则返回 -1。可从指定位置开始查找。

    string.indexOf(string: string, pos: number) => number

### string.lastIndexOf

与 string.indexOf 查找方向相反。

### string.localCompare

比较两个字符串。如果比参数小，返回负数。与参数相等返回 0，比参数大，返回正数。

    string.localCompare(string: string) => number

### string.match

用正则对字符串进行匹配。

没有 g 标识与 regexp.exec 的结果一致。

如果有 g 标识，返回一个包含所有匹配结果的数组。

    string.match(parameter: string | regexp) => array

### string.replace

对 string 进行查找和替换。

searchValue 参数是 string，只替换第一次匹配的字符串。

searchValue 参数是带有 g 标识的 regexp，替换所有匹配的字符串。

replaceValue 是字符串，字符 $ 有特殊含义。

| 美元符号序列  | 替换对象    |
|---------|---------|
| $$      | $       |
| $&      | 整个匹配文本  |
| $number | 分组捕获的文本 |
| $`      | 匹配之前的文本 |
| $'      | 匹配之后的文本 |

replaceValue 是函数，每遇到一次匹配就执行一次函数。该函数返回的字符串作为替换文本。

函数的第 1 个参数是整个被匹配的文本，第 2 个参数是第 1 个捕获组，以此类推。

    string.replace(searchValue: regexp | string, replaceValue: func | string) => string

### string.search

接受 string 或 不带 g 标识的 regexp 作为参数。匹配返回首字符位置，不匹配返回 -1。

    string.search(searchValue: string | regexp) => number

### string.slice

从 start 开始截取字符串。如果 start 或 end 为负数，则会 string.length 相加。

    string.slice(start: number, end?: number = string.length) => string

### string.split

提取 separator 把字符串转化为数组。

separator 可为 regexp 或 string，可选参数 limit 可限制数组的长度。

当 separator 是 regexp 时，捕获组会出现在返回的数组中。忽略 g 标识。

    string.split(separator: string | regexp, limit?: number) => array

### string.substring(start: number, end?: number = string.length) => string

和 slice 一样，但是不能处理负数，没有任何理由使用 substring，用 slice 代替。

### string.toLocaleLowerCase()

使用本地方规则把 string 转化为小写，主要用在土耳其语。

### string.toLocaleUpperCase()

使用本地化规则把 string 抓花为大写，主要用于土耳其语。

### string.toLowerCase()

小写化 string。

### string.toUpperCase()

大写化 string。

## Math

### Math.min(value: number, ...) => number

用于确定一个数组中的最小值，接收任意多个参数。

### Math.max(value: number, ...) => number

用于确定一个数组中的最大值，接收任意多个参数。

### Math.ceil(value: number) => number

向上舍入。

### Math.floor(value: number) => number

向下舍入。

### Math.round(value: number) => number

四舍五入。

### Math.random() => number

返回介于 0 ~ 1 的一个随机数。

介于 n 到 m 之间的随机数：

    function selectFrom(min, max) {
        var choices = max - min + 1;
        return Math.floor(Math.random() * choices + min);
    }