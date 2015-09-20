var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	var current_podcasts = [
		{
			"title": "This American Life",
			"episode": "Episode Name",
			"total_listeners": "8",
			"length": 1800, //30 minutes, 1800 seconds
			"current_time": 800, //current timestamp in stream

		},
		{
			"title": "This American Life",
			"episode": "Episode Name",
			"total_listeners": "4",
			"length": 1800, //30 minutes, 1800 seconds
			"current_time": 1200, //current timestamp in stream

		},
		{
			"title": "This American Life",
			"episode": "Episode Name",
			"total_listeners": "6",
			"length": 1800, //30 minutes, 1800 seconds
			"current_time": 200, //current timestamp in stream

		},
		{
			"title": "This American Life",
			"episode": "Episode Name",
			"total_listeners": "12",
			"length": 1800, //30 minutes, 1800 seconds
			"current_time": 300, //current timestamp in stream

		}
	];

  res.render('index', {current_podcasts: current_podcasts, req:req});

});

module.exports = router;
