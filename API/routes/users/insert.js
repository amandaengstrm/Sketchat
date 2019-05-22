const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
const Joi = require('joi');
var fs = require('fs');
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

router.post('/users/insert', function (req, res) {
    res = allowCORS(res);
    const data = req.body;

    const schema = Joi.object().keys({
        nickname: Joi.string().min(2).max(20).alphanum(), 
        score: Joi.number().integer().min(0),
        myTurn: Joi.boolean()
    });

    Joi.validate(data, schema, function (err, value) {
        if (err) {
            console.log("Error in validation" + err)
            return res.status(400).json(err)
        } else {
            let user = new Users();
            user.nickname = req.body.nickname;
            user.score = req.body.score;
            user.myTurn = req.body.myTurn;


            user.save(function(err){
                if (err) {
                    console.log(err);
                    return;
                } else {
                    console.log("successfully added")
                   res.send(user);
                }
                
            });
        }
    })
});

module.exports = router

