## window 对象

BOM 的核心对象是 window，它表示浏览器的一个实例。window 既是通过 Javascript 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 Global 对象。这意味着在网页中定义的任何一个对象、变量和函数，都以 window 作为其 Global 对象，因此有权访问 parseInt 等方法。

### 全局作用域

由于 window 对象同时扮演着 ECMAScript 中 Global 对象的角色，所以在全局作用域中声明的变量、函数都会变成 window 对象的属性和方法。

    var age = 29;
    function sayAge () {
        alert(this.age);
    }

    alert(window.age);  // 29
    sayAge();   // 29
    window.sayAge();    // 29

使用 var 语句添加的 window 属性有一个名为 [[configurable]] 的特性被设置为 false，因此不能通过 delete 操作符删除。而直接在 window 上定义的属性可以：

    var age = 29;
    window.color = 'red';

    delete window.age;
    delete window.color;

    alert(window.age);  // 29
    alert(window.color);    // undefined


尝试访问未声明的变量会抛出错误，通过查询 window 对象，可以知道某个未声明的变量是否存在：

    var newValue = oldValue;    // 抛出错误，因为 oldValue 未声明

    var newValue = window.oldValue;     // 不会抛出错误，因为这是一次属性查询。newValue 的值是 undefined

很多全局的 Javascript 对象实际上都是 window 对象的属性。

### 窗口关系及框架

如果页面中包含框架，则每个框架中都包含自己的 window 对象，并保存在 frames 集合中。

top 始终指向最外层框架：

    top.frames[0]
    top.frames['topFrame']

与 top 相对的另一个对象是 parent，始终指向当前框架的父框架。与框架有关的最后一个属性是 self，它始终指向 window。

除非最外层的框架是通过 window.open 打开的，否则其 window 对象的 name 属性不会包含任何值。

### 窗口位置

用来确定和修改 window 对象位置的属性和方法有很多。

跨浏览器窗口获取相对于屏幕左边和上边的位置：

    var leftPos = (typeof window.screenLeft === 'number') ?
                    window.screenLeft : window.screenX;
    var topPos = (typeof window.screenTop === 'number') ?
                    window.screenTop : window.screenY;

移动浏览器窗口的方法，这两个方法一般被禁用：

    window.moveTo(0, 0);
    window.moveBy(0, 100);

### 窗口大小

无法确定浏览器窗口本身大小，却可以取到页面视口大小：

> 移动浏览器算法不同

    var pageWidth = window.innerWidth,
        pageHeight = window.innerHeight;

    if (typeof pageWidth !== 'number') {
        if (document.compatMode === 'CSS1Compat') {
            pageWidth = document.documentElement.clientWidth;
            pageHeight = document.documentElement.clientHeight;
        } else {
            pageWidth = document.body.clientWidth;
            pageHeight = document.body.clientHeight;
        }
    }

调整窗口大小的方法，一般被禁用：

    window.resizeTo(100, 100);
    window.resizeBy(100, 50);

### 导航和打开窗口

使用 window.open 方法既可以导航到一个特定的 URL，也可以打开一个新的浏览器窗口。这个方法接收四个参数：要加载的 URL、窗口目标、一个特性字符串、一个表示新页面是否取代浏览器历史记录中当前加载页面的布尔值。

如果第二个参数是一个框架的名字，则会在该框架中打开指定的页面。最后一个参数只在当前页面打开新窗口时启用。

### 间歇调用和超时调用

Javascript 是一个单线程序的解析器，因此在同一时间只能执行一段代码。为了控制要执行的代码，就有一个 Javascript 任务队列。setTimeout 第二个参数告诉 Javascript 再过多长时间把当前任务添加到队列中，如果队列是空的，则立即执行，否则要等前面的代码执行完之后再执行。

#### setTimeout(func => function, ms => number) => number

#### clearTimeout(id: number) => void

#### setInterval(func => function, ms => number) => number

#### clearInterval(id: number) => void

一般认为使用超时调用模拟间歇调用是一种最佳实践。

### 系统对话框

浏览器通过 alert、confirm、prompt 方法可以调用系统对话框向用户显示消息。通过这几个方法打开的对话框会停止执行代码，关掉后代码恢复执行。

print、find 异步，不会阻止代码执行。

## location 对象

location 对象提供与当前窗口中加载的文档有关的信息，还提供了一些导航功能。location 对象既是 window 对象的属性，也是 document 对象的属性。

| 属性名      | 例子                  | 说明                                                  |
|----------|---------------------|-----------------------------------------------------|
| hash     | #contents           | 返回 URL 中的 hash （#号后跟零或多个字符），如果 URL 中不包含散列值，就返回空字符串。 |
| host     | www.wrox.com:80     | 返回服务器名称和端口号                                         |
| hostname | www.wrox.com        | 返回不带端口号的服务器名称                                       |
| href     | http://www.wrox.com | 返回当前加载页面的完整 URL。location 对象的 toString 方法也返回这个值。     |
| pathname | /wileyCDA/          | 返回 URL 中的目录（或）文件名                                   |
| port     | 8080                | 返回 URL 中的端口号。如果 URL 中不包含端口号，则返回空字符串。                |
| protocol | http:               | 返回页面使用的协议。通常是 http: 或 https:。                       |
| search   | ?q=javascript       | 返回 URL 的查询字符串。这个字符串以问好开头                            |


### 查询字符串参数

解析查询字符串，返回包含所有参数的一个对象：

    function getQueryStringArgs() {
        //取得查询字符串并去掉开头的问号
        var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
            //保存数据的对象
            args = {},
            //取得每一项
            items = qs.length ? qs.split("&") : [],
            item = null,
            name = null,
            value = null,
            //在 for 循环中使用
            i = 0,
            len = items.length;
        //逐个将每一项添加到 args 对象中
        for (i = 0; i < len; i++) {
            item = items[i].split("=");
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    }

### 位置操作

使用 location 对象可以通过很多方式来改变浏览器的位置：

    // 传递一个 URL
    location.assign(url: string);

    // 将 location.href 或 window.location 设置为一个 URL，会用该值调用 assgin 方法
    location.href = url;
    window.location = url;

修改 location 的其他属性也可以改变当前加载的页面，每次修改 location 的属性（hash 除外）都会以新的 URL 重新加载页面：

    location.hash = '#hash';
    location.search = '?q=search';
    location.hostname = 'www.yahoo.com';
    location.pathname = 'mydir';
    location.port = 8080;

通过上述任意一种方式修改 URL 之后，浏览器的历史记录中就会生成一条新纪录。使用 location.replace 方法可以导航，但不会生成新的历史记录：

    location.replace(url: string) => void

最后一个与位置有关的方法是 location.reload，重新加载当前页面：

    location.reload();  // 可能充缓存中加载
    location.reload(true);  // 从服务器重新加载

## navigator 对象

### 检测插件

navigator.plugins 以数组形式中保存着浏览器安装的插件：

    //检测插件（在 IE 中无效）
    function hasPlugin(name) {
        name = name.toLowerCase();
        for (var i = 0; i < navigator.plugins.length; i++) {
            if (navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
                return true;
            }
        }
        return false;
    }
    //检测 Flash
    alert(hasPlugin("Flash"));
    //检测 QuickTime
    alert(hasPlugin("QuickTime"));

### 注册处理程序

## screen 对象

## history 对象

无法获知用户浏览过的网页，但可以实现后退和前进。

    history.go(-1);     // 后退一页
    history.go(1);      // 前进一页
    history.go(2);      // 前进两页

## 小结