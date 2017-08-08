var users = [];

for (var i = 0; i < 1000000; i++) {
    users.push({
        i: i,
        username: 'user' + i,
        age: Math.floor(Math.random() * 120),
        created: new Date()
    })
}

db.users.insertMany(users);