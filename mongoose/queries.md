## 查询

任何指定了查询条件的模型的方法都可以通过两种方式调用。

- 传入了 callback：操作立即执行，callback 的第二个参数就是查询结果。
- 没有传入 callback：返回一个提供特殊查询生成器接口的 Query 的实例。

执行一个带 callback 的 query，指定一个语法同 MongoDB Shell 一样 JSON 文档作查询条件。

    var Person = mongoose.model('Person', yourSchema);

    // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
        if (err) return handleError(err);
        console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
    })

