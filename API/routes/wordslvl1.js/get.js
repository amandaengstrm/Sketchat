const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()


//Bring in modules
let Wordslvl1 = require('../../models/wordslvl1');

//So it doesnt fuck up when we transfer :D
function allowCORS(res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	return res;
}

router.get('/wordslvl1', function(req,res){
    res = allowCORS(res);
    Wordslvl1.find({}, function(err, wordslvl1){
        if(err){
            console.log(err);
        }else{
            res.send(wordslvl1);
        }
    });
});

router.get('/wordslvl1/random', function(req,res){
    res = allowCORS(res);

    Wordslvl1.count().exec(function (err, count) {
        var random = Math.floor(Math.random() * count)
        Wordslvl1.findOne().skip(random).exec(
            function (err, result) {
              // Tada! random user
              console.log(result) 
              res.send(result);
            })
    });
});
  /*
    var Id=Math.floor(Math.random() * 68) + 1  
    console.log(Id)
    Wordslvl1.findOne().skip(Id)(Id, function(err, wordslvl1){
    console.log(wordslvl1)
        if(err){
            //console.log(err);
        }else{
            res.send(wordslvl1);
        }
    }); */


    // var word = Wordslvl1.aggregate([{$sample: {size: 1}}]);
    // console.log(word)

module.exports = router