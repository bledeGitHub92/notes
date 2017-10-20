# Node 类型

DOM1 级定义了一个 Node 接口，js 中所有的节点类型都继承自 Node 类型，因此`所有的节点都共享着相同的基本属性和方法`。

## nodeType

用 12 个数值常量表示节点的类型：

```js
Node.ELEMENT_NODE // 1
Node.ATTRIBUTE_NODE // 2
Node.TEXT_NODE // 3
Node.DOCUMENT_NODE // 9
Node.DOCUMENT_FRAGMENT_NODE // 11
Node.CDATA_SECTION_NODE // 4
Node.ENTITY_REFERENCE_NODE // 5
Node.ENTITY_NODE // 6
Node.PROCESSING_INSTRUCTION_NODE // 7
Node.COMMENT_NODE // 8
Node.DOCUMENT_TYPE_NODE // 10
Node.NOTATION_NODE // 12
```

> IE没有公开 Node 类型的构造函数，为了兼容，应将 nodeType 与数值进行比较。

## nodeName & nodeValue

值取决于节点类型。

## childNodes

节点的所有子节点。

## parentNode

节点的父节点。

## previousSibling / nextSibling

节点的前一个 / 后一个同胞节点。

## firstChild / lastChild

节点的第一个 / 最后一个子节点。

## ownerDocument

返回文档的根节点 document。

## hasChildNodes()

有子节点的节点返回 true。

## appendChild(node)

向 childNodes 列表的末尾添加一个节点，返回添加的节点。

如果传入已存在与文档中的节点，则把该节点移向新的位置。

## insertBefore(node, reference)

向 reference 之前插入一个节点，返回 node。

## replaceChild(node, replacement)

用 node 替换 replacement，返回 replacement。

## removeChild(node)

移除 node，返回 node。

## cloneNode(boolean?)

参数为 true 复制节点及其子节点，参数为 false 则仅复制节点。

> 此方法不会复制添加到 DOM 节点中的 js 属性，如：事件处理程序。仅复制特性、子节点。但 IE 会复制事件处理程序，所以复制节点之前，先移除事件处理程序。

## normalize()

删除不包含文本的文本节点，合并两个相邻的文本节点。

# Document 类型

js 通过 document 表示整个页面。

- nodeType: 9
- nodeName: '#document'
- nodeValue: null
- parentNode: null
- ownerDocument: null

> document 是 HTMLDocument（继承自 Document 类型）的一个实例。

## documentElement / body / title

指向 html / body / title 元素。

## URL / domain / referrer

```js
document.URL // 页面的 url
document.domain // 页面的域名
document.referrer // 链接到当前页面的页面的 url
```

## document.implementation.hasFeature()

DOM 一致性检测。

## document.write() / writeln() / open() / close()

在页面加载期间，向页面动态地加入内容。

在页面加载结束，会重写整个页面。

# Element 类型

HTML 元素通过 Element 类型表示。提供了对标签名，子节点，及特性的访问。

- nodeType: 1
- nodeName / tagName: 标签名
- nodeValue: null
- parentNode: [Document | Element] 类型
- id / className / title

> 所有 HTML 元素都是由 HTMLElement（继承自 Element 类型）或 HTMLElement 的子类型表示。

## 访问特性

元素上的标准特性会`以属性的形式添加到 DOM 对象中`供开发时访问和修改。

仅在获取自定义特性时使用 getAttribute(attr)。

```js
<div id="foo" custom="bar"></div>

div.id // foo
div.custom // undefined
div.getAttribute('custom') // bar
```

## 设置特性

`通过给 DOM 对象设置标准特性`会反映到页面中的 HTML 元素上。

仅在设置自定义特性时使用 setAttribute(attr, value)。

```js
<div></div>

div.id = 'foo' // <div id="foo"></div>
div.custom = 'custom' // <div id="foo"></div>
div.setAttribute('custom', 'bar') // <div id="foo" custom="bar"></div>
```

## 清除特性

removeAttribute(attr) 可以彻底删除元素上的特性值。

## attributes

包含元素所有特性节点的集合。仅在遍历元素的特性节点时使用。

# Attr 类型

元素特性节点由 Attr 类型表示。

- nodeType: 2
- nodeName: 特性的名称
- nodeValue: 特性的值
- parentNode: null

> 不建议直接访问 Attr 节点。

## 属性

```js
attr.name
attr.value
attr.specified
```

# Text 类型

文本节点由 Text 类型表示。包含纯文本内容，可以包含转义后的HTML 字符，但不能包含 HTML 代码。 

- nodeType: 3
- nodeName: '#text'
- nodeValue: 节点包含的文本
- parentNode: Element 类型

## 获取文本节点

```js

```

## 操作文本节点

```js
text.length
text.[nodeValue | data]
text.appendData(text)
text.deleteData(offset, count)
text.insertData(offset, text)
text.replaceData(offset, count, text)
text.splitText(offset)
text.subStringData(offset, count)
```

# DocumentFragment 类型

在文档中没有对应标记。可以包含和控制节点，不会占用额外的资源。

- nodeType: 11
- nodeName: '#document-fragment'
- nodeValue: null
- parentNode: null

## 用途

在向文档添加多个平行节点时，避免浏览器反复渲染。