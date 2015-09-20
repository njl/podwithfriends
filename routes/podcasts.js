var express = require('express');
var router = express.Router();

// init PMP
var pmp = require('../lib/pmp');

/* GET podcasts listing. */
router.get('/', function(req, res, next) {
  var searchText = req.query.q || null;
  var searchPage = req.query.p || 1;

  // query params (with defaults)
  pmp.query(searchText, searchPage, function(err, data) {
    if (err) {
      err.status = 500;
      next(err);
    }
    else {
      res.json(data);
    }
  });

});

module.exports = router;
