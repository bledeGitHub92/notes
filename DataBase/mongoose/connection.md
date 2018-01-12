## Connections

你可以通过 mongoose.connect() 连接到 MongoDB：

    mongoose.connect('mongodb://localhost/myapp');

可以指定额外的信息：

    mongoose.connect('mongodb://username:password@host:port/database?options...');

## Operation Buffering

mongoose 让你可以立刻使用你的模型，不需要等待 mongoose 建立到 MongoDB 上的连接。

    mongoose.connect('mongodb://localhost/myapp');

    var MyModel = mongoose.model('Test', new Schema({ name: String }));

    <!-- Works -->
    MyModel.findOne(function(error, result) { /* ... */ });

有好有坏，没有建立连接之前使用模型，mongoose 不会抛出任何错误。

    var MyModel = mongoose.model('Test', new Schema({ name: String }));

    <!-- Will just hang until mongoose successfully connects -->
    MyModel.findOne(function(error, result) { /* ... */ });

    setTimeout(function() {
        mongoose.connect('mongodb://localhost/myapp');
    }, 60000);

关闭缓存，检查是否没有正确的打开连接。

## Options

connect 方法可以接受一个参数对象。参数对象的优先级比传入第一个参数的高。

    mongoose.connect(uri, options);

下列是可用的参数：

    db             - passed to the [underlying driver's db instance](http://mongodb.github.io/node-mongodb-native/2.1/api/Db.html)
    server         - passed to the [underlying driver's server instance(s)](http://mongodb.github.io/node-mongodb-native/2.1/api/Server.html)
    replset        - passed to the [underlying driver's ReplSet instance](http://mongodb.github.io/node-mongodb-native/2.1/api/ReplSet.html)
    user           - username for authentication (if not specified in uri)
    pass           - password for authentication (if not specified in uri)
    auth           - options for authentication
    mongos         - passed to the [underlying driver's mongos options](http://mongodb.github.io/node-mongodb-native/2.1/api/Mongos.html)
    promiseLibrary - sets the [underlying driver's promise library](http://mongodb.github.io/node-mongodb-native/2.1/api/MongoClient.html)

    var options = {
        db: { native_parser: true },
        server: { poolSize: 5 },
        replset: { rs_name: 'myReplicaSetName' },
        user: 'myUserName',
        pass: 'myPassword'
    }
    mongoose.connect(uri, options);

**Note**: The server option auto_reconnect is defaulted to true which can be overridden. The db option forceServerObjectId is set to false which cannot be overridden.

**Note**: If auto_reconnect is on, mongoose will give up trying to reconnect after a certain number of failures. Set the server.reconnectTries and server.reconnectInterval options to increase the number of times mongoose will try to reconnect.

    <!-- Good way to make sure mongoose never stops trying to reconnect -->
    mongoose.connect(uri, { server: { reconnectTries: Number.MAX_VALUE } });

## Callback

connect() 也可以接收一个 callback 参数或返回一个 promise。

    mongoose.connect(uri, options, function(error) {
        <!-- Check error in initial connection. There is no 2nd param to the callback. -->
    });

    <!-- Or using promises -->
    mongoose.connect(uri, options).then(
        () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
        err => { /** handle initial connection error */ }
    );

## Connection String Options

mongoose 在 connection string 中支持下列选项：

- ssl
- poolSize
- autoReconnect
- socketTimeoutMS
- connectTimeoutMS
- authSource
- retries
- authMechanism
- reconnectWait
- rs_name
- replicaSet
- nativeParser
- w
- journal
- wtimeoutMS
- readPreference
- readPreferenceTags
- sslValidate

For long running applications, it is often prudent to enable keepAlive with a number of milliseconds. Without it, after some period of time you may start to see "connection closed" errors for what seems like no reason. If so, after reading this, you may decide to enable keepAlive:

    options.server.socketOptions = options.replset.socketOptions = { keepAlive: 120 };
    mongoose.connect(uri, options);

## Replica Set Connections

连接副本集，需要传递一个逗号分节符，列出所有的主机名。

    mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);

连接只有一个节点的副本集，指定 replicaSet 选项。

    mongoose.connect('mongodb://host1:port1/?replicaSet=rsName');

## Multi-mongos support

High availability over multiple mongos instances is also supported. Pass a connection string for your mongos instances and set the mongos option to true:

    mongoose.connect('mongodb://mongosA:27501,mongosB:27501', { mongos: true }, cb);

## Multiple connections

目前为止，我们介绍了如何用 mongoose 的默认连接连接 MongoDB。有时，我们或许需要用多条连接打开 Mongo，每个有不同的读写权限或仅仅连接不同的数据库。这种情况下，我们可以利用 mongoose.createConnection() 接受之前讨论的所有参数给你返回一个新鲜的连接。

    var conn = mongoose.createConnection('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]', options);

这个连接稍后用来创建和检索模型。模型总是限定在一个连接中。

## Connection pools

Each connection, whether created with mongoose.connect or mongoose.createConnection are all backed by an internal configurable connection pool defaulting to a size of 5. Adjust the pool size using your connection options:

    // single server
    var uri = 'mongodb://localhost/test';
    mongoose.createConnection(uri, { server: { poolSize: 4 }});

    // for a replica set
    mongoose.createConnection(uri, { replset: { poolSize: 4 }});

    // passing the option in the URI works with single or replica sets
    var uri = 'mongodb://localhost/test?poolSize=4';
    mongoose.createConnection(uri);

## The `useMongoClient` Option

mongoose 默认的连接逻辑在 4.11.0 废弃了。通过配置 useMongoClient 选项启动新的连接逻辑。

    <!-- Using `mongoose.connect`... -->
    var promise = mongoose.connect('mongodb://localhost/myapp', {
        useMongoClient: true,
        /* other options */
    });

    <!-- Or `createConnection` -->
    var promise = mongoose.createConnection('mongodb://localhost/myapp', {
        useMongoClient: true,
        /* other options */
    });
    promise.then(function(db) {
        /* Use `db`, for instance `db.model()`
    });

    <!-- Or, if you already have a connection -->
    connection.openUri('mongodb://localhost/myapp', { /* options */ });

The parameters to openUri() are passed transparently to the underlying MongoDB driver's MongoClient.connect() function. Please see the driver documentation for this function for options. The same is true for connect() and createConnection() if useMongoClient is true.

You may see the following deprecation warning with useMongoClient:

    the server/replset/mongos options are deprecated, all their options are supported at the top level of the options object

In older version of the MongoDB driver you had to specify distinct options for server connections, replica set connections, and mongos connections:

    mongoose.connect(myUri, {
        server: {
            socketOptions: {
            socketTimeoutMS: 0,
            keepAlive: true
            },
            reconnectTries: 30
        },
        replset: {
            socketOptions: {
            socketTimeoutMS: 0,
            keepAlive: true
            },
            reconnectTries: 30
        },
        mongos: {
            socketOptions: {
            socketTimeoutMS: 0,
            keepAlive: true
            },
            reconnectTries: 30
        }
    });

With useMongoClient you can instead declare these options at the top level, without all that extra nesting. Here's the list of all supported options.

    // Equivalent to the above code
    mongoose.connect(myUri, {
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30
    });

This deprecation is because the MongoDB driver has deprecated an API that is critical to mongoose's connection logic to support MongoDB 3.6, see this github issue and this blog post for more details.