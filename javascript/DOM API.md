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

### classList

支持 classList 属性的浏览器有 Firefox 3.6+和 Chrome。

这个属性是新集合类型 DOMTokenList 的实例。用于简化操作类名的方法。是类数组对象，额外定义的方法：

- add(value: string) => ，将给定的字符串添加到列表中。如果存在，就不添加；
- contains(value: string) => ，列表中是否有给定的值。有返回 true，否则返回 false；
- remove(value: string) => ，从列表中移除给定的字符串；
- toggle(value: string) => ，如果列表中存在给定值就删除，否则就添加；

    //删除"disabled"类
    div.classList.remove("disabled");

    //添加"current"类
    div.classList.add("current");

    //切换"user"类
    div.classList.toggle("user");

    //确定元素中是否包含既定的类名
    if (div.classList.contains("bd") && !div.classList.contains("disabled")) {
        //执行操作
    }

    //迭代类名
    for (var i = 0, len = div.classList.length; i < len; i++) {
        doSomething(div.classList[i]);
    }

### document.activeElement

实现了这个属性的浏览器的包括 IE 4+、 Firefox 3+、 Safari 4+、 Chrome 和 Opera 8+。

始终引用 DOM 中当前获得了焦点的元素。默认情况下，文档刚刚加载完成时， document.activeElement 中保存的是 document.body 元素的引用。文档加载期间， document.activeElement 的值为 null。元素获得焦点的方式有页面加载、用户输入（通常是通过按 Tab 键）和在代码中调用 focus()方法：

    var button = document.getElementById("myButton");
    button.focus();
    alert(document.activeElement === button); //true

### document.hasFocus()

实现了这个属性的浏览器的包括 IE 4+、 Firefox 3+、 Safari 4+、 Chrome 和 Opera 8+。

确定文档是否获得了焦点：

    var button = document.getElementById("myButton");
    button.focus();
    alert(document.hasFocus()); //true

### document.readyState

支持 readyState 属性的浏览器有 IE4+、 Firefox 3.6+、 Safari、 Chrome 和 Opera 9+。

使用 document.readyState 的最恰当方式，就是通过它来实现一个指示文档已经加载完成的指示器。Document 的 readyState 属性有两个可能的值：

- uninitialized，还未开始载入；
- loading，正在加载文档；
- interactive，已加载，文档与用户可以开始交互；
- complete，已经加载完文档；

### document.onreadystatechange()

当 document.readyState 属性发生变化时，调用回调函数。

### document.compatMode

在标准模式下， document.compatMode 的值等于"CSS1Compat"，而在混杂模式下， document.compatMode 的值等于"BackCompat"。

### document.head

引用文档 < head > 元素：

    var head = document.head || document.getElementsByTagName("head")[0];

### document.charset

支持 document.charset 属性的浏览器有 IE、 Firefox、 Safari、 Opera 和 Chrome。

档中实际使用的字符集，也可以用来指定新字符集。

    alert(document.charset); //"UTF-16"
    document.charset = "UTF-8";

### document.defaultCharset

支持document.defaultCharset 属性的浏览器有 IE、 Safari 和 Chrome。

根据默认浏览器及操作系统的设置，当前文档默认的字符集应该是什么。

### 自定义属性

HTML5 规定可以为元素添加非标准的属性，但要添加前缀 data-，目的是为元素提供与渲染无关的信息，或者提供语义信息。这些属性可以任意添加、随便命名，只要以 data-开头即可：

    < div id="myDiv" data-appId="12345" data-myname="Nicholas" >< /div >

### dataset

添加了自定义属性之后，可以通过元素的 dataset 属性来访问自定义属性的值。 dataset 属性的值是 DOMStringMap 的一个实例，也就是一个名值对儿的映射。在这个映射中，每个 data-name 形式的属性都会有一个对应的属性，只不过属性名没有 data-前缀：

    //本例中使用的方法仅用于演示
    var div = document.getElementById("myDiv");

    //取得自定义属性的值
    var appId = div.dataset.appId;
    var myName = div.dataset.myname;

    //设置值
    div.dataset.appId = 23456;
    div.dataset.myname = "Michael";

    //有没有"myname"值呢？
    if (div.dataset.myname) {
        alert("Hello, " + div.dataset.myname);
    }

### innerHTML

在读模式下， innerHTML 属性返回与调用元素的所有子节点（包括元素、注释和文本节点）对应的 HTML 标记。在写模式下， innerHTML 会根据指定的值创建新的 DOM 树，然后用这个 DOM 树完全替换调用元素原先的所有子节点。

### outerHTML

在读模式下， outerHTML 返回调用它的元素及所有子节点的 HTML 标签。在写模式下， outerHTML 会根据指定的 HTML 字符串创建新的 DOM 子树，然后用这个 DOM 子树完全替换调用元素。

### insertAdjacentHTML(pos: enum, htmlText: string) =>

支持 insertAdjacentHTML()方法的浏览器有 IE、 Firefox 8+、 Safari、 Opera 和 Chrome。

它接收两个参数：插入位置和要插入的 HTML 文本。第一个参数必须是下列值之一：

- "beforebegin"，在当前元素之前插入一个紧邻的同辈元素；
- "afterbegin"，在当前元素之下插入一个新的子元素或在第一个子元素之前再插入新的子元素；
- "beforeend"，在当前元素之下插入一个新的子元素或在最后一个子元素之后再插入新的子元素；
- "afterend"，在当前元素之后插入一个紧邻的同辈元素；

    //作为前一个同辈元素插入
    element.insertAdjacentHTML("beforebegin", "< p >Hello world!</ p >");

    //作为第一个子元素插入
    element.insertAdjacentHTML("afterbegin", "< p >Hello world!</ p >");

    //作为最后一个子元素插入
    element.insertAdjacentHTML("beforeend", "< p >Hello world!</ p >");

    //作为后一个同辈元素插入
    element.insertAdjacentHTML("afterend", "< p >Hello world!</ p >");

### scrollIntoView(value: boolean) =>

scrollIntoView()可以在所有 HTML 元素上调用，通过滚动浏览器窗口或某个容器元素，调用元素就可以出现在视口中。

## 专有扩展

### chidren

支持 children 属性的浏览器有 IE5、 Firefox 3.5、 Safari 2（但有 bug）、 Safari 3（完全支持）、 Opera8 和 Chrome（所有版本）。

是 HTMLCollection 的实例，只包含元素中同样还是元素的子节点。

### contains()

支持 contains()方法的浏览器有 IE、 Firefox 9+、 Safari、 Opera 和 Chrome。

在实际开发中，经常需要知道某个节点是不是另一个节点的后代。 调用 contains()方法的应该是祖先节点，也就是搜索开始的节点，这个方法接收一个参数，即要检测的后代节点。如果被检测的节点是后代节点，
该方法返回 true；否则，返回 false：

    alert(document.documentElement.contains(document.body)); //true

### compareDocumentPosition()

支持这个方法的浏览器有 IE9+、 Firefox、 Safari、 Opera 9.5+和 Chrome。

确定节点间的关系。返回表示该关系的位掩码：

| 掩码  | 节点关系                    |
|-----|-------------------------|
| 1   | 无关（给定的节点不在当前文档中）        |
| 2   | 居前（给定的节点在DOM树中位于参考节点之前） |
| 4   | 居后（给定的节点在DOM树中位于参考节点之后） |
| 8   | 包含（给定的节点是参考节点的祖先）       |
| 16  | 被包含（给定的节点是参考节点的后代）      |

### textContent & innerText

返回所有子元素的文本节点。写入时，用给定文本节点替换所有子元素。

## DOM 2 & DOM 3

### document.defaultView

IE 中与之对应的是 parentWindow

指向有用给点文档的窗口或框架。

    var parentWindow = document.defaultView || document.parentWindow;

### style

这个 style 对象是 CSSStyleDeclaration 的实例，包含在 HTML 文档中通过 style 特性指定的样式信息。不包含外部样式表或嵌入样式表层叠而来的样式。在Javascript 中用驼峰大小写命名 css 中对应的样式名。

其中一个不能直接转换的样式名是 float，因为它是 Javascript 中的保留字。要通过 cssFloat 访问，IE 中通过 styleFloat 访问。

“DOM2 级样式”规范还为 style 对象定义了一些属性和方法。这些属性和方法在提供元素的 style 特性值的同时，也可以修改样式：

- cssText：如前所述，通过它能够访问到 style 特性中的 CSS 代码；
- length：应用给元素的 CSS 属性的数量；
- item(index)：返回给定位置的 CSS 属性的名称，与 style[index] 返回值相同；
- parentRule：表示 CSS 信息的 CSSRule 对象。本节后面将讨论 CSSRule 类型；
- getPropertyCSSValue(propertyName)：返回包含给定属性值的 CSSValue 对象；
- getPropertyPriority(propertyName)：如果给定的属性使用了!important 设置，则返回"important"；否则，返回空字符串；
- getPropertyValue(propertyName)：返回给定属性的字符串值；
- removeProperty(propertyName)：从样式中删除给定属性；
- setProperty(propertyName,value,priority)：将给定属性设置为相应的值，并加上优先权标志（"important"或者一个空字符串）；

### getComputedStyle(ele: object, value?: any = null) =>

虽然 style 对象能够提供支持 style 特性的任何元素的样式信息，但它不包含那些从其他样式表层叠而来并影响到当前元素的样式信息。

这个方法接受两个参数：要取得计算样式的元素和一个伪元素字符串（例如":after"）。如果不需要伪元素信息，第二个参数可以是 null。

getComputedStyle()方法返回一个 CSSStyleDeclaration 对象（与 style 属性的类型相同），其中包含当前元素的所有计算的样式。

    var myDiv = document.getElementById("myDiv");
    var computedStyle = document.defaultView.getComputedStyle(myDiv, null);
    
    alert(computedStyle.backgroundColor); // "red"
    alert(computedStyle.width); // "100px"
    alert(computedStyle.height); // "200px"
    alert(computedStyle.border); // 在某些浏览器中是"1px solid black"

在 IE 中，每个具有 style 属性的元素还有一个 currentStyle 属性。这个属性是 CSSStyleDeclaration 的实例，包含当前元素全部计算后的样式：

    var myDiv = document.getElementById("myDiv");
    var computedStyle = myDiv.currentStyle;
    
    alert(computedStyle.backgroundColor); //"red"
    alert(computedStyle.width); //"100px"
    alert(computedStyle.height); //"200px"
    alert(computedStyle.border); //undefined

无论在哪个浏览器中，最重要的一条是要记住所有计算的样式都是只读的。

### 偏移量

首先要介绍的属性涉及偏移量（offset dimension），包括元素在屏幕上占用的所有可见的空间：

- offsetHeight，元素在垂直方向上占用的空间大小，以像素计。包括元素的高度、（可见的）水平滚动条的高度、上边框高度和下边框高度；
- offsetWidth，元素在水平方向上占用的空间大小，以像素计。包括元素的宽度、（可见的）垂直滚动条的宽度、左边框宽度和右边框宽度；
- offsetLeft，元素的左外边框至包含元素的左内边框之间的像素距离；
- offsetTop，元素的上外边框至包含元素的上内边框之间的像素距离；

其中， offsetLeft 和 offsetTop 属性与包含元素有关，包含元素的引用保存在 offsetParent 属性中。 

### 客户大小

元素的客户区大小（client dimension），指的是元素内容及其内边距所占据的空间大小：

- clientWidth，是元素内容区宽度加上左右内边距宽度；
- clientHeight，是元素内容区高度加上上下内边距高度；

### 滚动大小

最后要介绍的是滚动大小（scroll dimension），指的是包含滚动内容的元素的大小：

- scrollHeight：在没有滚动条的情况下，元素内容的总高度；
- scrollWidth：在没有滚动条的情况下，元素内容的总宽度；
- scrollLeft：被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置；
- scrollTop：被隐藏在内容区域上方的像素数。通过设置这个属性可以改变元素的滚动位置；

### ele.getBoundingClientRect() => object

确定元素大小。这个方法返回会一个矩形对象，包含 4 个属性： left、 top、 right 和 bottom。

### NodeIterator

使用 document.createNodeIterator()方法创建 NodeIterator 的新实例：

- root：想要作为搜索起点的树中的节点；
- whatToShow：表示要访问哪些节点的数字代码；
- filter：是一个 NodeFilter 对象，或者一个表示应该接受还是拒绝某种特定节点的函数。如果不指定过滤器，传入 null。
- entityReferenceExpansion：布尔值，表示是否要扩展实体引用。这个参数在 HTML 页面中没有用，因为其中的实体引用不能扩展；

whatToShow 参数是一个位掩码，通过应用一或多个过滤器（filter）来确定要访问哪些节点。这个参数的值以常量形式在 NodeFilter 类型中定义：

- NodeFilter.SHOW\_ALL：显示所有类型的节点；
- NodeFilter.SHOW\_ELEMENT：显示元素节点；
- NodeFilter.SHOW\_ATTRIBUTE：显示特性节点。由于 DOM 结构原因，实际上不能使用这个值；
- NodeFilter.SHOW\_TEXT：显示文本节点；
- NodeFilter.SHOW\_CDATA_SECTION：显示 CDATA 节点。对 HTML 页面没有用；
- NodeFilter.SHOW\_ENTITY_REFERENCE：显示实体引用节点。对 HTML 页面没有用；
- NodeFilter.SHOW\_ENTITYE：显示实体节点。对 HTML 页面没有用；
- NodeFilter.SHOW\_PROCESSING_INSTRUCTION：显示处理指令节点。对 HTML 页面没有用；
- NodeFilter.SHOW\_COMMENT：显示注释节点；
- NodeFilter.SHOW\_DOCUMENT：显示文档节点；
- NodeFilter.SHOW\_DOCUMENT_TYPE：显示文档类型节点；
- NodeFilter.SHOW\_DOCUMENT_FRAGMENT：显示文档片段节点。对 HTML 页面没有用；
- NodeFilter.SHOW\_NOTATION：显示符号节点。对 HTML 页面没有用；

除了 NodeFilter.SHOW_ALL 之外，可以使用按位或操作符来组合多个选项，如下面的例子所示：

    var whatToShow = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT;

可以通过 createNodeIterator()方法的 filter 参数来指定自定义的 NodeFilter 对象，或者指定一个功能类似节点过滤器（node filter）的函数。每个 NodeFilter 对象只有一个方法，即 acceptNode()；如果应该访问给定的节点，该方法返回 NodeFilter.FILTER\_ACCEPT，如果不应该访问给定的节点，该方法返回 NodeFilter.FILTER_SKIP。

下列代码展示了如何创建一个只显示 < p > 元素的节点迭代器：

    var filter = {
        acceptNode: function (node) {
            return node.tagName.toLowerCase() == "p" ?
                NodeFilter.FILTER_ACCEPT :
                NodeFilter.FILTER_SKIP;
        }
    };
    var iterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, filter, false);

第三个参数也可以是一个与 acceptNode()方法类似的函数：

    var filter = function(node){
        return node.tagName.toLowerCase() == "p" ?
            NodeFilter.FILTER_ACCEPT :
            NodeFilter.FILTER_SKIP;
    };

NodeIterator 类型的两个主要方法是 nextNode()和 previousNode()。

### TreeWalker

创建 TreeWalker 对象要使用 document.createTreeWalker()方法，这个方法接受的 4 个参数与 document.createNodeIterator()方法相同。

    var div = document.getElementById("div1");
    var filter = function(node){
        return node.tagName.toLowerCase() == "li"?
        NodeFilter.FILTER_ACCEPT :
        NodeFilter.FILTER_SKIP;
    };
    var walker= document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT, filter, false);

TreeWalker 是 NodeIterator 的一个更高级的版本。这个类型还提供了下列用于在不同方向上遍历 DOM 结构的方法：

- parentNode()：遍历到当前节点的父节点；
- firstChild()：遍历到当前节点的第一个子节点；
- lastChild()：遍历到当前节点的最后一个子节点；
- nextSibling()：遍历到当前节点的下一个同辈节点；
- previousSibling()：遍历到当前节点的上一个同辈节点；

由于 IE 中没有对应的类型和方法，所以使用遍历的跨浏览器解决方案非常少见。

### 范围

