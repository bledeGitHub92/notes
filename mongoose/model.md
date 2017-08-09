## Models

模型由定义好的模式创建。模型的实例是文档。文档的创建和检索都由模型操作。

Compiling your first model.

    var schema = new mongoose.Schema({ name: 'string', size: 'string' });
    var Tank = mongoose.model('Tank', schema);

第一个参数是集合名称的单数。确保模式中添加完所有的字段，再调用 .model()。

## 构造文档

文档是模型的实例。创建和保存文档很容易。

    var Tank = mongoose.model('Tank', yourSchema);

    var small = new Tank({ size: 'small' });
    small.save(function (err) {
        if (err) return handleError(err);
        // saved!
    })

    // or

    Tank.create({ size: 'small' }, function (err, small) {
        if (err) return handleError(err);
        // saved!
    })

模型的连接没打开之前，不会创建/删除 tanks。每个模型都有一个对应的连接。当使用 mongoose.model()，模型将使用默认的 mongoose 连接。

    mongoose.connect('localhost', 'gettingstarted');

如果创建了一个条自定义的连接，用那条连接的 model() 代替。

    var connection = mongoose.createConnection('mongodb://localhost:27017/test');
    var Tank = connection.model('Tank', yourSchema);

## 查询

用 mongoose 查询文档很容易。

Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);

## 删除

Models have a static remove method available for removing all documents matching conditions.

    Tank.remove({ size: 'large' }, function (err) {
        if (err) return handleError(err);
        // removed!
    });

## 更新

Each model has its own update method for modifying documents in the database without returning them to your application. See the API docs for more detail.

If you want to update a single document in the db and return it to your application, use findOneAndUpdate instead.