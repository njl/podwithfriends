var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/podwithfriends');

var UserSchema = new mongoose.Schema({username: String,
                    _id: String, //email
                    password: String});

UserSchema.methods.validPassword = function(pw){
    return bcrypt.compareSync(pw, this.password);
}
UserSchema.methods.encryptPassword = function(){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
};

exports = module.exports = mongoose.model('User', UserSchema);
