每当一个新的请求访问到达web服务器，它都将调用我们指定的函数方法来处理。

## 核心API

### Events

#### EventEmitter

其他类的父类。

继承EventEmitter类的类的不同实例之间不会共享事件。

    var foo = new Foo;
    var bar = new Foo;

    foo.on('abc', () => { console.log('foo') });
    bar.on('abc', () => { console.log('bar') });

    foo.emit('abc'); // foo
    bar.emit('abc'); // bar

### HTTP

#### HTTP服务器

创建服务器

    var http = require('http');
    var server = http.createServer();
    var handleRequest = function (req, res) {
        res.writeHead(200, {});
        res.end('Hello World');
    }
    server.on('request', handleRequest);
    server.listen(8888);

#### HTTP客户端

通用请求

    var http = require('http');
    var option = {
        host: 'www.baidu.com',
        port: 80,
        path: '/',
        method: HTTP METHOD
    }
    var req = http.request(option, data => {
        console.log(data);
    });
    req.write(...);
    req.end();

GET 请求

    var http = require('http');
    var option = {
        host: 'www.baidu.com',
        port: 80,
        path: '/',
    };
    http.get(option, res => {
        res.on('data', data => {
            console.log(data);
        });
    });

#### URL

解析url

    var url = require('url');
    var myUrl = 'http://um:pw@www.baidu.com/search?a=1&b=2&c=2';

    <!-- 不用 querystring 模块解析  -->
    var parseUrl = url.parse(myUrl);

    <!-- 用 querystring 模块解析  -->
    var parseUrl = url.parse(myUrl, true);

#### querystring

解析 query 字符串

    var qs = require('querystring');
    qs.parse('a=1&b=2&c=3');    // { a: 1, b: 2, c: 3 }

转换 query 字符串

    var qs = require('querystring);
    qs.encode({ a: 1, b: 2, c: 3 });    // 'a=1&b=2&c=3'

### I/O

#### 数据流

创建可读数据流

    var fs = require('fs');
    var filehandle = fs.readFile('data.txt', (err, data) {
        console.log(data);
    });

数据池模式：数据流结束后再处理数据。

    <!-- stream 是个抽象的数据流  -->
    var spool = '';
    stream.on('data', data => {
        spoll += data;
    });
    stream.on('end', () => {
        console.log(spool);
    });

#### 文件系统

异步读取并删除文件

    var fs = require('fs');

    fs.readFile('data.txt', (err, data) => {
        console.log(data);
        fs.unlink('data.txt');
    });

## 工具类API

### DNS

域名与IP地址相互转换

    var dns = require('dns');

    dns.resolve('yahoo.com', 'A', (err, r) => {
        if (err) console.log(err);
        console.log(r);
    });

    dns.lookup('google.com', '4', (err, r) => {
        console.log(a);
    });

### 加密

加密在许多领域都会用到， Node 的加密算法是以 OpenSSL 库为基础的， 这是因为 OpenSSL 的加密算法经过了充分测试， 并且有着良好的实现。 

- 加密模块能使 Node 能够使用 SSL/TLS。
- 加密模块包含的哈希算法， 如 MD5 或 SHA-1， 也许是你在开发应用中会用到的。 
- 加密模块允许你使用 HMAC， 其提供了若干加密方法来确保数据安全。 

#### Hashing

要在Node里使用哈希，需要调用工厂方法 `crypto.createHash()` 来创建一个 `Hash` 对象。

node中使用hash：crypto.createHash(算法)

- md5
- sha1
- sha256
- sha512
- repemd160

在哈希中使用数据时， 可以调用 `hash.update()` 来生成数据摘要。

要把哈希输出， 只需调用 `hash.digest()` 方法， 这会把所有通过 hash.update() 输入的数据生成摘要并输出。

    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    md5.update('foo');
    console.log(
        md5.digest('hex')
    )

#### HMAC

HMAC 结合了哈希算法和加密密钥， 是为了阻止对签名完整性的一些恶意攻击。

`crypto.createHmac()` 返回的是一个 `Hmac` 的实例，提供了update()和digest()方法， 这些和之前我们介绍的 Hash 方法一模一样。

唯一的不同是， 创建 hmac 对象时需要在传入哈希算法的同时， 再传入一个密钥。

创建 Hmac 对象需要的密钥必须是一个 PEM 编码的密钥， 以字符串的格式传入。

> 创建 pem 编码的密钥

    openssl genrsa -out key.pem 1024

> 创建 Hmac 摘要

    > var crypto = require('crypto');
    > var fs = require('fs');
    >>
    var pem = fs.readFileSync('key.pem');
    > var key = pem.toString('ascii');
    >>
    var hmac = crypto.createHmac('sha1', key);
    >>
    hmac.update('foo');
    {}
    > hmac.digest('hex');
    '7b058f2f33ca28da3ff3c6506c978825718c7d42'
    >

#### 公钥加密

公钥加密功能分布在如下 4 个类中： Cipher、 Decipher、 Sign 和 Verify。

Cipher 把数据加密， Decipher 解密数据， Sign 为数据创建加密签名， Verify 验证加密签名。

> 从私钥中提取公钥证书

    openssl req -key key.pem -new -x509 -out cert.pem

我们让 OpenSSL 读取私钥， 然后把公钥以 X509 证书格式输出到 cert.pem 文件中。加密算法用到的密钥都要求是 PEM 格式的。

**用 cipher 加密**

`crypto.createCipher()` 创建 cipher 实例。该工厂方法输入一个算法和私钥， 然后创建 cipher 对象。 支持的算法是从你安装的 OpenSSL 实现中支持的：

- blowfish
- aes192

`cipher.update()`  方法来输入数据。输入数据足够创建加密块就返回，不够则保存在 cipher 对象中。

Cipher 当调用 `cipher.final()` 时， cipher 对象中剩余的所有数据都会被加密并返回， 但会添加足够的填充使其满足块大小的要求。

>  密码与块大小

    var crypto = require('crypto');
    var fs = require('fs');

    var pem = fs.readFileSync('key.pem');
    var key = pem.toString('ascii');

    var cipher = crypto.createCipher('blowfish', key);

    <!-- ''  -->
    cipher.update(new Buffer(4), 'binary', 'hex');

    <!-- 'ff57e5f742689c85' -->
    cipher.update(new Buffer(4), 'binary', 'hex');

    <!-- ''  -->
    cipher.update(new Buffer(4), 'binary', 'hex');

    <!-- '96576b47fe130547'  -->
    cipher.final('hex')

**用 Decipher 解密**

Decipher 类几乎就是 Cipher 类的反面。 你可以把加密的数据通过 `decipher.update()` 传给一个 Decipher 对象， 它会把数据以流的形式保存成块，并在数据足够的时候输出解密数据。 

> 文本加密与解密

    > var crypto = require('crypto');
    > var fs = require('fs');
    >>
    var pem = fs.readFileSync('key.pem');
    > var key = pem.toString('ascii');
    >>
    var plaintext = new Buffer('abcdefghijklmnopqrstuv');
    > var encrypted = "";
    > var cipher = crypto.createCipher('blowfish', key);
    > ..
    > encrypted += cipher.update(plaintext, 'binary', 'hex');
    > encrypted += cipher.final('hex');
    >>
    var decrypted = "";
    > var decipher = crypto.createDecipher('blowfish', key);
    > decrypted += decipher.update(encrypted, 'hex', 'binary');
    > decrypted += decipher.final('binary');
    >>
    var output = new Buffer(decrypted);

**用 Sign 来创建签名**

Signatures 验证的是签名者是否用其私钥对数据进行授权。 但是， 和 HMAC 不同，公钥可以用来对签名进行认证。

`crypto.createSign()` 用来创建 `sign` 对象。createSign() 只需要传入签名算法； 

`sign.update()` 可给 sign 对象添加数据。想创建签名时， 可以用你的私钥来调用 `sign.sign()` 给数据进行签名。

> 用 sign 对数据进行签名

    > var sign = crypto.createSign('RSA-SHA256');
    > sign.update('abcdef');
    {}
    > sig = sign.sign(key, 'hex');
    '35eb47af5260a00c7bad26edfbe7732a897a3a03290963e3d17f48331a42...aa81b'
    >

**用 Verify 来验证签名**

 用 `verify.update()` 来添加数据，且当你把需要验证的数据都添加好后，就可以调用 `verify.verify()` 对签名进行验证了，它需要传入证书（ 公钥）、签名以及签名的格式。

 > 验证签名

    > var crypto = require('crypto');
    > var fs = require('fs');
    >>
    var privatePem = fs.readFileSync('key.pem');
    > var publicPem = fs.readFileSync('cert.pem');
    > var key = privatePem.toString();
    > var pubkey = publicPem.toString();
    >>
    var data = "abcdef"
    >>
    var sign = crypto.createSign('RSA-SHA256');
    > sign.update(data);
    {}
    > var sig = sign.sign(key, 'hex');
    >>
    var verify = crypto.createVerify('RSA-SHA256');
    > verify.update(data);
    {}
    > verify.verify(pubkey, sig, 'hex');
    1

### 进程

Node 中可以使用系统中已经存在的进程，或者创建新的子进程来做各种工作。 

#### process 模块

可以使用 process 模块从当前的 Node 进程中获得信息， 并可以修改配置。

和其他大部分模块不同， process 模块是全局的， 并且可以一直通过变量 process 获得。

##### process 事件

process 是 EventEmitter 的实例， 所以它提供了基于对 Node 进程的系统调用的事件。 

`exit` 事件提供了在 Node 进程退出前的最终响应时机。

> 在 Node 退出前调用代码

    <!-- 因为事件循环不会再运行， 因此 setTimeout() 里的代码永远不会执行  -->
    process.on('exit', function () {
        setTimeout(function () {
            console.log('This will not run');
        }, 100);
        console.log('Bye.');
    });

process 提供的一个非常有用的事件是 `uncaughtException`。

uncaughtException 事件会提供一个极其暴力的方法来捕获这些异常。

> 通过 uncaughtException 事件捕获异常

    process.on('uncaughtException', function (err) {
        console.log('Caught exception: ' + err);
    });

    setTimeout(function () {
        console.log('This will still run.');
    }, 500);

    <!-- 故意导致异常， 并且不捕获它。 -->
    nonexistentFunc();
    console.log('This will not run.');

在这个例子中， 因为 nonexistentFunc() 抛出了异常， 所以在它之后的代码都不会执行下去。

> 捕获异常的回调函数的作用

    var http = require('http');
    var server = http.createServer(function(req,res) {
        res.writeHead(200, {});
        res.end('response');
        badLoggingCall('sent response');
        console.log('sent response');
    });

    process.on('uncaughtException', function(e) {
        console.log(e);
    });

    server.listen(8080);

在 HTTP 服务器中， 回调函数在发送了 HTTP 响应后， 故意调用了一个错误的函数。 

##### 与当前的 Node 进程交互

process 包含了有关 Node 进程的许多元信息。

这里面包含了关于 Node 进程的若干不可改变（ 只读） 的信息，例如：

- process.version： 正在运行的 Node 的版本号
- process.installPrefix：安装时指定的安装目录 (/usr/local、 ~/local 等 )
- process.platform：会列出正在运行的平台名称。 输出内容会指明内核（ linux2、 darwin 等）， 而不是 Redhat ES3、 Windows 7、 OSX 10.7 这一类名称。
- process.pid：正在运行的 Node 实例的进程 ID， 或称为 PID。
- process.execPath：显示的是当前执行的 node 程序所在的路径。
- process.uptime()：出当前进程运行了多少秒。
- process.cwd()：当前的工作目录。
- process.memoryUsage()：来得到当前进程的内存使用情况。

此外， 你还可以从 Node 进程得到或设置一些属性。 

你可以调用 process.getgid()、 process.setgid()、process.getuid() 和 process.setuid() 来获得或修改这些属性。

你还能修改 process.title 属性来设置 Node 显示在系统的标题名称， 该属性修改后的内容会在 ps 命令调用时显示出来。 当你在生产环境中需要运行多个 Node 进程时， 这会很有用。

#### 操作系统输入 / 输出

其中一个主要功能就是可以访问操作系统的标准 I/O 流， stdin 是进程的默认输入流， stdout 是进程的输出流， stderr 是其错误输出流。 它们对应暴露的接口是process.stdin、 process.stdout 和 process.stderr， 其 中 process.stdin 是可读的数据流， 而 process.stdout 和 process.stderr 是可写的数据流。

(1) process.stdin stdin 在进程间通信时是非常有用的， 它能够为命令行下采用管道通信提供便利。 当我们输入 cat file.txt | node program.js 时， 标准输入流会接收到 cat 命令输出的数据。

因为任何时候都能使用 process， 所以 process.stdin 也会为所有的 Node 进程初始化。 但它一开始是处于暂停状态， 这时候 Node 可以对它进行写入操作， 但是你不能从它读取内容。 在尝试从 stdin 读数据之前， 需要先调用它的 resume() 方法。 Node 会为此数据流填入供读取的缓存， 并等待你的处理， 这样可以避免数据丢失。

> 把标准输入写到标准输出

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (chunk) {
        process.stdout.write('data: ' + chunk);
    });

    process.stdin.on('end', function () {
        process.stdout.write('end');
    });

因为 stdin 和 stdout 都是真正的数据流， 所以我们也可以采用更简便的方法， 那就是使用数据流的 pipe() 方法。

> 通过管道把标准输入转到标准输出

    process.stdin.resume();
    process.stdin.pipe(process.stdout);

这是连接两个数据流的最漂亮的方式。

(2) process.stderr stderr 用来输出异常和程序运行过程中遇到的问题。

还需要注意的是， process.stderr 永远是 UTF-8 编码的数据流。 不需要设置编码格式， 你写入 process.stderr 的所有数据都会被当做 UTF-8 来处理。 而且， 你不能更改编码格式。

另外， Node 程序员要从操作系统读取的内容还包括了程序启动时的参数。 argv 是包含命令行参数的数组， 以 node 命令为第一个参数

> 输出 argv 的简单脚本

    console.log(process.argv);

##### 事件循环和计数器

process.nextTick() 创建了一个回调函数， 它会在下一个 tick 或者事件循环下一次迭代时被调用。

> 用 process.nextTick() 往事件循环队列里插入回调函数

    > var http = require('http');
    > var s = http.createServer(function(req, res) {
    ... res.writeHead(200, {});
    ... res.end('foo');
    ... console.log('http response');
    ... process.nextTick(function(){console.log('tick')});
    ... });
    > s.listen(8000);
    >>
    http response
    tick
    http response
    tick

#### 子进程

你可以使用 child_process 模块来为 Node 主进程创建子进程。 因为 Node 的单进程只有一个事件循环， 所以有时候创建子进程是很有用的。

比如， 你可能需要用此方法来更好地利用 CPU 的多核， 而单个 Node 进程只能使用其中一个核。

child_process 有两个主要的方法。 

`spawn()` 会创建一个子进程， 有独立的stdin、 stdout 和 stderr 文件描述符。 

- 第一个参数是让进城开始运行的`可执行程序`，如：''。
- 第二个参数是数组形式的进城参数（空格分隔）。
- 第三个参数是选项数组。



`exec()` 会创建子进程， 会在进程结束的时候以回调函数的方式返回结果。 

- 第一个参数是让进城开始运行的`命令字符串`，如：'ls -l'。
- 第二个参数是配置对象。
- 第三个参数是进城结束时调用的回调函数。

> child_process.exec() 的默认配置对象

    var options = {
        encoding: 'utf8',
        timeout: 0,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        setsid: false,
        cwd: null,
        env: null 
    };

- encoding: I/O 流输入字符的编码格式。
- timeout: 进程运行的时间， 以毫秒为单位。
- killSignal: 当时间或 Buffer 大小超过限制时， 用来终止进程的信号。
- maxBuffer: stdout 或 stderr 允许最大的大小， 以千字节为单位。
- setsid: 是否创建 Node 子进程的新会话。
- cwd: 为子进程初始化工作目录（ null 表示使用当前的进程工作目录）。
- env: 进程的环境变量。 所有的环境变量都可以从父进程继承。