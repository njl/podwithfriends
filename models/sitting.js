var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var db = mongoose.createConnection('mongodb://localhost/podwithfriends');

var SittingSchema = new mongoose.Schema({
  podcast: {
    xid: String,
    title: String,
    description: String,
    show_title: String,
    duration: Number,
    network: String,
    date_created: Date,
    audio_url: String,
    image_thumb_url: String,
    image_full_url: String
  },
<<<<<<< HEAD
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchema'
  }]
=======
  user_ids: [String]
>>>>>>> 383bd19f0cdc7f6aa229e09f6a50888de43b1c2a
});

exports = module.exports = db.model('Sitting', SittingSchema);
