## requestAnimationFrame()

Firefox 4 最早为 JavaScript 动画添加了一个新 API，即 mozRequestAnimationFrame()。这个方法会告诉浏览器：有一个动画开始了。进而浏览器就可以确定重绘的最佳方式。

### 早期动画循环

在 JavaScript 中创建动画的典型方式，就是使用 setInterval()方法来控制所有动画。以下是一个使用 setInterval()的基本动画循环：

    (function(){
        function updateAnimations(){
            doAnimation1();
            doAnimation2();
            //其他动画
        }
        setInterval(updateAnimations, 100);
    })();

简言之，以毫秒表示的延迟时间并不代表到时候一定会执行动画代码，而仅代表到时候会把代码添加到任务队列中。如果 UI 线程繁忙，比如忙于处理用户操作，那么即使把代码加入队列也不会立即执行。

### 循环间隔的问题

以下是几个浏览器的计时器精度：

- IE8 及更早版本的计时器精度为 15.625ms；
- IE9 及更晚版本的计时器精度为 4ms；
- Firefox 和 Safari 的计时器精度大约为 10ms；
- Chrome 的计时器精度为 4ms；

### mozRequestAnimationFrame

Mozilla 的 Robert O’Callahan 认识到了这个问题，提出了一个非常独特的方案。他指出，CSS 变换和动画的优势在于浏览器知道动画什么时候开始，因此会计算出正确的循环间隔，在恰当的时候刷新UI。而对于 JavaScript 动画，浏览器无从知晓什么时候开始。因此他的方案就是创造一个新方法mozRequestAnimationFrame()，通过它告诉浏览器某些 JavaScript 代码将要执行动画。这样浏览器可以在运行某些代码后进行适当的优化。

mozRequestAnimationFrame()方法接收一个参数，即在重绘屏幕前调用的一个函数。这个函数负责改变下一次重绘时的 DOM 样式。为了创建动画循环，可以像以前使用 setTimeout()一样，把多个对 mozRequestAnimationFrame()的调用连缀起来。比如：

    function updateProgress(){
        var div = document.getElementById("status");
        div.style.width = (parseInt(div.style.width, 10) + 5) + "%";
        if (div.style.left != "100%"){
            mozRequestAnimationFrame(updateProgress);
        }
    }
    
    mozRequestAnimationFrame(updateProgress);


    function draw(timestamp) {
        //计算两次重绘的时间间隔
        var diff = timestamp - startTime;
        
        //使用 diff 确定下一步的绘制时间
        //把 startTime 重写为这一次的绘制时间
        startTime = timestamp;

        //重绘 UI
        mozRequestAnimationFrame(draw);
    }
    var startTime = mozAnimationStartTime;
    mozRequestAnimationFrame(draw);

### webkitRequestAnimationFrame与msRequestAnimationFrame

## Page Visibility API

不知道用户是不是正在与页面交互，这是困扰广大 Web 开发人员的一个主要问题。如果页面最小化了或者隐藏在了其他标签页后面，那么有些功能是可以停下来的，比如轮询服务器或者某些动画效果。而 Page Visibility API（页面可见性 API）就是为了让开发人员知道页面是否对用户可见而推出的。

这个 API 本身非常简单，由以下三部分组成：

- document.hidden：表示页面是否隐藏的布尔值。页面隐藏包括页面在后台标签页中或者浏览器最小化；
- document.visibilityState：表示下列 4 个可能状态的值：
    - 页面在后台标签页中或浏览器最小化；
    - 页面在前台标签页中；
    - 实际的页面已经隐藏，但用户可以看到页面的预览（就像在 Windows 7 中，用户把鼠标移动到任务栏的图标上，就可以显示浏览器中当前页面的预览）；
    - 页面在屏幕外执行预渲染处理；
- visibilitychange 事件：当文档从可见变为不可见或从不可见变为可见时，触发该事件；

### 兼容性

在编写本书时，只有 IE10 和 Chrome 支持 Page Visibility API。

## File API

File API（文件 API）的宗旨是为 Web 开发人员提供一种安全的方式，以便在客户端访问用户计算机中的文件，并更好地对这些文件执行操作。

HTML5 在DOM 中为文件输入元素添加了一个 files 集合。在通过文件输入字段选择了一或多个文件时， files集合中将包含一组 File 对象，每个 File 对象对应着一个文件。每个 File 对象都有下列只读属性：

- name：本地文件系统中的文件名；
- size：文件的字节大小；
- type：字符串，文件的 MIME 类型；
- lastModifiedDate：字符串，文件上一次被修改的时间（只有 Chrome 实现了这个属性）；

举个例子，通过侦听 change 事件并读取 files 集合就可以知道选择的每个文件的信息：

    var filesList = document.getElementById("files-list");
    EventUtil.addHandler(filesList, "change", function(event) {
        var files = EventUtil.getTarget(event).files,
            i = 0, len = files.length;

        while (i < len) {
            console.log(files[i].name + " (" + files[i].type + ", " + files[i].size + " bytes) ");
            i++;
        }
    });

### 兼容性

支持 File API 的浏览器有 IE10+、 Firefox 4+、 Safari 5.0.5+、 Opera 11.1+和 Chrome。

### FileReader类型

FileReader 类型实现的是一种异步文件读取机制。可以把FileReader 想象成XMLHttpRequest，区别只是它读取的是文件系统，而不是远程服务器。为了读取文件中的数据， FileReader 提供了如下几个方法：

- readAsText(file,encoding)：以纯文本形式读取文件，将读取到的文本保存在 result 属性中。第二个参数用于指定编码类型，是可选的；
- readAsDataURL(file)：读取文件并将文件以数据 URI 的形式保存在 result 属性中；
- readAsBinaryString(file)：读取文件并将一个字符串保存在 result 属性中，字符串中的每个字符表示一字节；
- readAsArrayBuffer(file)：读取文件并将一个包含文件内容的 ArrayBuffer 保存在result 属性中；

### 读取拖放的文件

围绕读取文件信息，结合使用 HTML5 拖放 API 和文件 API，能够创造出令人瞩目的用户界面：在页面上创建了自定义的放置目标之后，你可以从桌面上把文件拖放到该目标。与拖放一张图片或者一个链接类似，从桌面上把文件拖放到浏览器中也会触发 drop 事件。而且可以在 event.dataTransfer. files中读取到被放置的文件，当然此时它是一个 File 对象，与通过文件输入字段取得的 File 对象一样。

下面这个例子会将放置到页面中自定义的放置目标中的文件信息显示出来：

### 使用XHR上传文件

还有一种利用这个功能的流行做法，即结合 XMLHttpRequest 和拖放文件来实现上传。

## Web 计时

Web Timing API 让开发人员通过 JavaScript 就能使用浏览器内部的度量结果，通过直接读取这些信息可以做任何想做的分析。

Web Timing API 已经成为了 W3C 的建议标准，只不过目前支持它的浏览器还不够多。

Web 计时机制的核心是 window.performance 对象。

## Web Workers

随着 Web 应用复杂性的与日俱增，越来越复杂的计算在所难免。长时间运行的 JavaScript 进程会导致浏览器冻结用户界面，让人感觉屏幕“冻结”了。 Web Workers 规范通过让 JavaScript 在后台运行解决了这个问题。

### 兼容性

目前支持 Web Workers 的浏览器有 IE10+、 Firefox 3.5+、 Safari 4+、 Opera 10.6+、 Chrome 和 iOS 版的 Safari。

### 使用Worker

实例化 Worker 对象并传入要执行的 JavaScript 文件名就可以创建一个新的 Web Worker：

    var worker = new Worker("stufftodo.js");

这行代码会使浏览器下载 stufftodo.js，但只有 Worker 接收到消息才会实际执行文件中的代码。要给 Worker 传递消息，可以使用 postMessage() 方法（与 XDM 中的 postMessage()方法类似）：

    worker.postMessage(“ start! ");

Worker 是通过 message 和 error 事件与页面通信的。来自 Worker 的数据保存在 event.data 中：

    worker.onmessage = function(event){
        var data = event.data;
        //对数据进行处理
    }

Worker 不能完成给定的任务时会触发 error 事件。具体来说， Worker 内部的 JavaScript 在执行过程中只要遇到错误， 就会触发 error 事件。发生 error 事件时，事件对象中包含三个属性： filename、lineno 和 message，分别表示发生错误的文件名、代码行号和完整的错误消息：

    worker.onerror = function(event){
        console.log("ERROR: " + event.filename + " (" + event.lineno + "): " +
        event.message);
    };

任何时候，只要调用 terminate()方法就可以停止 Worker 的工作。而且， Worker 中的代码会立即停止执行，后续的所有过程都不会再发生（包括 error 和 message 事件也不会再触发）。

    worker.terminate(); //立即停止 Worker 的工作

### Worker 全局作用域

关于 Web Worker，最重要的是要知道它所执行的 JavaScript 代码完全在另一个作用域中，与当前网页中的代码不共享作用域。在 Web Worker 中，同样有一个全局对象和其他对象以及方法。

但是， WebWorker 中的代码不能访问 DOM，也无法通过任何方式影响页面的外观。

