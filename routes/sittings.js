var express = require('express');
var router = express.Router();
var app = require('../app');

router.get('/chat', function(req, res, next){
    res.render('chat');
});


module.exports = router;
