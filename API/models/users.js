let mongoose = require('mongoose');

//users schema
let usersSchema = mongoose.Schema({
    nickname:{
        type: String,
    },
    score:{
        type: Number
    },
    myTurn:{
        type: Boolean
    }
});
let Users = module.exports = mongoose.model('Users', usersSchema);