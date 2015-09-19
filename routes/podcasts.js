var express = require('express');
var router = express.Router();

// init PMP
var pmp = require('../lib/pmp');

/* GET podcasts listing. */
router.get('/', function(req, res, next) {
  var searchText = req.query.q || null;

  // query params (with defaults)
  pmp.query(searchText, function(err, data) {
    if (err) {
      err.status = 500;
      next(err);
    }
    else {
      res.render('podcasts', data);
    }
  });

});

module.exports = router;
