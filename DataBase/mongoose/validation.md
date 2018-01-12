## 验证

在我们学习验证语法之前，请记住以下规则：

- validation 在 SchemaType 上定义。
- validation 是[中间件](http://mongoosejs.com/docs/middleware.html)。mognoose 默认把 validation 注册到 pre('save')。
- 可以用 doc.validate(callback) or doc.validateSync() 手动调用验证器。
- validators 不会在 undefined 上调用。required validator 是个例外。
- validation 是异步递归的。调用 Model.save()，内嵌文档同样会执行 validation。出错时，Model#save 的 callback 会捕获错误。
- 可以自定义 validation。

        var schema = new Schema({
            name: {
                type: String,
                required: true
            }
        });
        var Cat = db.model('Cat', schema);

        // This cat has no name :(
        var cat = new Cat();
        cat.save(function(error) {
            assert.equal(error.errors['name'].message,
                'Path `name` is required.');

            error = cat.validateSync();
            assert.equal(error.errors['name'].message, 'Path `name` is required.');
        });

## 内置验证器

mongoose 有几个内置验证器：

- 所有的 SchemaTypes 都有 required 验证器。
- Numbers 有 min、max 验证器。
- Strings 有 enum、match、maxlength、minlength 验证器。

        var breakfastSchema = new Schema({
            eggs: {
                type: Number,
                min: [6, 'Too few eggs'],
                max: 12
            },
            bacon: {
                type: Number,
                required: [true, 'Why no bacon?']
            },
            drink: {
                type: String,
                enum: ['Coffee', 'Tea'],
                required: function() {
                    return this.bacon > 3;
                }
            }
        });
        var Breakfast = db.model('Breakfast', breakfastSchema);

        var badBreakfast = new Breakfast({
            eggs: 2,
            bacon: 0,
            drink: 'Milk'
        });
        var error = badBreakfast.validateSync();
        assert.equal(error.errors['eggs'].message,
            'Too few eggs');
        assert.ok(!error.errors['bacon']);
        assert.equal(error.errors['drink'].message,
            '`Milk` is not a valid enum value for path `drink`.');

        badBreakfast.bacon = 5;
        badBreakfast.drink = null;

        error = badBreakfast.validateSync();
        assert.equal(error.errors['drink'].message, 'Path `drink` is required.');

        badBreakfast.bacon = null;
        error = badBreakfast.validateSync();
        assert.equal(error.errors['bacon'].message, 'Why no bacon?');

## unique 选项不是验证器

unique 选项是一个创建 MongoDB unique index 的便利助手。

    var uniqueUsernameSchema = new Schema({
        username: {
            type: String,
            unique: true
        }
    });
    var U1 = db.model('U1', uniqueUsernameSchema);
    var U2 = db.model('U2', uniqueUsernameSchema);

    var dup = [{ username: 'Val' }, { username: 'Val' }];
    U1.create(dup, function(error) {
        // Will save successfully!
    });

    // Need to wait for the index to finish building before saving,
    // otherwise unique constraints may be violated.
    U2.on('index', function(error) {
        assert.ifError(error);
        U2.create(dup, function(error) {
            // Will error, but will *not* be a mongoose validation error, but
            // a duplicate key error.
            assert.ok(error);
            assert.ok(!error.errors);
            assert.ok(error.message.indexOf('duplicate key error') !== -1);
        });
    });

## 自定义验证器

通过传入一个 validation function 声明自定义验证器。[SchemaTypes#validate() API docs](http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate)。

    var userSchema = new Schema({
        phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [true, 'User phone number required']
        }
    });

    var User = db.model('user', userSchema);
    var user = new User();
    var error;

    user.phone = '555.0123';
    error = user.validateSync();
    assert.equal(error.errors['phone'].message,
        '555.0123 is not a valid phone number!');

    user.phone = '';
    error = user.validateSync();
    assert.equal(error.errors['phone'].message,
        'User phone number required');

    user.phone = '201-555-0123';
    // Validation succeeds! Phone number is defined
    // and fits `DDD-DDD-DDDD`
    error = user.validateSync();
    assert.equal(error, null);

## 异步自定义验证器

mongoose 会自动认为带两个参数的自定义验证器是异步的，通过指定 isAsync: false 关闭这种行为。

    var userSchema = new Schema({
        phone: {
        type: String,
        validate: {
            // `isAsync` is not strictly necessary in mongoose 4.x, but relying
            // on 2 argument validators being async is deprecated. Set the
            // `isAsync` option to `true` to make deprecation warnings go away.
            isAsync: true,
            validator: function(v, cb) {
            setTimeout(function() {
                var phoneRegex = /\d{3}-\d{3}-\d{4}/;
                var msg = v + ' is not a valid phone number!';
                // First argument is a boolean, whether validator succeeded
                // 2nd argument is an optional error message override
                cb(phoneRegex.test(v), msg);
            }, 5);
            },
            // Default error message, overridden by 2nd argument to `cb()` above
            message: 'Default error message'
        },
        required: [true, 'User phone number required']
        },
        name: {
        type: String,
        // You can also make a validator async by returning a promise. If you
        // return a promise, do **not** specify the `isAsync` option.
        validate: function(v) {
            return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(false);
            }, 5);
            });
        }
        }
    });

    var User = db.model('User', userSchema);
    var user = new User();
    var error;

    user.phone = '555.0123';
    user.name = 'test';
    user.validate(function(error) {
        assert.ok(error);
        assert.equal(error.errors['phone'].message,
        '555.0123 is not a valid phone number!');
        assert.equal(error.errors['name'].message,
        'Validator failed for path `name` with value `test`');
    });

## 验证错误

验证失败会返回一个 Errors 对象。每个 ValidationError 都有 kind、path、value、message 属性。

    var toySchema = new Schema({
        color: String,
        name: String
    });

    var Toy = db.model('Toy', toySchema);

    var validator = function (value) {
        return /blue|green|white|red|orange|periwinkle/i.test(value);
    };
    Toy.schema.path('color').validate(validator,
        'Color `{VALUE}` not valid', 'Invalid color');

    var toy = new Toy({ color: 'grease'});

    toy.save(function (err) {
        // err is our ValidationError object
        // err.errors.color is a ValidatorError object
        assert.equal(err.errors.color.message, 'Color `grease` not valid');
        assert.equal(err.errors.color.kind, 'Invalid color');
        assert.equal(err.errors.color.path, 'color');
        assert.equal(err.errors.color.value, 'grease');
        assert.equal(err.name, 'ValidationError');
    });

## 内嵌文档上的 required 验证器

定义在内嵌文档顶级字段上的 required 验证器的行为有些诡异。

    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        }
    });

    assert.throws(function() {
        // This throws an error, because 'name' isn't a full fledged path
        personSchema.path('name').required(true);
    }, /Cannot.*'required'/);

    // To make a nested object required, use a single nested schema
    var nameSchema = new Schema({
        first: String,
        last: String
    });

    personSchema = new Schema({
        name: {
            type: nameSchema,
            required: true
        }
    });

    var Person = db.model('Person', personSchema);

    var person = new Person();
    var error = person.validateSync();
    assert.ok(error.errors['name']);

## 更新验证器

mongoose 支持在 update、findOneAndUpdate 上做验证。mongoose 4.x 默认关闭更新验证器。需要指定 runValidators 选项启用。

    var toySchema = new Schema({
        color: String,
        name: String
    });

    var Toy = db.model('Toys', toySchema);

    Toy.schema.path('color').validate(function (value) {
        return /blue|green|white|red|orange|periwinkle/i.test(value);
    }, 'Invalid color');

    var opts = { runValidators: true };
    Toy.update({}, { color: 'bacon' }, opts, function (err) {
        assert.equal(err.errors.color.message,
        'Invalid color');
    });

## 更新验证器和 this

文档的 validator 的 this 指向执行验证的文档。update 的 validator 的 this 可能是 undefined。

    var toySchema = new Schema({
        color: String,
        name: String
    });

    toySchema.path('color').validate(function(value) {
        // When running in `validate()` or `validateSync()`, the
        // validator can access the document using `this`.
        // Does **not** work with update validators.
        if (this.name.toLowerCase().indexOf('red') !== -1) {
            return value !== 'red';
        }
        return true;
    });

    var Toy = db.model('ActionFigure', toySchema);

    var toy = new Toy({ color: 'red', name: 'Red Power Ranger' });
    var error = toy.validateSync();
    assert.ok(error.errors['color']);

    var update = { color: 'red', name: 'Red Power Ranger' };
    var opts = { runValidators: true };

    Toy.update({}, update, opts, function(error) {
        // The update validator throws an error:
        // "TypeError: Cannot read property 'toLowerCase' of undefined",
        // because `this` is **not** the document being updated when using
        // update validators
        assert.ok(error);
    });

## context 选项

context 选项可以设置 update 验证器里的 this 指向。

    toySchema.path('color').validate(function(value) {
        // When running update validators with the `context` option set to
        // 'query', `this` refers to the query object.
        if (this.getUpdate().$set.name.toLowerCase().indexOf('red') !== -1) {
            return value === 'red';
        }
        return true;
    });

    var Toy = db.model('Figure', toySchema);

    var update = { color: 'blue', name: 'Red Power Ranger' };
    // Note the context option
    var opts = { runValidators: true, context: 'query' };

    Toy.update({}, update, opts, function(error) {
        assert.ok(error.errors['color']);
    });

## 更新验证器的 paths

update 验证器只对更新文档里指定的字段上做验证。并且 required 验证器仅在明确指定 $unset 操作符时生效。

    var kittenSchema = new Schema({
        name: { type: String, required: true },
        age: Number
    });

    var Kitten = db.model('Kitten', kittenSchema);

    var update = { color: 'blue' };
    var opts = { runValidators: true };
    Kitten.update({}, update, opts, function(err) {
        // Operation succeeds despite the fact that 'name' is not specified
    });

    var unset = { $unset: { name: 1 } };
    Kitten.update({}, unset, opts, function(err) {
        // Operation fails because 'name' is required
        assert.ok(err);
        assert.ok(err.errors['name']);
    });

## 更新验证器仅在指定的字段上执行

最后一个值得注意的细节，update 验证器仅对 $set、$unset、$push、$addToSet 操作符生效。

    var testSchema = new Schema({
        number: { type: Number, max: 0 },
    });

    var Test = db.model('Test', testSchema);

    var update = { $inc: { number: 1 } };
    var opts = { runValidators: true };
    Test.update({}, update, opts, function(error) {
        // There will never be a validation error here
    });

## $push、$addToSet

New in 4.8.0: update validators also run on $push and $addToSet.

    var testSchema = new Schema({
        numbers: [{ type: Number, max: 0 }],
        docs: [{
            name: { type: String, required: true }
        }]
    });

    var Test = db.model('TestPush', testSchema);

    var update = {
        $push: {
            numbers: 1,
            docs: { name: null }
        }
    };
    var opts = { runValidators: true };
    Test.update({}, update, opts, function(error) {
        assert.ok(error.errors['numbers']);
        assert.ok(error.errors['docs']);
    });