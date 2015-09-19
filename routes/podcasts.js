var express = require('express');
var router = express.Router();

// init PMP
var pmp = require('../lib/pmp');

/* GET podcasts listing. */
router.get('/', function(req, res, next) {

  // query params (with defaults)
  var params = {
    profile: 'story',
    has:     'audio,image',
    limit:   req.query.limit || 10 ,
    text:    req.query.text || null
  };

  // ask the pmp
  pmp.sdk.queryDocs(params, function(query, resp) {
    var formatted = {
      total: query.total(),
      podcasts: []
    };

    if (query.items && query.items.length) {
      query.items.forEach(function(story) {
        formatted.podcasts.push(pmp.formatStory(story));
      });
    }

    res.json(formatted);
  });

});

module.exports = router;
