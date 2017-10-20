# Node 类型

DOM1 级定义了一个 Node 接口，js 中所有的节点类型都继承自 Node 类型，因此`所有的节点都共享着相同的基本属性和方法`。

## nodeType

用 12 个数值常量表示节点的类型：

1. Node.ELEMENT_NODE(1)；
2. Node.ATTRIBUTE_NODE(2)；
3. Node.TEXT_NODE(3)；
4. Node.CDATA_SECTION_NODE(4)；
5. Node.ENTITY_REFERENCE_NODE(5)；
6. Node.ENTITY_NODE(6)；
7. Node.PROCESSING_INSTRUCTION_NODE(7)；
8. Node.COMMENT_NODE(8)；
9. Node.DOCUMENT_NODE(9)；
10. Node.DOCUMENT_TYPE_NODE(10)；
11. Node.DOCUMENT_FRAGMENT_NODE(11)；
12. Node.NOTATION_NODE(12)；

> IE没有公开 Node 类型的构造函数，为了兼容，应将 nodeType 与数值进行比较。

## nodeName & nodeValue

值取决于节点类型。

## childNodes

节点的所有子节点。

## NodeLists

类数组对象，DOM 结构的变化能自动反映到此对象中。包含所有类型的节点。

```js
// 属性
nodeLists[0]
nodeLists.length
// 方法
nodelists.item(0)
```

返回 NodeLists 对象的操作：

1. node.childNodes

## HTMLCollection

类数组对象，动态集合。仅包含元素节点。

```js
// 属性
col[0]
col[name]
col.length
// 方法
col.item(0)
col.nameItem(name)
```

返回 HTMLCollection 对象的操作：

1. document.getElementsByTagName(tagName)

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

## Document 类型

js 通过 document 表示整个页面。

- nodeType: 9
- nodeValue: '#document'
- nodeValue: null
- parentNode: null
- ownerDocument: null

## documentElement / body / title

指向 html / body / title 元素。

## URL / domain / referrer

```js
document.URL // 页面的 url
document.domain // 页面的域名
document.referrer // 链接到当前页面的页面的 url
```

> document 是 HTMLDocument（继承自 Document 类型）的一个实例。