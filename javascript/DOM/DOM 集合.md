# DOM 1

> 动态集合: DOM 结构的变化能自动反映到此对象中。

应该尽量减少访问动态集合的次数。因为每次访问动态集合都会运行一次基于文档的查询。

所以，可以考虑将从 NodeList 中取得的值缓存起来。

## NodeLists

类数组对象，动态集合。 / 包含所有类型的节点。

```js
// 属性
nodeLists[0]
nodeLists.length
// 方法
nodelists.item(0)
```

返回 NodeLists 对象的操作：

```js
node.childNodes
form.elements[name] // 多个表单元素的 name 特性相同
[document | elem].querySelectorAll(selector) // 一个快照
[document | elem].getElementsByClassName(className)
```

## HTMLCollection

类数组对象，动态集合。 / 包含元素节点。

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

```js
[document | elem].getElementsByTagName(tagName)
document.getElementsByName(name)
document.anchors
document.links
document.forms
document.forms.elements
document.images
table.tBodies
table.rows
tbody.rows
tbody.cells
select.options
```

## NamedNodeMap

类数组对象，动态集合。 / 包含元素的 Attr 节点。

```js
namedNodeMap.getNamedItem(name) // 返回 nodeName 属性等于 name 的节点
namedNodeMap.removeNamedItem(name) // 从列表中移除 nodeName 属性等于 name 的节点
namedNodeMap.setNamedItem(attr) // 向列表中添加节点，以节点的 nodeName 为索引
namedNodeMap.item(pos) // 返回位于数字 pos 位置处的节点
```

返回 NamedNodeMap 对象的操作：

```js
elem.attributes
```

# HTML 5

## 兼容

Firefox 3.6+ 和 Chrome。

## DOMTokenList

类数组对象。

```js
// 属性
domTokenList[pos]
domTokenList.length
// 方法
domTokenList.item(pos)
domTokenList.add(value) // 将给定的字符串值添加到列表中。如果值已经存在，就不添加了
domTokenList.contains(value) // 列表中是否存在给定的值，如果存在则返回 true，否则返回 false。
domTokenList.remove(value) // 从列表中删除给定的字符串。
domTokenList.toggle(value) // 如果列表中已经存在给定的值，删除它；如果列表中没有给定的值，添加它。
```

返回 domTokenList 对象的操作：

```js
elem.classList
```