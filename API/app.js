const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const wordslvl1RouterGet = require("./routes/wordslvl1.js/get")

const usersRouterGet = require("./routes/users/get")
const usersRouterDelete = require("./routes/users/delete")
const usersRouterInsert = require("./routes/users/insert")


app.use(wordslvl1RouterGet);

app.use(usersRouterGet);
app.use(usersRouterDelete);
app.use(usersRouterInsert);





//connection to database
mongoose.connect('mongodb://localhost/sketchatdb', {useNewUrlParser: true});
let db = mongoose.connection;

//Check connection
db.once('open', function(){
    console.log('Connected to mongodb');
})

//check for db errors
db.on('error', function(err){
    console.log(err);
});

//listens to port
const port = process.nextTick.PORT || 4000;
app.listen(port, function(){
     console.log(`Server started on ${port}...`)
 });