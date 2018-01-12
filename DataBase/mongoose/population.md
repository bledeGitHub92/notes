## population

mongoose 提供 populate 让你可以引用其他集合的文档。我们可以从一次 query 中填充单个文档，多个文档，简单对象，多个简单对象，所有对象。

> **Note**: ObjectId, Number, String, and Buffer are valid for use as refs.

    var mongoose = require('mongoose')
    , Schema = mongoose.Schema

    var personSchema = Schema({
        _id     : Number,
        name    : String,
        age     : Number,
        stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
    });

    var storySchema = Schema({
        _creator : { type: Number, ref: 'Person' },
        title    : String,
        fans     : [{ type: Number, ref: 'Person' }]
    });

    var Story  = mongoose.model('Story', storySchema);
    var Person = mongoose.model('Person', personSchema);

So far we've created two Models. Our Person model has its stories field set to an array of ObjectIds. The ref option is what tells Mongoose which model to use during population, in our case the Story model. All _ids we store here must be document _ids from the Story model. We also declared the Story _creator property as a Number, the same type as the _id used in the personSchema. It is important to match the type of _id to the type of ref.

## Saving refs

Saving refs to other documents works the same way you normally save properties, just assign the _id value:

    var aaron = new Person({ _id: 0, name: 'Aaron', age: 100 });

    aaron.save(function (err) {
        if (err) return handleError(err);

        var story1 = new Story({
            title: "Once upon a timex.",
            _creator: aaron._id    // assign the _id from the person
        });

        story1.save(function (err) {
            if (err) return handleError(err);
            // thats it!
        });
    });

## Population

So far we haven't done anything much different. We've merely created a Person and a Story. Now let's take a look at populating our story's _creator using the query builder:

> Note: mongoose >= 3.6 exposes the original _ids used during population through the document#populated() method.

    Story.
        findOne({ title: 'Once upon a timex.' }).
        populate('_creator').
        exec(function (err, story) {
            if (err) return handleError(err);
            console.log('The creator is %s', story._creator.name);
            // prints "The creator is Aaron"
        });

Populated paths are no longer set to their original _id , their value is replaced with the mongoose document returned from the database by performing a separate query before returning the results.

Arrays of refs work the same way. Just call the populate method on the query and an array of documents will be returned in place of the original _ids.

## Setting Populated Fields

In Mongoose >= 4.0, you can manually populate a field as well.

> Note that this only works for single refs. You currently can't manually populate an array of refs.

    Story.findOne({ title: 'Once upon a timex.' }, function(error, story) {
        if (error) return handleError(error);
        story._creator = aaron;
        console.log(story._creator.name); // prints "Aaron"
    });

## Field selection

如果我们只想填充部分字段怎么办？可以通过传入第二个参数完成。

    Story.
        findOne({ title: /timex/i }).
        populate('_creator', 'name'). // only return the Persons name
        exec(function (err, story) {
            if (err) return handleError(err);
            
            console.log('The creator is %s', story._creator.name);
            // prints "The creator is Aaron"
            
            console.log('The creators age is %s', story._creator.age);
            // prints "The creators age is null'
        })

## Populating multiple paths

如果我们向同时填充多个字段怎么办？

    Story.
        find(...).
        populate('fans _creator'). // space delimited path names
        exec()

mongoose 3.6 之前，填充多个字段需要多次调用 populate。

    Story.
        find(...).
        populate('fans').
        populate('_creator').
        exec()

在同一个字段上多次调用 populate，只有最后一次起作用。

    // The 2nd `populate()` call below overwrites the first because they
    // both populate 'fans'.
    Story.
        find().
        populate({ path: 'fans', select: 'name' }).
        populate({ path: 'fans', select: 'email' });
    // The above is equivalent to:
    Story.find().populate({ path: 'fans', select: 'email' });

## Query conditions and other options

假如我们想基于他们的 age 字段的范围，仅保留 name 字段，最多返回 5 个元素。

    Story.
        find(...).
        populate({
            path: 'fans',
            match: { age: { $gte: 21 }},
            // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
            select: 'name -_id',
            options: { limit: 5 }
        }).
        exec()

## Refs to children

我们可能会发现，如果我用 arron 对象是无法获取一组 stroies 的。因为我们没有在 aaron.stories 数组里 push 过 story 的实例。

有两种观点，第一，让 aaron 了解哪些 story 是属性它的。

    aaron.stories.push(story1);
    aaron.save(callback);

这让我们可以执行一个 find and populate combo：

    Person.
        findOne({ name: 'Aaron' }).
        populate('stories'). // only works if we pushed refs to children
        exec(function (err, person) {
            if (err) return handleError(err);
            console.log(person);
        });

这是有争议的，因为我们真正想要的两组指针可能是不同步的。我们可以跳过 populate 直接用 find 查询我们感兴趣 stories 来代替。

    Story.
        find({ _creator: aaron._id }).
        exec(function (err, stories) {
            if (err) return handleError(err);
            console.log('The stories are an array: ', stories);
        });

## Updating refs

有一个 story 的 _creator 不正确。我们可能用 mognoose 内部方法更新 refs。

    var guille = new Person({ name: 'Guillermo' });
    guille.save(function (err) {
        if (err) return handleError(err);
        
        story._creator = guille;
        console.log(story._creator.name);
        // prints "Guillermo" in mongoose >= 3.6
        // see https://github.com/Automattic/mongoose/wiki/3.6-release-notes
        
        story.save(function (err) {
            if (err) return handleError(err);
            
            Story.
                findOne({ title: /timex/i }).
                populate({ path: '_creator', select: 'name' }).
                exec(function (err, story) {
                    if (err) return handleError(err);
                    
                    console.log('The creator is %s', story._creator.name)
                    // prints "The creator is Guillermo"
                });
        })
    })

The documents returned from query population become fully functional, removeable, saveable documents unless the lean option is specified. Do not confuse them with sub docs. Take caution when calling its remove method because you'll be removing it from the database, not just the array.

## Populating an existing document

If we have an existing mongoose document and want to populate some of its paths, mongoose >= 3.6 supports the [document#populate()](http://mongoosejs.com/docs/api.html#document_Document-populate) method.

## Populating multiple existing documents

If we have one or many mongoose documents or even plain objects (like mapReduce output), we may populate them using the [Model.populate()](http://mongoosejs.com/docs/api.html#model_Model.populate) method available in mongoose >= 3.6. This is what document#populate() and query#populate() use to populate documents.

## Populating across multiple levels

Say you have a user schema which keeps track of the user's friends.

    var userSchema = new Schema({
        name: String,
        friends: [{ type: ObjectId, ref: 'User' }]
    });

Populate lets you get a list of a user's friends, but what if you also wanted a user's friends of friends? Specify the populate option to tell mongoose to populate the friends array of all the user's friends:

    User.
        findOne({ name: 'Val' }).
        populate({
            path: 'friends',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { path: 'friends' }
        });

## Populating across Databases

Let's say you have a schema representing events, and a schema representing conversations. Each event has a corresponding conversation thread.

    var eventSchema = new Schema({
        name: String,
        // The id of the corresponding conversation
        // Notice there's no ref here!
        conversation: ObjectId
    });
    var conversationSchema = new Schema({
        numMessages: Number
    });

Also, suppose that events and conversations are stored in separate MongoDB instances.

    var db1 = mongoose.createConnection('localhost:27000/db1');
    var db2 = mongoose.createConnection('localhost:27001/db2');

    var Event = db1.model('Event', eventSchema);
    var Conversation = db2.model('Conversation', conversationSchema);

In this situation, you will not be able to populate() normally. The conversation field will always be null, because populate() doesn't know which model to use. However, you can specify the model explicitly.

    Event.
        find().
        populate({ path: 'conversation', model: Conversation }).
        exec(function(error, docs) { /* ... */ });

This is known as a "cross-database populate," because it enables you to populate across MongoDB databases and even across MongoDB instances.

## Dynamic References

Mongoose can also populate from multiple collections at the same time. Let's say you have a user schema that has an array of "connections" - a user can be connected to either other users or an organization.

    var userSchema = new Schema({
        name: String,
        connections: [{
            kind: String,
            item: { type: ObjectId, refPath: 'connections.kind' }
        }]
    });

    var organizationSchema = new Schema({ name: String, kind: String });

    var User = mongoose.model('User', userSchema);
    var Organization = mongoose.model('Organization', organizationSchema);

The refPath property above means that mongoose will look at the connections.kind path to determine which model to use for populate(). In other words, the refPath property enables you to make the ref property dynamic.

    // Say we have one organization:
    // `{ _id: ObjectId('000000000000000000000001'), name: "Guns N' Roses", kind: 'Band' }`
    // And two users:
    // {
    //   _id: ObjectId('000000000000000000000002')
    //   name: 'Axl Rose',
    //   connections: [
    //     { kind: 'User', item: ObjectId('000000000000000000000003') },
    //     { kind: 'Organization', item: ObjectId('000000000000000000000001') }
    //   ]
    // },
    // {
    //   _id: ObjectId('000000000000000000000003')
    //   name: 'Slash',
    //   connections: []
    // }
    User.
        findOne({ name: 'Axl Rose' }).
        populate('connections.item').
        exec(function(error, doc) {
            // doc.connections[0].item is a User doc
            // doc.connections[1].item is an Organization doc
        });
    
## Populate Virtuals

> New in 4.5.0

So far you've only populated based on the _id field. However, that's sometimes not the right choice. In particular, arrays that grow without bound are a MongoDB anti-pattern. Using mongoose virtuals, you can define more sophisticated relationships between documents.

    var PersonSchema = new Schema({
        name: String,
        band: String
    });

    var BandSchema = new Schema({
        name: String
    });
    BandSchema.virtual('members', {
        ref: 'Person', // The model to use
        localField: 'name', // Find people where `localField`
        foreignField: 'band', // is equal to `foreignField`
        // If `justOne` is true, 'members' will be a single doc as opposed to
        // an array. `justOne` is false by default.
        justOne: false
    });

    var Person = mongoose.model('Person', personSchema);
    var Band = mongoose.model('Band', bandSchema);

    /**
    * Suppose you have 2 bands: "Guns N' Roses" and "Motley Crue"
    * And 4 people: "Axl Rose" and "Slash" with "Guns N' Roses", and
    * "Vince Neil" and "Nikki Sixx" with "Motley Crue"
    */
    Band.find({}).populate('members').exec(function(error, bands) {
    /* `bands.members` is now an array of instances of `Person` */
    });

Keep in mind that virtuals are not included in toJSON() output by default. If you want populate virtuals to show up when using functions that rely on JSON.stringify(), like Express' res.json() function, set the virtuals: true option on your schema's toJSON options.

    // Set `virtuals: true` so `res.json()` works
    var BandSchema = new Schema({
        name: String
    }, { toJSON: { virtuals: true } });

If you're using populate projections, make sure foreignField is included in the projection.

    Band.
        find({}).
        populate({ path: 'members', select: 'name' }).
        exec(function(error, bands) {
            // Won't work, foreign field `band` is not selected in the projection
        });
    
    Band.
        find({}).
        populate({ path: 'members', select: 'name band' }).
        exec(function(error, bands) {
            // Works, foreign field `band` is selected
        });