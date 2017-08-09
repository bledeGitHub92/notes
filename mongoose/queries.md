## 查询

任何指定了查询条件的模型的方法都可以通过两种方式调用。

- 传入了 callback：操作立即执行，callback 的第二个参数就是查询结果。
- 没有传入 callback：返回一个提供特殊查询生成器接口的 Query 的实例。

执行一个带 callback 的 query，指定一个语法同 MongoDB Shell 一样 JSON 文档作查询条件。

- mongoose 中的所有 callback 的模式都是 callback(error, result)。  
- 查询出错，error 包含错误文档，result 为 null。  
- 查询成功，error 为 null，result 包含查询结果。

        var Person = mongoose.model('Person', yourSchema);

        // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
        Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
            if (err) return handleError(err);
            console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
        })

我们来看看不传入 callback 会发生什么。

    // find each person with a last name matching 'Ghost'
    var query = Person.findOne({ 'name.last': 'Ghost' });

    // selecting the `name` and `occupation` fields
    query.select('name occupation');

    // execute the query at a later time
    query.exec(function (err, person) {
        if (err) return handleError(err);
        console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
    })