var express = require('express');
var router = express.Router();
var Sitting = require('../models/sitting');

/* GET home page. */


router.get('/', function(req, res, next) {

	Sitting.find().exec(function(err, data) {

    _.each(data, function(sitting) {
      sitting.elapsed = ((new Date().getTime()) - sitting.started_at) / 1000;
    });

		res.render('index', {sittings: data, current_user: req.user});
	});

});

module.exports = router;
