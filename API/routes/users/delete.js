const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));


//Bring in modules
let Users = require('../../models/users');

//So it doesnt fuck up when we transfer :D
function allowCORS(res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res;
}

router.delete('/users/delete', function (req, res) {
    res = allowCORS(res);
    
    let query = {nickname: req.body.nickname}

    Users.deleteOne(query,function(err){
        if(err){
            console.log(err);
        }
        res.send("Successfully deleted")
    });
});

module.exports = router