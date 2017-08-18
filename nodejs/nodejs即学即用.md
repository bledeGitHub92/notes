每当一个新的请求访问到达web服务器，它都将调用我们指定的函数方法来处理。

## 核心API

#### EventEmitter

其他类的父类。

继承EventEmitter类的类的不同实例之间不会共享事件。

    var foo = new Foo;
    var bar = new Foo;

    foo.on('abc', () => { console.log('foo') });
    bar.on('abc', () => { console.log('bar') });

    foo.emit('abc'); // foo
    bar.emit('abc'); // bar

#### HTTP

#### HTTP服务器

创建服务器

    ```js
    var http = require('http');
    ``` 

#### HTTP客户端

