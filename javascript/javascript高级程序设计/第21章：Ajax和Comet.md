## XMLHttpRequest 对象

IE7+、 Firefox、 Opera、 Chrome 和 Safari 都支持原生的 XHR 对象，在这些浏览器中创建 XHR 对象要像下面这样使用 XMLHttpRequest 构造函数：

    var xhr = new XMLHttpRequest();

### XHR的用法

在使用 XHR 对象时，要调用的第一个方法是 open()，它接受 3 个参数：要发送的请求的类型（"get"、 "post"等） 、请求的 URL 和表示是否异步发送请求的布尔值：

> URL 相对于执行代码的当前页面（当然也可以使用绝对路径）；调用 open() 方法并不会真正发送请求，而只是启动一个请求以备发送；

    xhr.open("get", "example.php", false);

要发送特定的请求，必须像下面这样调用 send()方法：

> 这里的 send()方法接收一个参数，即要作为请求主体发送的数据。没有请求主体发送数据，则必须传入 null，因为这个参数对有些浏览器来说是必需的。调用 send()之后，请求就会被分派到服务器。

    xhr.open("get", "example.php", false);
    xhr.send(null);

由于这次请求是同步的， JavaScript 代码会等到服务器响应之后再继续执行。在收到响应后，响应的数据会自动填充 XHR 对象的属性，相关的属性简介如下：

- responseText：作为响应主体被返回的文本；
- responseXML：如果响应的内容类型是"text/xml"或"application/xml"，这个属性中将保存包含着响应数据的 XML DOM 文档；
- status：响应的 HTTP 状态；
- statusText： HTTP 状态的说明；

为确保接收到适当的响应，应该像下面这样检查上述这两种状态代码：

    xhr.open("get", "example.txt", false);
    xhr.send(null);
    
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
        alert(xhr.responseText);
    } else {
        alert("Request was unsuccessful: " + xhr.status);
    }

但多数情况下，我们还是要发送异步请求，才能让 JavaScript 继续执行而不必等待响应。此时，可以检测 XHR 对象的 readyState 属性，该属性表示请求/响应过程的当前活动阶段。这个属性可取的值如下：

- 0：未初始化。尚未调用 open() 方法；
- 1：启动。已经调用 open()方法，但尚未调用 send()方法；
- 2：发送。已经调用 send()方法，但尚未接收到响应；
- 3：接收。已经接收到部分响应数据；
- 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了；

readystatechange 事件：只要 readyState 属性的值由一个值变成另一个值就会触发该事件。

必须在调用 open()之前指定 onreadystatechange 事件处理程序才能确保跨浏览器兼容性：

> 以下代码利用 DOM 0 级方法为 XHR 对象添加了事件处理程序，原因是并非所有浏览器都支持 DOM 2级方法。

    var xhr = createXHR();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                alert(xhr.responseText);
            } else {
                alert("Request was unsuccessful: " + xhr.status);
            }
        }
    };
    xhr.open("get", "example.txt", true);
    xhr.send(null);

