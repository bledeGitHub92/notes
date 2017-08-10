## 查询

任何指定了查询条件的模型的方法都可以通过两种方式调用。

- 传入了 callback：操作立即执行，callback 的第二个参数就是查询结果。
- 没有传入 callback：返回一个提供特殊查询生成器接口的 Query 的实例。

执行一个带 callback 的 query，指定一个语法同 MongoDB Shell 一样的 JSON 文档作查询条件。

- mongoose 中的所有 callback 的模式都是 callback(error, result)。  
- 查询出错，error 包含错误文档，result 为 null。  
- 查询成功，error 为 null，result 包含查询结果。

        var Person = mongoose.model('Person', yourSchema);

        // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
        Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
            if (err) return handleError(err);
            console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
        })

不传入 callback 会返回一个 Query 的实例。

    // find each person with a last name matching 'Ghost'
    var query = Person.findOne({ 'name.last': 'Ghost' });

    // selecting the `name` and `occupation` fields
    query.select('name occupation');

    // execute the query at a later time
    query.exec(function (err, person) {
        if (err) return handleError(err);
        console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
    })

一个 Query 能建立一个链式查询，而不是指定一个 JSON 文档。下两个例子是等价的：

> [Query helper API](http://mongoosejs.com/docs/api.html#query-js)

    // With a JSON doc
    Person.
    find({
        occupation: /host/,
        'name.last': 'Ghost',
        age: { $gt: 17, $lt: 66 },
        likes: { $in: ['vaporizing', 'talking'] }
    }).
    limit(10).
    sort({ occupation: -1 }).
    select({ name: 1, occupation: 1 }).
    exec(callback);
    
    // Using query builder
    Person.
        find({ occupation: /host/ }).
        where('name.last').equals('Ghost').
        where('age').gt(17).lt(66).
        where('likes').in(['vaporizing', 'talking']).
        limit(10).
        sort('-occupation').
        select('name occupation').
        exec(callback);

mongoose 4.x. Setters 默认不会执行，if you lowercase emails in your schema:

    var personSchema = new Schema({
        email: {
            type: String,
            lowercase: true
        }
    });

mongoose 不会在 queries 不会自动小写 email。所以 _Person.find({ email: 'Val@karpov.io' })_ 不会返回任何结果。使用 runSettersOnQuery 选项开启这项行为：

    var personSchema = new Schema({
        email: {
            type: String,
            lowercase: true
        }
    }, { runSettersOnQuery: true });

## 引用其他集合中的文档

[population](http://mongoosejs.com/docs/populate.html)可以引用其他集合的文档。

## 流

你可以以流的形式从数据库查询结果。需要使用 cursor() 代替 exec()。

    var cursor = Person.find({ occupation: /host/ }).cursor();
    cursor.on('data', function(doc) {
        // Called once for every document
    });
    cursor.on('close', function() {
        // Called when done
    });