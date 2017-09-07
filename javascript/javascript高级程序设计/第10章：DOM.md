本章主要讨论与浏览器的 HTML 页面相关的 DOM1 级的特性和应用。

DOM 是针对 HTML 和 XML 文档的一个 API（应用编程接口）。DOM 描绘了一个层次化的节点树，允许开发人员添加、移除和修改页面的一部分。

## 节点层次

DOM 可以将任何 HTML 或 XML 描绘成一个由多层节点构成的结构。节点分为几种不同的类型，每种类型都分别表示文档中不同的的信息及标记。每个节点都拥有各自的特点、数据和方法，另外也与其他节点存在某种关系。

文档节点是文档的根节点。文档元素是文档节点的子节点。每个文档只有一个文档元素，且所有其他元素都包含在文档元素之中。在 HTML 页面中，文档元素始终是 < html > 元素。

### Node 类型

#### nodeType

DOM1 级定义了一个 Node 接口，该接口将由 DOM 中的所有节点类型实现。Javascript 中的所有节点类型都继承自 Node 类型，因此所有节点类型都共享着相同的基本属性和方法。

每个节点都有一个 nodeType 属性，用于表示节点的类型。节点类型由在 Node 类型中定义的 12 个数值常量来表示。

由于 IE 未公开 Node 类型的构造函数，所有为确保见兼容性，使用 nodeType 属性与数字进行比较。

#### nodeName & nodeValue

节点的具体信息。

#### 节点关系

文档中所有节点之间都存在某种关系。

`childNodes`

保存着一个 NodeList 对象。NodeList 是一个类数组对象，保存着某个节点的子节点。

NodeList 对象是基于 DOM 结构动态执行的查询结果，因此 DOM 结构的变化能自动反映在 NodeList 对象中。

`parentNode`

`previousSibling & nextSibling`

`firstChild & lastChild`

`ownerDocument`

`hasChildNodes() => boolean`

#### 操作节点

`appendChild(node) => node`

`insertBefore(node, refer) => node`

`replaceChild(node, replaced) => replaced`

`removeChild(node) => node`

`clone(value?: boolean = false) => node`

`normalize()`

### Document 类型

JavaScript 通过 Document 类型表示文档。在浏览器中， document 对象是 HTMLDocument（继承自 Document 类型）的一个实例，表示整个 HTML 页面。而且， document 对象是 window 对象的一个属性，因此可以将其作为全局对象来访问。通过这个文档对象，不仅可以取得与页面有关的信息，而且还能操作页面的外观及其底层结构。Document 节点具有下列特征：

- nodeType 的值为 9
- nodeName 的值为 '#document'
- nodeValue 的值为 null
- parentNode 的值为 null
- ownerDocument 的值为 null

#### 文档的子节点

#### 查找元素

#### 特殊集合

#### DOM 一致性检测

### Element 类型

所有的 HTMl 元素都是由 HTMLElement 

## DOM 操作技术

### 动态脚本

页面加载时不存在，将来通过 DOM 动态添加脚本。动态加载的 Javascript 文件能立即运行。

    function loadScript (url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
    }

    loadScript('client.js');

### 动态样式

页面加载时不存在，将来通过 DOM 动态添加样式。

    function loadStyles(url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    }

    loadStyles('styles.css');

### 操作表格

为了方便构建表格， HTML DOM 还为 < table >、 < tbody >、< tr > 元素添加了一些属性和方法。

### 使用 NodeList

理解 NodeList 及其“近亲” NamedNodeMap 和 HTMLCollection，是从整体上透彻理解 DOM 的关键所在。

这三个集合都是动态的：每当文档结构发生变化时，它们都会得到更新。

## 小结

理解 DOM 的关键，就是理解 DOM 对性能的影响。 DOM 操作往往是 JavaScript 程序中开销最大的部分，而因访问 NodeList 导致的问题为最多。 NodeList 对象都是“动态的”，这就意味着每次访问 NodeList 对象，都会运行一次查询。有鉴于此，最好的办法就是尽量减少 DOM 操作。