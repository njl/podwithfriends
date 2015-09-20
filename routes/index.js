var express = require('express');
var router = express.Router();
var Sitting = require('../models/sitting');

/* GET home page. */


router.get('/', function(req, res, next) {

<<<<<<< HEAD
	var current_podcasts = [
		{
			"id":0,
			"title": "This American Life",
			"episode": "Episode Name",
			"total_listeners": "8",
			"length": 1800, //30 minutes, 1800 seconds
			"current_time": 800, //current timestamp in stream

		},
		{
			"id":1,
			"title": "This American Life",
			"episode": "Episode Name",
			"total_listeners": "4",
			"length": 1800, //30 minutes, 1800 seconds
			"current_time": 1200, //current timestamp in stream

		},
		{
			"id":2,
			"title": "This American Life",
			"episode": "Episode Name",
			"total_listeners": "6",
			"length": 1800, //30 minutes, 1800 seconds
			"current_time": 200, //current timestamp in stream

		},
		{
			"id":3,
			"title": "This American Life",
			"episode": "Episode Name",
			"total_listeners": "12",
			"length": 1800, //30 minutes, 1800 seconds
			"current_time": 300, //current timestamp in stream

		}
	];

  res.render('index', {current_podcasts: current_podcasts, current_user: req.user});
=======
	Sitting.find().exec(function(err, data) {
		res.render('index', {sittings: data, current_user: req.user});
	});



>>>>>>> 383bd19f0cdc7f6aa229e09f6a50888de43b1c2a

});

module.exports = router;
