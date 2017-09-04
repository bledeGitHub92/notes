## script 元素

script 标签由 Netscape Navigator 创建，并纳入 HTML 标准。HTML4.01 为 script 标签定义了下列 6 个属性：

- src：可选。表示包含要执行代码的外部文件。
- async：可选，只对外部脚本文件有效。表示应该立即下载脚本，但不应该妨碍页面中的其他操作，比如下载其他资源或等待加载其他脚本。
- defer：可选，只对外部脚本文件有效。表示脚本可以延迟到文档被完全解析和显示之后再执行。
- type：可选。可以看成 language 的替代属性。默认为 text/javascript。
- charset：可选。表示 src 属性指定的代码的字符集。由于大多数浏览器会忽略它的值，因此这个属性很少有人使用。
- language：已废弃。表示编写代码使用的脚本语言。

### 标签的位置

由于下载和解析 Javascript 文件时，页面的处理会暂时停止，所以一般把 script 标签放在 /body 标签之前。防止加载和解析 Javascript 文件期间，浏览器窗口是一片空白。

### 延迟脚本

给 script 标签设置 defer 属性，相当于告诉浏览器立即下载脚本，但延迟到文档解析和显示完成之后再执行。

根据 HTML5 规范，延迟脚本会按顺序执行，且先于 DOMContentLoaded 事件执行。但现实中，延迟脚本不一定按顺序执行，且不一定先于 DOMContentLoaded 事件执行。所以最好只包含一个延迟脚本。

由于部分浏览器会忽略 defer 属性，所以把延迟脚本放在 /body 前面仍是最佳选择。

### 异步脚本

HTML5 为 script 标签定义了 async 属性。与 defer 类似，但是并不保证脚本的执行顺序。使用 async 属性可以让当前脚本不必等待其他脚本，也不必阻塞文档呈现。从而异步加载页面的其他内容。因此，建议异步脚本不要在加载期间修改 DOM。

异步脚本一定会在页面的 load 事件之前执行，但可能会在 DOMContentLoaded 事件之前或之后执行。

## noscript 标签

当浏览器不支持 Javascript 时，让页面平稳退化。

noscript 标签内支持除 script 标签之外的任意 html 标签。