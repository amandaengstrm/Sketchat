let mongoose = require('mongoose');

//wordslvl1 schema
let wordslvl1Schema = mongoose.Schema({
    word:{
        type: String,
    }
});
let Wordslvl1 = module.exports = mongoose.model('Wordslvl1', wordslvl1Schema);