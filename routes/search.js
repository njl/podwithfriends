var express = require('express');
var router = express.Router();

var api = require('../lib/pmp');

router.get('/', function(req, res, next) {
  api.query(req.query.q, req.query.p || 1, function(err, data) {
    if (err) {
      err.status = 500;
      next(err);
    }
    else {
      res.render('search', {query: req.query.q, data: data});
    }
  });
});

module.exports = router;
