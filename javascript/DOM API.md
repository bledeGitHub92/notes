# 检测 api 兼容性

[兼容性检测](http://caniuse.com/#search=matchesSelector)

# DOM 1 级

## Node 类型

Javascript 中的所有节点类型都继承自 Node 类型，因此所有节点类型都共享着相同的基本属性和方法。

### nodeType

节点的类型。

由于 IE 未公开 Node 类型的构造函数，所有为确保见兼容性，使用 nodeType 属性与数字进行比较。

- Node.ELEMENT_NODE(1)；
- Node.ATTRIBUTE_NODE(2)；
- Node.TEXT_NODE(3)；
- Node.CDATA\_SECTION_NODE(4)；
- Node.ENTITY\_REFERENCE_NODE(5)；
- Node.ENTITY_NODE(6)；
- Node.PROCESSING\_INSTRUCTION_NODE(7)；
- Node.COMMENT_NODE(8)；
- Node.DOCUMENT_NODE(9)；
- Node.DOCUMENT\_TYPE_NODE(10)；
- Node.DOCUMENT\_FRAGMENT_NODE(11)；
- Node.NOTATION_NODE(12)；

### nodeName & nodeValue

节点的名字和值。

### childNodes

保存着一个 NodeList 对象。NodeList 是一个类数组对象，保存着某个节点的子节点。

NodeList 对象是基于 DOM 结构动态执行的查询结果，因此 DOM 结构的变化能自动反映在 NodeList 对象中。

### parentNode

节点的父节点。

### previousSibling & nextSibiling

节点的兄弟节点。

### firstChild & lastChild

节点的第一个子节点和最后一个子节点。

### ownerDocument

文档节点。

### hasChildNodes() => boolean

如果节点有一个以上的子节点，则返回 true。

### appendChild(node) => node

向 childNodes 列表的末尾添加一个节点。如果传入节点已经是文档的一部分了，则将该节点移动到新位置。

### insertBefore(node, refer) => node

在 refer 节点之前插入 node。

### replaceChild(node, replaced) => replaced

用 node 替换 replaced 并返回 replaced。

### removeChild(node) => node

移除 node。

### cloneNode(value?: boolean = false) => node

参数为 true 则复制节点即整个子节点树，反之仅复制节点本身。

仅复制特性、子节点。不会复制添加到 DOM 中的 Javascript属性，例如事件处理程序等。

### normalize()

处理文档树中的文本节点。由于解析器的实现或 DOM 操作等原因，可能会出现不包含文本的文本节点，或出现连续的两个文本节点。

在某个节点上调用该方法，就会在该节点的后代中查找上述两种情况。删除空文本节点，合并相邻的文本节点。

## Document 类型

Javascript 通过 Document 类型表示文档。在浏览器中，document 对象是 HTMLDocument（继承自 Document 类型）的一个实例，表示整个 HTML 页面。而且 document 是 window 对象的一个属性，因此可以作为全局对象来访问。通过这个文档对象，不仅可以取得与页面有关的信息，而且还能操作页面的外观及其底层结构。Document 节点具有以下特性：

- nodeType = 9；
- nodeName = '#document'；
- nodeValue = null；
- parentNode = null；
- ownerDocument = null；

### document.documentElement

指向 < html > 元素。

### document.body

指向 < body > 元素。

### document.title

< title > 元素内的文本。

### document.URL & document.domain & document.referrer

URL 包含页面完整的 URL，domain 包含页面的域名，referrer 包含链接到当前页面的页面的 URL。

### document.getElementById(id: string) => node

### document.getElementsByTagName(tagName: string) => HTMLCollection

HTMLCollection 是类数组对象，动态集合。可以通过元素的 name 特性取得集合中的项

    HTMLCollection['name'] === HTMLCollection.namedItem('name');

元素也支持这个方法，搜索起点是当前元素：

    var ul = document.getElementById('myList');
    var items = ul.getElementsByTagName('li');

### document.getElementsByName(name: string) =>  HTMLCollection

返回带有给定 name 特性的所有元素。只有 HTMLDocument 类型才有这个方法。

### 特殊集合

除了属性和方法，document 对象还有一些特殊的集合。这些集合都是 HTMLCollection 对象。

- document.links，所有带 href 特性的 < a > 元素；
- document.anchors，所有带 name 特性的 < a > 元素；
- document.forms，所有 < form > 元素；
- document.images，所有 < img > 元素；

### document.implementation

提供检测 DOM 级别的相关信息和功能的对象。

- document.implementtation.hasFeature(feature: string, version: string) => boolean，最好进行能力检测。

### write() & writeln() & open() & close()

在页面加载过程中可以使用 write() 和 writeln() 向页面动态地加入内容。在页面加载结束后调用，则会覆盖页面内容。

## Element 类型

Element 类型用于表现 XML 或 HTML 元素，提供了对元素标签名、子节点、特性的访问。Element 节点具有以下特征：

- nodeType = 1；
- nodeName = 元素标签名；
- nodeValue = null；
- parentNode = Document / Element；

### HTML 元素

所有 HTML 元素都是由 HTMLElement 类型表示，不是通过这个类型，而是通过它的子类型表示。HTMLElement 类型直接继承自 Element 并添加了一些属性。添加的这些属性分别对应于每个 HTML 元素中都存在的下列标准特性：

> 可读写。

- id，元素在文档中的唯一标识符；
- className，与 class 特性对应；
- title，有关元素的附加信息，通过工具条显示出来；
- lang，元素内容的语言代码，很少使用；
- dir，语言方向，值为 ltr / rtl，很少使用；

### 取得特性

只有公认的（非自定义的）特性才能以属性的形式设置 / 访问。

设置 / 访问非自定义的特性时要使用 ele.getAttribute() / ele.setAttribute() 方法。

- ele.getAttribute(attrName: string) => string，仅在访问自定义特性时使用，一般直接使用对象的属性访问公认的特性；
- ele.getAttributeNode(attrName: string) => attrNode，返回 attr 节点。不常用；
- ele.setAttribute(attrName: string, value: any) => void，仅在设置自定义特性时使用，一般直接使用对象的属性设置公认的特性；
- ele.setAttributeNode(attrNode) => ，通过传入 attr 节点设置元素的特性。不常用；
- ele.removeAttribute(attrName: string) => void，彻底删除元素的特性，这个方法不常用。

### attributes 属性

仅在需要遍历元素的特性时使用，因为不够方便，一般使用 ele.getAttribute()、ele.setAttribute()、ele.removeAttribute() 代替。

Element 类型是使用 attributes 属性的唯一一个 DOM 节点类型。attributes 属性中包含一个 namedNodeMap，是一个动态集合。

元素中的每一个特性都由一个 Attr 节点表示，每个节点都保存在 NamedNodeMap 对象中。NamedNodeMap 对象拥有以下方法：

- ele.attributes.getNamedItem(name: string) => attr，返回 nodeName 属性等于 name 的节点；
- ele.attributes.removeNamedItem(name: string) => attr，从列表中删除 nodeName 等于 name 的节点。与 ele.removeAttribute 的唯一区别是会返回被删除的特性节点；
- ele.attributes.setNamedItem(attr) => void，向列表中添加节点，以节点的 nodeName 属性为索引；很不常用，因为需要传入一个特性节点。
- ele.attributes.item(pos: number) => attr，返回位于数字 pos 位置的节点；

可以通过 ele.arributes[name] 读 / 写特性节点：

    var attr = ele.attributes[name];
    ele.attributes[name] = value;

可以通过 ele.attributes[i] 读取特性节点：

    var attr = ele.attributes[i];

特性节点都有一个 specified 属性，如果这个属性的值为 true，则说明在 HTML 中指定了相应的特性。

### 创建元素

- document.createElement(tagName: string) => node，创建一个元素，需通过 appendChild()、insertBefore()、replaceChild() 等方法添加到文档中。

    var div = document.createElement('div');
    div.id = 'foo';
    div.className = 'bar';
    document.body.appendChild(div);

## Text 类型

文本节点由 Text 类型表示，包含纯文本内容。纯文本中可以包含转义后的 HTML 字符，但不能包含 HTML 代码。Text 节点具有以下特征：

- nodeType = 3；
- nodeName = '#text'；
- nodeValue = 所包含的文本；
- parentNode = Element 的实例；

通过 nodeValue 读 / 写文本节点的值。

    var text = textNode.nodeVaue;
    textNode.nodeValue = 'Hello World!';

操作文本节点的 API：

- appendData(text: string) => ，将 text 添加到节点末尾；
- deleteData(offset: number, count: number) => ，从 offset 指定的位置开始删除 count 个字符；
- insertData(offset: number, text: string) => ，从 offset 指定的位置插入 text；
- replaceData(offset: number, count: number, text: string) => ，用 text 替换从 offset 指定的位置开始到 offset + count 为止的文本；
- splitText(offset: number) => ，从 offset 指定的位置将当前文本节点分成两个文本节点；
- substringData(offset: number, count: number) => ，提取从 offset 指定的位置开始到 offset + count 位置处的字符串；

### document.createTextNode(text: string) => textNode

创建文本节点。

### ele.normalize() => void

格式化元素节点子节点中的空文本节点和相邻文本节点。

### textNode.spiltText(pos: number) => textNode

从指定位置分隔文本节点。这是从文本节点中提取数据的一种常用 DOM 解析技术。

## DocumentFragment 类型

文档片段不会成为文档的一部分。DocumentFragment 节点具有下列特征：

- nodeType = 11；
- nodeName = '#document-fragment'；
- nodeValue = null；
- parentNode = null；

### document.createDocumentFragment() => documentFragmentNode

创建文档片段，作为一个仓库使用。用于一次性把新建的节点添加到文档中，避免浏览器反复渲染：

    var div1 = document.createElement('div1');
    var div2 = document.createElement('div2');
    var fragment = document.createDocumentFragment();
    fragment.appendChild(div1);
    fragment.appendChild(div2);
    document.body.appendChild(fragment);

## Attr 类型

特性就是存在与元素的 attributes 属性中的节点。尽管它们是节点，但特性却不被认为是 DOM 文档的一部分。特性节点有以下特征：

- nodeType = 2；
- nodeName = 特性的名字；
- nodeValue = 特性的值；
- parentNode = null；

### attr.name & attr.value & attr.specified

specified 是一个布尔值，在 HTML 代码中指定的特性的对应值为 true。

- attr.name === attr.nodeName
- attr.value === attr.nodeValue

### document.createAttribute(attrName) => attrNode

传入特性名称，创建特性节点。

## 创建表格

为了方便构建表格， HTML DOM 还为 < table >、 < tbody >、< tr > 元素添加了一些属性和方法。

### 为 < table > 添加的属性和方法

- caption：保存着对 < caption > 元素（如果有）的指针；
- tBodies：是一个 < tbody > 元素的 HTMLCollection；
- tFoot：保存着对 < tfoot > 元素（如果有）的指针；
- tHead：保存着对  < thead > 元素（如果有）的指针；
- rows：是一个表格中所有行的 HTMLCollection；
- createTHead() => theadNode：创建 < thead > 元素，将其放到表格中；
- createTFoot() => tfootNode：创建 < tfoot > 元素，将其放到表格中；
- createCaption() => captionNode：创建< caption >元素，将其放到表格中；
- deleteTHead()：删除 < thead > 元素；
- deleteTFoot()：删除 < tfoot > 元素；
- deleteCaption()：删除 < caption > 元素；
- deleteRow(pos)：删除指定位置的行；
- insertRow(pos)：向 rows 集合中的指定位置插入一行；

### 为 < tbody > 添加的属性和方法

- rows：保存着 < tbody > 元素中行的 HTMLCollection；
- deleteRow(pos)：删除指定位置的行；
- insertRow(pos)：向 rows 集合中的指定位置插入一行，返回对新插入行的引用；

### 为 < tr > 元素添加的属性和方法

- cells：保存着 < tr > 元素中单元格的 HTMLCollection；
- deleteCell(pos)：删除指定位置的单元格；
- insertCell(pos)：向 cells 集合中的指定位置插入一个单元格，返回对新插入单元格的引；

# DOM 扩展

## 选择符 API

Selectors API Level 1 的核心是两个方法： querySelector()和 querySelectorAll()。在兼容的浏览器中，可以通过 Document 及 Element 类型的实例调用它们。

目前已完全支持 Selectors API Level 1 的浏览器有 IE 8+、 Firefox 3.5+、 Safari 3.1+、 Chrome 和 Opera 10+。

### querySelector()

querySelector()方法接收一个 CSS 选择符，返回与该模式匹配的第一个元素，如果没有找到匹配的元素，返回 null。

通过 Document 类型调用 querySelector() 方法时，会在文档元素的范围内查找匹配的元素。

通过 Element 类型调用 querySelector() 方法时，只会在该元素后代元素的范围内查找匹配的元素。

    // 取得 body 元素
    var body = document.querySelector("body");

    // 取得 ID 为"myDiv"的元素
    var myDiv = document.querySelector("#myDiv");

    // 取得类为"selected"的第一个元素
    var selected = document.querySelector(".selected");

    // 取得类为"button"的第一个图像元素
    var img = document.body.querySelector("img.button");

### querySelectorAll()

querySelectorAll()方法接收的参数与 querySelector()方法一样，都是一个 CSS 选择符，但返回的是所有匹配的元素而不仅仅是一个元素。这个方法返回的是一个 NodeList 的实例。

具体来说，返回的值实际上是带有所有属性和方法的 NodeList，而其底层实现则类似于一组元素的快照，而非不断对文档进行搜索的动态查询。这样实现可以避免使用 NodeList 对象通常会引起的大多数性能问题。

通过 Document 类型调用 querySelectorAll() 方法时，会在文档元素的范围内查找匹配的元素。

通过 Element 类型调用 querySelectorAll() 方法时，只会在该元素后代元素的范围内查找匹配的元素。

    // 取得某 < div > 中的所有 < em > 元素（类似于 getElementsByTagName("em")）
    var ems = document.getElementById("myDiv").querySelectorAll("em");

    // 取得类为 "selected" 的所有元素
    var selecteds = document.querySelectorAll(".selected");

    // 取得所有 < p > 元素中的所有<strong>元素
    var strongs = document.querySelectorAll("p strong");

### matchesSelector()

Selectors API Level 2 规范为 Element 类型新增了一个方法 matchesSelector()。这个方法接收一个参数，即 CSS 选择符，如果调用元素与该选择符匹配，返回 true；否则，返回 false。

    function matchesSelector(element, selector) {
        if (element.matchesSelector) {
            return element.matchesSelector(selector);
        } else if (element.msMatchesSelector) {
            return element.msMatchesSelector(selector);
        } else if (element.mozMatchesSelector) {
            return element.mozMatchesSelector(selector);
        } else if (element.webkitMatchesSelector) {
            return element.webkitMatchesSelector(selector);
        } else {
            throw new Error("Not supported.");
        }
    }
    if (matchesSelector(document.body, "body.page1")) {
        //执行操作
    }

## 元素遍历

对于元素间的空格，IE9 及之前版本不会返回文本节点，而其他所有浏览器都会返回文本节点。这样，就导致了在使用 childNodes 和 firstChild 等属性时的行为不一致。为了弥补这一差异，而同时又保持 DOM 规范不变， Element Traversal 规范（www.w3.org/TR/ElementTraversal/）新定义了一组属性。

Element Traversal API 为 DOM 元素添加了以下 5 个属性：

- childElementCount：返回子元素（不包括文本节点和注释）的个数；
- firstElementChild：指向第一个子元素； firstChild 的元素版；
- lastElementChild：指向最后一个子元素； lastChild 的元素版；
- previousElementSibling：指向前一个同辈元素； previousSibling 的元素版；
- nextElementSibling：指向后一个同辈元素； nextSibling 的元素版；

支持 Element Traversal 规范的浏览器有 IE 9+、 Firefox 3.5+、 Safari 4+、 Chrome 和 Opera 10+。

## HTML5

对于传统 HTML 而言， HTML5 是一个叛逆。所有之前的版本对 JavaScript 接口的描述都不过三言两语，主要篇幅都用于定义标记，与 JavaScript 相关的内容一概交由 DOM 规范去定义。

而 HTML5 规范则围绕如何使用新增标记定义了大量 JavaScript API。其中一些 API 与 DOM 重叠，定义了浏览器应该支持的 DOM 扩展。

### getElementsByClassName(className: string) => NodeList

支持 getElementsByClassName()方法的浏览器有 IE 9+、 Firefox 3+、 Safari 3.1+、 Chrome 和 Opera 9.5+。

可以通过 document 对象及所有 HTML 元素调用该方法。

getElementsByClassName()方法接收一个参数，即一个包含一或多个类名的字符串，返回带有指定类的所有元素的 NodeList。

    // 取得所有类中包含"username"和"current"的元素，类名的先后顺序无所谓
    var allCurrentUsernames = document.getElementsByClassName("username current");

    // 取得 ID 为"myDiv"的元素中带有类名"selected"的所有元素
    var selected = document.getElementById("myDiv").getElementsByClassName("selected");

