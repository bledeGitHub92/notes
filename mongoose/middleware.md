## 中间件

中间件也叫前、后钩子。是一个在执行异步函数期间起控制作用的函数。mongoose 4.x 有三种中间件：

### document middleware

document middleware 支持下列 doucment method。在 document middleware function 中，this 指向 document。

- init
- validate
- save
- remove

### query middleware

query middleware 支持下列 query and model method。在 query middleware function 中，this 指向 query。

- count
- find
- findOne
- findOneAndRemove
- findOneAndUpdate
- update

### model middleware

model middleware 支持下列 model function，在 model middleware function 中，this 指向 model。

- insertMany

> 所有的中间件类型都支持 pre & post hooks。

**Note**: There is no query hook for remove(), only for documents. If you set a 'remove' hook, it will be fired when you call myDoc.remove(), not when you call MyModel.remove(). 

**Note**: The create() function fires save() hooks.

## Pre middleware

有两种类型的 pre hooks，serial and parallel。

### serial

serial 中间件挨个执行，当每个中间件调用 next（） 。

    var schema = new Schema(..);
    schema.pre('save', function(next) {
        // do stuff
        next();
    });

### parallel

parallel middleware 提供更细粒流程控制。

> The hooked method, in this case save, will not be executed until done is called by each middleware.

    var schema = new Schema(..);

    // `true` means this is a parallel middleware. You **must** specify `true`
    // as the second parameter if you want to use parallel middleware.
    schema.pre('save', true, function(next, done) {
        // calling next kicks off the next middleware in parallel
        next();
        setTimeout(done, 100);
    });

## 用例

### 错误处理

如果在任何中间件中的 next 函数中传入一个 Error 对象，the flow is interrupted。错误对象作为数据库操作的回调函数的第一个参数返回。

    schema.pre('save', function(next) {
        // You **must** do `new Error()`. `next('something went wrong')` will
        // **not** work
        var err = new Error('something went wrong');
        next(err);
    });

    // later...

    myDoc.save(function(err) {
        console.log(err.message) // something went wrong
    });

## Post middleware

post middleware 在所有的钩子函数和所有 pre middleware 执行完毕之后执行。

    schema.post('init', function(doc) {
        console.log('%s has been initialized from the db', doc._id);
    });
    schema.post('validate', function(doc) {
        console.log('%s has been validated (but not saved yet)', doc._id);
    });
    schema.post('save', function(doc) {
        console.log('%s has been saved', doc._id);
    });
    schema.post('remove', function(doc) {
        console.log('%s has been removed', doc._id);
    });

### 异步 Post middleware

虽然 post middleware 接收流程控制，你仍然可以确保 post hooks 按预定义的顺序执行。在 post hook function 中传入第二个参数（next）。

    // Takes 2 parameters: this is an asynchronous post hook
    schema.post('save', function(doc, next) {
        setTimeout(function() {
            console.log('post1');
            // Kick off the second post hook
            next();
        }, 10);
    });

    // Will not execute until the first middleware calls `next()`
    schema.post('save', function(doc, next) {
        console.log('post2');
        next();
    });

### Save/Validate Hooks

The save() function triggers validate() hooks, because mongoose has a built-in pre('save') hook that calls validate(). This means that all pre('validate') and post('validate') hooks get called before any pre('save') hooks.

    schema.pre('validate', function() {
        console.log('this gets printed first');
    });
    schema.post('validate', function() {
        console.log('this gets printed second');
    });
    schema.pre('save', function() {
        console.log('this gets printed third');
    });
    schema.post('save', function() {
        console.log('this gets printed fourth');
    });

### Notes on findAndUpdate() and Query Middleware

Pre and post save() hooks are not executed on update(), findOneAndUpdate(), etc. You can see a more detailed discussion why in this GitHub issue. Mongoose 4.0 has distinct hooks for these functions.

    schema.pre('find', function() {
        console.log(this instanceof mongoose.Query); // true
        this.start = Date.now();
    });

    schema.post('find', function(result) {
        console.log(this instanceof mongoose.Query); // true
    // prints returned documents
        console.log('find() returned ' + JSON.stringify(result));
    // prints number of milliseconds the query took
        console.log('find() took ' + (Date.now() - this.start) + ' millis');
    });

Query middleware differs from document middleware in a subtle but important way: in document middleware, this refers to the document being updated. In query middleware, mongoose doesn't necessarily have a reference to the document being updated, so this refers to the query object rather than the document being updated.

For instance, if you wanted to add an updatedAt timestamp to every update() call, you would use the following pre hook.

    schema.pre('update', function() {
        this.update({}, { $set: { updatedAt: new Date() } });
    });

## 错误处理中间件

中间件调用传入错误对象的 next 函数时中止。有一种特殊的 post middleware 叫错误处理中间件当报错时执行。

错误处理中间件通过传入额外的参数定义，第一个参数为 error。

    var schema = new Schema({
        name: {
            type: String,
            // Will trigger a MongoError with code 11000 when
            // you save a duplicate
            unique: true
        }
    });

    // Handler **must** take 3 parameters: the error that occurred, the document
    // in question, and the `next()` function
    schema.post('save', function(error, doc, next) {
        if (error.name === 'MongoError' && error.code === 11000) {
            next(new Error('There was a duplicate key error'));
        } else {
            next(error);
        }
    });

    // Will trigger the `post('save')` error handler
    Person.create([{ name: 'Axl Rose' }, { name: 'Axl Rose' }]);

Error handling middleware also works with query middleware. You can also define a post update() hook that will catch MongoDB duplicate key errors.

    // The same E11000 error can occur when you call `update()`
    // This function **must** take 3 parameters. If you use the
    // `passRawResult` function, this function **must** take 4
    // parameters
    schema.post('update', function(error, res, next) {
        if (error.name === 'MongoError' && error.code === 11000) {
            next(new Error('There was a duplicate key error'));
        } else {
            next(error);
        }
    });

    var people = [{ name: 'Axl Rose' }, { name: 'Slash' }];
    Person.create(people, function(error) {
        Person.update({ name: 'Slash' }, { $set: { name: 'Axl Rose' } }, function(error) {
            // `error.message` will be "There was a duplicate key error"
        });
    });