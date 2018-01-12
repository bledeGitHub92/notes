## Schema Types

Schema Types 处理字段定义。[defaults](http://mongoosejs.com/docs/api.html#schematype_SchemaType-default),[validation](http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate),[getters](http://mongoosejs.com/docs/api.html#schematype_SchemaType-get),[setters](http://mongoosejs.com/docs/api.html#schematype_SchemaType-set),[field selection defaults](http://mongoosejs.com/docs/api.html#schematype_SchemaType-select)。

### 所有可用的 Schema Types：

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- Objectid
- Array

        var schema = new Schema({
            name:    String,
            binary:  Buffer,
            living:  Boolean,
            updated: { type: Date, default: Date.now },
            age:     { type: Number, min: 18, max: 65 },
            mixed:   Schema.Types.Mixed,
            _someId: Schema.Types.ObjectId,
            array:      [],
            ofString:   [String],
            ofNumber:   [Number],
            ofDates:    [Date],
            ofBuffer:   [Buffer],
            ofBoolean:  [Boolean],
            ofMixed:    [Schema.Types.Mixed],
            ofObjectId: [Schema.Types.ObjectId],
            ofArrays:   [[]]
            ofArrayOfNumbbers: [[Number]]
            nested: {
                stuff: { type: String, lowercase: true, trim: true }
            }
        })

        // example use

        var Thing = mongoose.model('Thing', schema);

        var m = new Thing;
        m.name = 'Statue of Liberty';
        m.age = 125;
        m.updated = new Date;
        m.binary = new Buffer(0);
        m.living = false;
        m.mixed = { any: { thing: 'i want' } };
        m.markModified('mixed');
        m._someId = new mongoose.Types.ObjectId;
        m.array.push(1);
        m.ofString.push("strings!");
        m.ofNumber.unshift(1,2,3,4);
        m.ofDates.addToSet(new Date);
        m.ofBuffer.pop();
        m.ofMixed = [1, [], 'three', { four: 5 }];
        m.nested.stuff = 'good';
        m.save(callback);

## SchemaType Options

You can declare a schema type using the type directly, or an object with a type property.

    var schema1 = new Schema({
        test: String // `test` is a path of type String
    });

    var schema2 = new Schema({
        test: { type: String } // `test` is a path of type string
    });

In addition to the type property, you can specify additional properties for a path. For example, if you want to lowercase a string before saving.

    var schema2 = new Schema({
        test: {
            type: String,
            lowercase: true // Always convert `test` to lowercase
        }
    });

### All Schema Types

The lowercase property 只对 String 有效。有些配置作用于所有 Type，有些配置作用于指定 Type。

- required: boolean or function, if true adds a required validator for this property
- default: Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default.
- select: boolean, specifies default projections for queries
- validate: function, adds a validator function for this property
- get: function, defines a custom getter for this property using Object.defineProperty().
- set: function, defines a custom setter for this property using Object.defineProperty().
- alias: string, mongoose >= 4.10.0 only. Defines a virtual with the given name that gets/sets this path.

        var numberSchema = new Schema({
            integerOnly: {
                type: Number,
                get: v => Math.round(v),
                set: v => Math.round(v),
                alias: 'i'
            }
        });

        var Number = mongoose.model('Number', numberSchema);

        var doc = new Number();
        doc.integerOnly = 2.001;
        doc.integerOnly; // 2
        doc.i; // 2
        doc.i = 3.001;
        doc.integerOnly; // 3
        doc.i; // 3

### Indexes

You can also define MongoDB indexes using schema type options.

- index: boolean, whether to define an on this property.
- unique: boolean, whether to define a unique index on this property.
- sparse: boolean, whether to define a sparse index on this property.

        var schema2 = new Schema({
            test: {
                type: String,
                index: true,
                unique: true // Unique index. If you specify `unique: true`
                // specifying `index: true` is optional if you do `unique: true`
            }
        });

### String

- lowercase: boolean, whether to always call .toLowerCase() on the value
- uppercase: boolean, whether to always call .toUpperCase() on the value
- trim: boolean, whether to always call .trim() on the value
- match: RegExp, creates a validator that checks if the value matches the given regular expression
- enum: Array, creates a validator that checks if the value is in the given array.

### Number

- min: Number, creates a validator that checks if the value is greater than or equal to the given minimum.
- max: Number, creates a validator that checks if the value is less than or equal to the given maximum.

### Date

- min: Date
- max: Date

## 用法

### Dates

内置的 Date 方法没有挂钩到 mongoose 的变化追踪逻辑上。用内置的 Date 方法，mongoose 察觉不到变化。

> 让 mongoose 察觉到用内置的 Date 方法改变了日期，需要在 doc.save() 前调用 doc.markMofified(path)。

    var Assignment = mongoose.model('Assignment', { dueDate: Date });
    Assignment.findOne(function (err, doc) {
        doc.dueDate.setMonth(3);
        doc.save(callback); // THIS DOES NOT SAVE YOUR CHANGE
        
        doc.markModified('dueDate');
        doc.save(callback); // works
    })

### Mixed

An "anything goes" SchemaType.

    var Any = new Schema({ any: {} });
    var Any = new Schema({ any: Object });
    var Any = new Schema({ any: Schema.Types.Mixed });

Since it is a schema-less type, you can change the value to anything else you like, but Mongoose loses the ability to auto detect and save those changes. To "tell" Mongoose that the value of a Mixed type has changed, call the.markModified(path) method of the document passing the path to the Mixed type you just changed.

这是无模式的类型，可以任意改变它的值。但这也让 mongoose 无法觉察到它的变化。调用 doc.markModified(path) 来告知 mongoose 它的变化。

    person.anything = { x: [3, 4, { y: "changed" }] };
    person.markModified('anything');
    person.save(); // anything will now get saved

### ObjectIds

To specify a type of ObjectId, use Schema.Types.ObjectId in your declaration.

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Car = new Schema({ driver: ObjectId });
    // or just Schema.ObjectId for backwards compatibility with v2

### Arrays

Provide creation of arrays of SchemaTypes or Sub-Documents.

    var ToySchema = new Schema({ name: String });
    var ToyBox = new Schema({
        toys: [ToySchema],
        buffers: [Buffer],
        string:  [String],
        numbers: [Number]
        // ... etc
    });

Note: specifying an empty array is equivalent toMixed. The following all create arrays ofMixed.

    var Empty1 = new Schema({ any: [] });
    var Empty2 = new Schema({ any: Array });
    var Empty3 = new Schema({ any: [Schema.Types.Mixed] });
    var Empty4 = new Schema({ any: [{}] });

Arrays implicitly have a default value of [] (empty array).

    var Toy = mongoose.model('Test', ToyBox);
    console.log((new Toy()).toys); // []

To overwrite this default, you need to set the default value to 'undefined'

    var ToyBox = new Schema({
        toys: {
            type: [ToySchema],
            default: undefined
        }
    });

If an array is marked as 'required', it must have at least one element.

    var ToyBox = new Schema({
        toys: {
            type: [ToySchema],
            required: true
        }
    });
    var Toy = mongoose.model('Toy', ToyBox);
    Toy.create({ toys: [] }, function(error) {
        console.log(error.errors['toys'].message); // Path "toys" is required.
    });

## The schema.path() Function

The schema.path() function returns the instantiated schema type for a given path.

You can use this function to inspect the schema type for a given path, including what validators it has and what the type is.

    var sampleSchema = new Schema({ name: { type: String, required: true } });
    console.log(sampleSchema.path('name'));
    // Output looks like:
    /**
    * SchemaString {
    *   enumValues: [],
    *   regExp: null,
    *   path: 'name',
    *   instance: 'String',
    *   validators: ...
    */