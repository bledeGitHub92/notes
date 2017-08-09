## 文档

Mongoose documents represent a one-to-one mapping to documents as stored in MongoDB. Each document is an instance of its Model.

## 更新

There are a number of ways to update documents. We'll first look at a traditional approach using findById.

    Tank.findById(id, function (err, tank) {
        if (err) return handleError(err);
        
        tank.size = 'large';
        tank.save(function (err, updatedTank) {
            if (err) return handleError(err);
            res.send(updatedTank);
        });
    });

This approach involves first retrieving the document from Mongo, then issuing an update command (triggered by calling save). However, if we don't need the document returned in our application and merely want to update a property in the database directly, Model#update is right for us.

    Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);

If we do need the document returned in our application there is another, often better, option.

    Tank.findByIdAndUpdate(id, { $set: { size: 'large' }}, { new: true }, function (err, tank) {
        if (err) return handleError(err);
        res.send(tank);
    });

The findAndUpdate/Remove static methods all make a change to at most one document, and return it with just one call to the database. There are several variations on the findAndModify theme. Read the API docs for more detail.

## 内嵌文档

内嵌文档是植入其他文档的文档。在 mongoose，可以内嵌一个模式到另外一个模式。mongoose 里的内嵌文档有两个独特的概念。内嵌文档数组和单独的内嵌文档。

    var childSchema = new Schema({ name: 'string' });

    var parentSchema = new Schema({
        // Array of subdocuments
        children: [childSchema],
        // Single nested subdocuments. Caveat: single nested subdocs only work
        // in mongoose >= 4.2.0
        child: childSchema
    });

内嵌文档和普通文档很像。内嵌文档拥有顶级文档的所有特性。主要的不同是，内嵌文档不会单独保存。内嵌文档是随着顶级文档一起保存。

    var Parent = mongoose.model('Parent', parentSchema);
    var parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] })
    parent.children[0].name = 'Matthew';

    // `parent.children[0].save()` is a no-op, it triggers middleware but
    // does **not** actually save the subdocument. You need to save the parent
    // doc.
    parent.save(callback);

内嵌文档拥有和顶级文档一样的 save 和 validate 中间件。顶级文档调用 save() 会触发内嵌文档的 save 和 validate 中间件。

    childSchema.pre('save', function (next) {
        if ('invalid' == this.name) {
            return next(new Error('#sadpanda'));
        }
        next();
    });

    var parent = new Parent({ children: [{ name: 'invalid' }] });
    parent.save(function (err) {
        console.log(err.message) // #sadpanda
    });

Subdocuments' pre('save') and pre('validate') middleware execute before the top-level document's pre('save') but after the top-level document's pre('validate') middleware. This is because validating before save() is actually a piece of built-in middleware.

    // Below code will print out 1-4 in order
    var childSchema = new mongoose.Schema({ name: 'string' });

    childSchema.pre('validate', function(next) {
        console.log('2');
        next();
    });

    childSchema.pre('save', function(next) {
        console.log('3');
        next();
    });

    var parentSchema = new mongoose.Schema({
        child: childSchema,
    });
        
    parentSchema.pre('validate', function(next) {
        console.log('1');
        next();
    });

    parentSchema.pre('save', function(next) {
        console.log('4');
        next();
    });

## 查询内嵌文档

Each subdocument has an _id by default. Mongoose document arrays have a special id method for searching a document array to find a document with a given _id.

    var doc = parent.children.id(_id);

## 向数组内嵌文档添加文档

MongooseArray methods such as push, unshift, addToSet, and others cast arguments to their proper types transparently.

    var Parent = mongoose.model('Parent');
    var parent = new Parent;

    // create a comment
    parent.children.push({ name: 'Liesl' });
    var subdoc = parent.children[0];
    console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
    subdoc.isNew; // true

    parent.save(function (err) {
        if (err) return handleError(err)
        console.log('Success!');
    });

Sub-docs may also be created without adding them to the array by using the create method of MongooseArrays.

    var newdoc = parent.children.create({ name: 'Aaron' });

## 删除内嵌文档

Each subdocument has it's own remove method. For an array subdocument, this is equivalent to calling .pull() on the subdocument. For a single nested subdocument, remove() is equivalent to setting the subdocument to null.

    // Equivalent to `parent.children.pull(_id)`
    parent.children.id(_id).remove();
    // Equivalent to `parent.child = null`
    parent.child.remove();
    parent.save(function (err) {
        if (err) return handleError(err);
        console.log('the subdocs were removed');
    });

### 替换声明数组的语法

If you create a schema with an array of objects, mongoose will automatically convert the object to a schema for you:

    var parentSchema = new Schema({
        children: [{ name: 'string' }]
    });
    // Equivalent
    var parentSchema = new Schema({
        children: [new Schema({ name: 'string' })]
    });