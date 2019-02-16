var mongoose = require('mongoose')
var passwordLocalMongoose = require('passport-local-mongoose')


var UserScehma = new mongoose.Schema({
    username:String,
    password:String
})

UserScehma.plugin(passwordLocalMongoose)
module.exports = mongoose.model("User", UserScehma)

