# 与类相关的扩充

## elem.classList

更方便地操作元素的 class 特性，返回 domTokenList 集合。

### 兼容

Firefox 3.6+ 和 Chrome。

# 焦点管理

默认情况下，文档刚刚加载完成时， document.activeElement 中保存的是 document.body 元素的引用。文档加载期间， document.activeElement 的值为 null。

## 兼容性

IE 4+、 Firefox 3+、 Safari 4+、 Chrome 和 Opera 8+。

元素获得焦点的方式有页面加载、用户输入（通常是通过按 Tab 键）和在代码中调用 focus()方法。

## document.activeElement

引用 DOM 中当前获得了焦点的元素。

## document.hasFocus()

用于确定文档是否获得了焦点。

# HTMLDocument 的变化

## document.compatMode

表示浏览器采用`[兼容 | 混杂]`模式渲染。

### 兼容性

IE6+、Firefox、 Safari 3.1+、 Opera 和 Chrome

## document.head

head 元素的引用。

```js
var head = document.head || document.getElementsByTagName("head")[0];
```

### 兼容性

Chrome 和 Safari 5。

# 字符集属性

## document.charset

文档中实际使用的字符集，也可以用来指定新字符集。

```js
alert(document.charset); //"UTF-16"
document.charset = "UTF-8";
```

### 兼容性

IE、 Firefox、 Safari、 Opera 和 Chrome。

## document.defaultCharset

根据默认浏览器及操作系统的设置，当前文档默认的字符集应该是什么。

```js
if (document.charset != document.defaultCharset){
    alert("Custom character set being used.");
}
```

### 兼容性

IE、 Safari 和 Chrome。

# 自定义数据属性

HTML5 规定可以为元素添加非标准的属性，但要添加前缀 data-，目的是为元素提供与渲染无关的信息，或者提供语义信息。这些属性可以任意添加、随便命名，只要以 data-开头即可。

```js
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

## elem.dataset

是一个 DOMStringMap 的实例，特性 data-name="value" 会自动映射为 elem.dataset 对象上的 key-value。

```js
<div data-appId="foo" data-myName="bar"></div>

//取得自定义属性的值
var appId = div.dataset.appId; // foo
var myName = div.dataset.myname; // bar
//设置值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";
```

### 兼容性

Firefox 6+ 和 Chrome。

# 插入标记

方便于向文档插入大量新 HTML 标记。

## elem.innerHTML

根据指定值创建新的 DOM 树，然后替换调用元素的子节点。

### 兼容性

IE8+

## elem.outerHTML

根据指定值创建新的 DOM 树，然后替换调用元素及其子元素。

### 兼容性

IE4+、 Safari 4+、 Chrome 和 Opera 8+。 Firefox 7 及之前版本都不支持 outerHTML 属性。

## elem.insertAdjacentHTML(pos, text)

```js
//作为前一个同辈元素插入
element.insertAdjacentHTML("beforebegin", "<p>Hello world!</p>");
//作为后一个同辈元素插入
element.insertAdjacentHTML("afterend", "<p>Hello world!</p>");
//作为第一个子元素插入
element.insertAdjacentHTML("afterbegin", "<p>Hello world!</p>");
//作为最后一个子元素插入
element.insertAdjacentHTML("beforeend", "<p>Hello world!</p>");
```

### 兼容性

IE、 Firefox 8+、 Safari、 Opera 和 Chrome。

## 性能问题

使用上述方法删除带有事件处理程序（或引用了 js 对象）的 DOM 元素时，对应事件处理程序（或引用的 js 对象）并不会删除。

所以用上述方法删除 DOM 元素时，要删除被替换元素的事件处理程序（或引用的 js 对象）。

# elem.scrollIntoView()

将滚动条移动到调用元素的位置上。

## 兼容性

IE、 Firefox、 Safari 和 Opera。

