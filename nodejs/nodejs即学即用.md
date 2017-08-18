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

