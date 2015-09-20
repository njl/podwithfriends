var express = require('express');
var router = express.Router();

// init podcast source api
// var api = require('../lib/audiosearch');
var api = require('../lib/pmp');

/* GET podcasts listing. */
router.get('/', function(req, res, next) {
  var searchText = req.query.q || null;
  var searchPage = req.query.p || 1;

  // query params (with defaults)
  api.query(searchText, searchPage, function(err, data) {
    if (err) {
      err.status = 500;
      next(err);
    }
    else {
      res.json(data);
    }
  });
});

/* FETCH a single podcast. */
router.get('/:id', function(req, res, next) {
  pmp.fetch(req.params.id, function(err, data) {
    if (err) {
      err.status = 500;
      next(err);
    }
    else {
      res.json(data || null);
    }
  });
});

module.exports = router;
