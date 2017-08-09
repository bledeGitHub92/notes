## 模式

模式的名字（加 s）对应到 MongoDB 中的集合的名字，还定义了集合中文档的结构。


    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var blogSchema = new Schema({
        title: String,
        author: String,
        body: String,
        comments: [{ body: String, date: Date }],
        date: { type: Date, default: Date.now },
        hidden: Boolean,
        meta: {
            votes: Number,
            favs: Number
        }
    });

创建 Schema 后，可以用 Schema.add() 方法添加附加字段

    var ToySchema = new Schema;
    ToySchema.add({ name: 'string', color: 'string', price: 'number' })

模式的参数对象里的所有字段都会在 MongoDB 中的集合里创建与模式里的字段类型相对应的字段。

所有的 SchemaType

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array

### 创建模型

通过 Schema 创建 Model。模型的实例就是文档。文档有许多内置的方法。

    var Blog = mongoose.model('blog', blogSchema);

    var blog = new Blog({ author: 'jack' });
    blog.save(function(err, doc) {
        console.log(doc);
    });

### 添加实例方法

    var animalSchema = new Schema({ name: String, type: String });

    animalSchema.methods.findSimilarTypes = function(cb) {
        return this.model('Animal').find({ type: this.type }, cb);
    };

所有的 animal 实例都有 findSimilarTypes 这个方法了。

    var Animal = mongoose.model('Animal', animalSchema);
    var dog = new Animal({ type: 'dog' });

    dog.findSimilarType(function(err, dogs) {
        console.log(dogs);
    });

### 添加静态方法

Model 上的方法就是静态方法。

    animalSchema.staics.findByName = function(name, cb) {
        return this.find({ name: new RegExp(name, 'i') }, cb);
    };

    var Animal = mongoose.model('Animal', animalSchema);
    Animal.findByName('foo', function(err, animals) {
        console.log(animals);
    });

### 添加查询助手

查询助手可以扩展 mongoose 的链式查询调用。

    animalSchema.query.byName = function(name) {
        return this.find({ name: new RegExp(name, 'i') });
    };

    var Animal = mongoose.model('Animal', animalSchema);
    Animal.find().byName('foo').exec(function(err, animal) {
        console.log(animals);
    });

### 索引

可以在 field level，schema level，model level 创建索引。

    var animalSchema = new Schema({
        name: String,
        type: String,
        tags: { type: [String], index: true } // field level
    });

    animalSchema.index({ name: 1, type: -1 }) // schema level

    var clockSchema = new Schema({...}, { autoIndex: false });
    var Clock = mongoose.model('Clock', clockSchema);
    Clock.ensureIndex(callback); // model level

应用启动时，mongoose 会自动为在 Schema 里的的每一个 index 依次调用 createIndex。

> 这会造型性能问题，生产环境最好关闭。然后在 model level 创建索引。

    mongoose.connect('mongodb://user:pass@localhost:port/database', { config: { autoIndex: false } });
    <!-- or -->
    mongoose.createConnection('mongodb://user:pass@localhost:port/database', { config: { autoIndex: false } });
    <!-- or -->
    animalSchema.set('autoIndex', false);
    <!-- or -->
    new Schema({..}, { autoIndex: false });

index 创建结束或报错时，mongoose 会触发 index 事件。

    <!-- Will cause an error because mongodb has an _id index by default that -->
    <!-- is not sparse -->
    animalSchema.index({ _id: 1 }, { sparse: true });
    var Animal = mongoose.model('Animal', animalSchema);

    Animal.on('index', function(error) {
        <!-- "_id index cannot be sparse" -->
        console.log(error.message);
    });

### 虚拟属性

虚拟属性不会存进数据库，但可以获取和设置模式定义的字段。

> mongoose 对文档调用 toJson()、 toObject()、JSON.toStringify()，默认不会包含 virtuals。需要给这些方法传递 { virtuals: true }。

    <!-- define a schema -->
    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        }
    });

    <!-- compile our model -->
    var Person = mongoose.model('Person', personSchema);

    <!-- create a document -->
    var axl = new Person({
        name: { first: 'Axl', last: 'Rose' }
    });

    <!-- define a get & a set  -->
    personSchema.virtual('fullName').
    get(function () { return this.name.first + ' ' + this.name.last; }).
    set(function(v) {
        this.name.first = v.substr(0, v.indexOf(' '));
        this.name.last = v.substr(v.indexOf(' ') + 1);
    });

    axl.fullName // Axl Rose
    axl.fullName = 'William Rose'; // Now `axl.name.first` is "William"

### 别名

别名是一种特殊的 virtual property。别名同时设置和获取关联的另外一个属性。

    var personSchema = new Schema({
    n: {
        type: String,
        <!-- Now accessing `name` will get you the value of `n`, and setting `n` will set the value of `name` -->
        alias: 'name'
    }
    });

    <!-- Setting `name` will propagate to `n` -->
    var person = new Person({ name: 'Val' });
    console.log(person); // { n: 'Val' }
    console.log(person.toObject({ virtuals: true })); // { n: 'Val', name: 'Val' }
    console.log(person.name); // "Val"

    person.name = 'Not Val';
    console.log(person); // { n: 'Not Val' }

### 配置

Schema 有几个参数可以设置。可以通过构造函数初始化，也可以调用 set 函数。

    new Schema({..}, options);

    <!-- or -->
    var schema = new Schema({..});
    schema.set(option, value);

可用的参数：

#### autoIndex

应用启动时，mongoose 会自动为定义在 schema 中的索引调用 ensureIndex。会造成性能问题。

生产环境应手动调用 ensureIndex。

    var schema = new Schema({..}, { autoIndex: false });
    var Clock = mongoose.model('Clock', schema);
    Clock.ensureIndexes(callback);

#### bufferConmmands

By default, mongoose buffers commands when the connection goes down until the driver manages to reconnect. To disable buffering, set bufferCommands to false.

    var schema = new Schema({..}, { bufferCommands: false });

#### capped

mongoose 支持 MongoDB 中的 capped 集合。

    <!-- 单位 bytes -->
    new Schema({..}, { capped: 1024 });

capped 还有些附加参数。

    new Schema({..}, { capped: { size: 1024, max: 1000, autoIndexId: true } });

#### collection

自定义集合名字。mongoose 的集合名字默认使用 mongoose.model() 第一个参数的复数。

    var dataSchema = new Schema({..}, { collection: 'data' });

#### emitIndexErrors

帮助处理创建索引时报的错误。

#### id

mongoose 默认为模式分配一个返回 _id 的虚拟 id getter。可关闭。

    // default behavior
    var schema = new Schema({ name: String });
    var Page = mongoose.model('Page', schema);
    var p = new Page({ name: 'mongodb.org' });
    console.log(p.id); // '50341373e894ad16347efe01'

    // disabled id
    var schema = new Schema({ name: String }, { id: false });
    var Page = mongoose.model('Page', schema);
    var p = new Page({ name: 'mongodb.org' });
    console.log(p.id); // undefined

#### _id

关闭后，不为文档分配 _id 字段。只能在在内嵌文档使用。

    // default behavior
    var schema = new Schema({ name: String });
    var Page = mongoose.model('Page', schema);
    var p = new Page({ name: 'mongodb.org' });
    console.log(p); // { _id: '50341373e894ad16347efe01', name: 'mongodb.org' }

    // disabled _id
    var childSchema = new Schema({ name: String }, { _id: false });
    var parentSchema = new Schema({ children: [childSchema] });

    var Model = mongoose.model('Model', parentSchema);

    Model.create({ children: [{ name: 'Luke' }] }, function(error, doc) {
    // doc.children[0]._id will be undefined
    });

#### minimize

Mongoose will, by default, "minimize" schemas by removing empty objects.

    var schema = new Schema({ name: String, inventory: {} });
    var Character = mongoose.model('Character', schema);

    // will store `inventory` field if it is not empty
    var frodo = new Character({ name: 'Frodo', inventory: { ringOfPower: 1 }});
    Character.findOne({ name: 'Frodo' }, function(err, character) {
        console.log(character); // { name: 'Frodo', inventory: { ringOfPower: 1 }}
    });

    // will not store `inventory` field if it is empty
    var sam = new Character({ name: 'Sam', inventory: {}});
    Character.findOne({ name: 'Sam' }, function(err, character) {
        console.log(character); // { name: 'Sam' }
    });

This behavior can be overridden by setting minimize option to false. It will then store empty objects.

    var schema = new Schema({ name: String, inventory: {} }, { minimize: false });
    var Character = mongoose.model('Character', schema);

    // will store `inventory` if empty
    var sam = new Character({ name: 'Sam', inventory: {}});
    Character.findOne({ name: 'Sam' }, function(err, character) {
        console.log(character); // { name: 'Sam', inventory: {}}
    });

#### read

副本集

#### safe
#### shardKey

分片

#### strict

默认开启，防止未定义在 schema 中的字段存进数据库。

> The strict option may also be set to "throw" which will cause errors to be produced instead of dropping the bad data.

    var thingSchema = new Schema({..})
    var Thing = mongoose.model('Thing', thingSchema);
    var thing = new Thing({ iAmNotInTheSchema: true });
    thing.save(); // iAmNotInTheSchema is not saved to the db

    // set to false..
    var thingSchema = new Schema({..}, { strict: false });
    var thing = new Thing({ iAmNotInTheSchema: true });
    thing.save(); // iAmNotInTheSchema is now saved to the db!!

可以在 model level 传递第二个参数改变。

    var Thing = mongoose.model('Thing');
    var thing = new Thing(doc, true);  // enables strict mode
    var thing = new Thing(doc, false); // disables strict mode

#### useNestedStrict

In mongoose 4, update() and findOneAndUpdate() only check the top-level schema's strict mode setting.

    var childSchema = new Schema({}, { strict: false });
    var parentSchema = new Schema({ child: childSchema }, { strict: 'throw' });
    var Parent = mongoose.model('Parent', parentSchema);
    Parent.update({}, { 'child.name': 'Luke Skywalker' }, function(error) {
        // Error because parentSchema has `strict: throw`, even though
        // `childSchema` has `strict: false`
    });

    var update = { 'child.name': 'Luke Skywalker' };
    var opts = { strict: false };
    Parent.update({}, update, opts, function(error) {
        // This works because passing `strict: false` to `update()` overwrites
        // the parent schema.
    });

If you set useNestedStrict to true, mongoose will use the child schema's strict option for casting updates.

    var childSchema = new Schema({}, { strict: false });
    var parentSchema = new Schema({ child: childSchema },
        { strict: 'throw', useNestedStrict: true });
    var Parent = mongoose.model('Parent', parentSchema);
    Parent.update({}, { 'child.name': 'Luke Skywalker' }, function(error) {
        // Works!
    });

#### toJSON

同 toObject 差不多，但只在 toJSON 方法上起作用。

    var schema = new Schema({ name: String });
    schema.path('name').get(function (v) {
        return v + ' is my name';
    });
    schema.set('toJSON', { getters: true, virtuals: false });
    var M = mongoose.model('Person', schema);
    var m = new M({ name: 'Max Headroom' });
    console.log(m.toObject()); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom' }
    console.log(m.toJSON()); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom is my name' }
    // since we know toJSON is called whenever a js object is stringified:
    console.log(JSON.stringify(m)); // { "_id": "504e0cd7dd992d9be2f20b6f", "name": "Max Headroom is my name" }

#### toObject

文档的方法。把 mongoose 文档转成普通的 javascript 对象。

> To have all virtuals show up in your console.log output, set the toObject option to { getters: true }.

    var schema = new Schema({ name: String });
    schema.path('name').get(function (v) {
        return v + ' is my name';
    });
    schema.set('toObject', { getters: true });
    var M = mongoose.model('Person', schema);
    var m = new M({ name: 'Max Headroom' });
    console.log(m); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom is my name' }

#### typeKey

By default, if you have an object with key 'type' in your schema, mongoose will interpret it as a type declaration.

    // Mongoose interprets this as 'loc is a String'
    var schema = new Schema({ loc: { type: String, coordinates: [Number] } });

However, for applications like geoJSON, the 'type' property is important. If you want to control which key mongoose uses to find type declarations, set the 'typeKey' schema option.

    var schema = new Schema({
    // Mongoose interpets this as 'loc is an object with 2 keys, type and coordinates'
    loc: { type: String, coordinates: [Number] },
    // Mongoose interprets this as 'name is a String'
    name: { $type: String }
    }, { typeKey: '$type' }); // A '$type' key means this object is a type declaration

#### validateBeforeSave

mongoose 默认不会把未通过验证的字段存入数据库，设置 validateBeforeSave 为 false 就可以。

    var schema = new Schema({ name: String });
    schema.set('validateBeforeSave', false);
    schema.path('name').validate(function (value) {
        return v != null;
    });
    var M = mongoose.model('Person', schema);
    var m = new M({ name: null });
    m.validate(function(err) {
        console.log(err); // Will tell you that null is not allowed.
    });
    m.save(); // Succeeds despite being invalid

#### versionKey

mongoose 默认为每个文档添加 __v 字段。用下面的方式解决冲突。

> Document versioning can also be disabled by setting the versionKey to false. DO NOT disable versioning unless you know what you are doing.

    var schema = new Schema({ name: 'string' });
    var Thing = mongoose.model('Thing', schema);
    var thing = new Thing({ name: 'mongoose v3' });
    thing.save(); // { __v: 0, name: 'mongoose v3' }

    // customized versionKey
    new Schema({..}, { versionKey: '_somethingElse' })
    var Thing = mongoose.model('Thing', schema);
    var thing = new Thing({ name: 'mongoose v3' });
    thing.save(); // { _somethingElse: 0, name: 'mongoose v3' }

#### skipVersioning

指定某个字段的 __0 不更新。

> DO NOT do this unless you know what you're doing.

    new Schema({..}, { skipVersioning: { dontVersionMe: true } });
    thing.dontVersionMe.push('hey');
    thing.save(); // version is not incremented

#### timestamps

If set timestamps, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.

By default, the name of two fields are createdAt and updatedAt, customize the field name by setting timestamps.createdAt and timestamps.updatedAt.

    var thingSchema = new Schema({..}, { timestamps: { createdAt: 'created_at' } });
    var Thing = mongoose.model('Thing', thingSchema);
    var thing = new Thing();
    thing.save(); // `created_at` & `updatedAt` will be included

#### retainKeyOrder

mongoose 默认反转即将存入数据库的文档的字段来作某种优化。但会造成意外的副作用。所以考虑废除这种优化。

    var model = new Model({ first: 1, second: 2 }); 
    model.save()
    <!-- would actually be stored -->
    { second: 2, first: 1 }

Mongoose >= 4.6.4 has a retainKeyOrder option for schemas that ensures that mongoose will always keep the correct order for your object keys.

    var testSchema = new Schema({ first: Number, second: Number }, { retainKeyOrder: true });
    var Test = mongoose.model('Test', testSchema);
    Test.create({ first: 1, second: 2 }); // Will be stored in mongodb as `{ first: 1, second: 2 }`