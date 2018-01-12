## Plugins

Schema 是可以添加插件的。Schema 可以应用预包装的功能来扩展它的功能。

假如数据库中有几个集合，我们要给它们添加 last-modified 功能。

    // lastMod.js
    module.exports = exports = function lastModifiedPlugin(schema, options) {
        schema.add({ lastMod: Date })
        
        schema.pre('save', function (next) {
            this.lastMod = new Date
            next()
        })
        
        if (options && options.index) {
            schema.path('lastMod').index(options.index)
        }
    }


    // game-schema.js
    var lastMod = require('./lastMod');
    var Game = new Schema({ ... });
    Game.plugin(lastMod, { index: true });

    // player-schema.js
    var lastMod = require('./lastMod');
    var Player = new Schema({ ... });
    Player.plugin(lastMod);

## Global Plugins

mongoose.plugin() 能注册全局 plugin。在每一个 Schema 上生效。

    var mongoose = require('mongoose');
    mongoose.plugin(require('./lastMod'));

    var gameSchema = new Schema({ ... )};
    var playerSchema = new Schema({ ... });

    <!-- lastModifiedPlugin 已经应用到上面两个 Schema 上了  -->
    var Game = mongoose.model('Game', gameSchema);
    var Player = mongoose.model('Player', playerSchema);