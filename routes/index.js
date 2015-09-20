var express = require('express');
var router = express.Router();
var Sitting = require('../models/sitting');

/* GET home page. */


router.get('/', function(req, res, next) {

	Sitting.find().exec(function(err, data) {
		res.render('index', {sittings: data, current_user: req.user});
	});

});

module.exports = router;
