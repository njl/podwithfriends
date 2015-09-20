var express = require('express');
var router = express.Router();
var Sitting = require('../models/sitting');

var api = require('../lib/audiosearch'); // require('../lib/pmp');

router.get('/chat', function(req, res, next){
  res.render('chat');
});

router.get('/create/:xid', function(req, res, next) {
  api.fetch(req.params.xid, function(err, data) {
    if (err) {
      err.status = 500;
      next(err);
    }
    else if (!req.user) {
      err = {status: 401, message: 'You must login first'};
      next(err);
    }
    else {
      var model = new Sitting();
      model.podcast = data;
      model.save(function(err) {
        if (err) {
          err.status = 500;
          console.error(err);
          res.send('that didnt work');
        }
        else {
          res.redirect('/sittings/' + model._id);
        }
      });
    }
  });
});

router.get('/:id', function(req, res, next) {
  Sitting.findById(req.params.id, function(err, model) {
    if (err) {
      err.status = 404;
      next(err);
    }
    else {
      if (req.user) {
        model.user_ids = _.uniq(_.union(model.user_ids, [req.user._id]));
      }
      model.save(function(err) {
        if (err) {
          err.status = 500;
          next(err);
        }
        else {
          res.render('sitting', {sitting: model, current_user: req.user});
        }
      });
    }
  });
});


module.exports = router;
