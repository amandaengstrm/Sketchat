const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()


//Bring in modules
let Users = require('../../models/users');

//So it doesnt fuck up when we transfer :D
function allowCORS(res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	return res;
}

router.get('/users', function(req,res){
    res = allowCORS(res);
    Users.find({}, function(err, users){
        if(err){
            console.log(err);
        }else{
            res.send(users);
        }
    });
});

module.exports = router